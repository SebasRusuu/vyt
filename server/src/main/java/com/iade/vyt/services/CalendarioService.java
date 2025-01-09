package com.iade.vyt.services;

import com.iade.vyt.models.Calendario;
import com.iade.vyt.models.ScheduleResponse;
import com.iade.vyt.models.ScheduleTask;
import com.iade.vyt.models.Tarefa;
import com.iade.vyt.repositories.CalendarioRepository;
import com.iade.vyt.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CalendarioService {

    private final CalendarioRepository calendarioRepository;
    private final TarefaService tarefaService;
    private final UserRepository userRepository;
    private final IAService iaService;
    private final Map<Integer, Boolean> userScheduleLocks = new ConcurrentHashMap<>();

    public CalendarioService(CalendarioRepository calendarioRepository,
                             TarefaService tarefaService,
                             UserRepository userRepository,
                             IAService iaService) {
        this.calendarioRepository = calendarioRepository;
        this.tarefaService = tarefaService;
        this.userRepository = userRepository;
        this.iaService = iaService;
    }

    public void generateSchedule(int userId) {
        // Evitar múltiplas gerações de calendário simultâneas para o mesmo usuário
        if (userScheduleLocks.putIfAbsent(userId, true) != null) {
            System.out.println("[INFO] Geração de calendário já em andamento para userId: " + userId);
            return; // Outra requisição já está sendo processada
        }

        try {
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

            // Passo 1: Buscar tarefas incompletas
            List<Tarefa> tarefasIncompletas = tarefaService.getIncompleteTarefasByUserId(userId);

            // Verificar se já existe um calendário para essas tarefas
            boolean hasNewTasks = tarefasIncompletas.stream()
                    .anyMatch(tarefa -> calendarioRepository.findByUserUserId(userId).stream()
                            .noneMatch(calendario -> calendario.getTarefa().getTarefaId() == tarefa.getTarefaId()));

            if (!hasNewTasks) {
                System.out.println("[INFO] Nenhuma nova tarefa encontrada. Calendário não será gerado.");
                return; // Não gera um novo calendário
            }

            System.out.println("[INFO] Novas tarefas encontradas. Gerando calendário...");

            // Passo 2: Chamar a IA para gerar o calendário
            ScheduleResponse scheduleResponse = iaService.generateSchedule(tarefasIncompletas);

            // Passo 3: Salvar o calendário no banco de dados
            for (ScheduleTask task : scheduleResponse.getTasks()) {
                Calendario calendario = new Calendario();
                calendario.setUser(user);

                Tarefa tarefa = tarefaService.getTarefaById(task.getId());
                calendario.setTarefa(tarefa);

                calendario.setData(Date.valueOf(task.getDate()));
                calendario.setHoraInicio(Time.valueOf(task.getHoraInicio()));
                calendario.setHoraFim(Time.valueOf(task.getHoraFim()));

                calendarioRepository.save(calendario);
            }

            System.out.println("[INFO] Calendário gerado e salvo com sucesso!");
        } finally {
            userScheduleLocks.remove(userId); // Liberar o bloqueio após o processamento
        }
    }



    public List<Calendario> getUserSchedule(int userId) {
        // Buscar todas as entradas no calendário associadas ao usuário
        List<Calendario> allSchedules = calendarioRepository.findByUserUserId(userId);

        // Logs detalhados para depuração
        System.out.println("[DEBUG] Todas as entradas do calendário para o usuário: " + allSchedules);

        // Filtrar tarefas incompletas (tarefaCompletada = false)
        List<Calendario> filteredSchedules = allSchedules.stream()
                .filter(calendario -> !calendario.getTarefa().isTarefaCompletada())
                .toList();

        System.out.println("[DEBUG] Entradas filtradas (tarefas incompletas): " + filteredSchedules);

        return filteredSchedules;
    }



    public void sendCompletedTasksToIA(int userId) {
        List<Tarefa> completedTasks = tarefaService.getCompleteTarefasByUserId(userId);

        // Filtrar apenas as tarefas com feedback válido
        List<Tarefa> tasksWithFeedback = completedTasks.stream()
                .filter(tarefa -> tarefa.getFeedbackValor() != null) // Certificar que o feedback não é nulo
                .toList();

        if (!tasksWithFeedback.isEmpty()) {
            System.out.println("[INFO] Enviando tarefas completadas com feedback para a IA...");
            iaService.trainModel(tasksWithFeedback); // Treinar a IA com tarefas que possuem feedback associado
        } else {
            System.out.println("[INFO] Nenhuma tarefa com feedback encontrada para treinamento.");
        }
    }




}

