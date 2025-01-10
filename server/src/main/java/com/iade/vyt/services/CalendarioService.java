package com.iade.vyt.services;

import com.iade.vyt.models.Calendario;
import com.iade.vyt.models.ScheduleResponse;
import com.iade.vyt.models.ScheduleTask;
import com.iade.vyt.models.Tarefa;
import com.iade.vyt.repositories.CalendarioRepository;
import com.iade.vyt.repositories.TarefaRepository;
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
    private final TarefaRepository tarefaRepository;
    private final UserRepository userRepository;
    private final IAService iaService;
    private final Map<Integer, Boolean> userScheduleLocks = new ConcurrentHashMap<>();

    public CalendarioService(CalendarioRepository calendarioRepository,
                             TarefaService tarefaService, TarefaRepository tarefaRepository,
                             UserRepository userRepository,
                             IAService iaService) {
        this.calendarioRepository = calendarioRepository;
        this.tarefaService = tarefaService;
        this.tarefaRepository = tarefaRepository;
        this.userRepository = userRepository;
        this.iaService = iaService;
    }

    public void generateSchedule(int userId) {
        if (userScheduleLocks.putIfAbsent(userId, true) != null) {
            System.out.println("[INFO] Geração de calendário já em andamento para userId: " + userId);
            return;
        }

        try {
            var user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

            // Buscar tarefas incompletas
            List<Tarefa> tarefasIncompletas = tarefaService.getIncompleteTarefasByUserId(userId).stream()
                    .filter(tarefa -> !tarefa.isTarefaCompletada()) // Ignorar tarefas completas
                    .toList();

            if (tarefasIncompletas.isEmpty()) {
                System.out.println("[INFO] Nenhuma nova tarefa encontrada para userId: " + userId);
                return;
            }

            ScheduleResponse scheduleResponse = iaService.generateSchedule(tarefasIncompletas);

            if (scheduleResponse == null || scheduleResponse.getTasks().isEmpty()) {
                System.out.println("[INFO] Nenhum horário gerado pela IA.");
                return;
            }

            // Salvar o calendário no banco de dados
            for (ScheduleTask task : scheduleResponse.getTasks()) {
                Tarefa tarefa = tarefaService.getTarefaById(task.getId());
                if (tarefa.isTarefaCompletada()) continue;

                Calendario calendario = new Calendario();
                calendario.setUser(user);
                calendario.setTarefa(tarefa);
                calendario.setData(Date.valueOf(task.getDate()));
                calendario.setHoraInicio(Time.valueOf(task.getHoraInicio()));
                calendario.setHoraFim(Time.valueOf(task.getHoraFim()));

                try {
                    calendarioRepository.save(calendario);
                    System.out.println("[DEBUG] Calendário salvo no banco: " + calendario);
                } catch (Exception e) {
                    System.err.println("[ERROR] Erro ao salvar o calendário no banco de dados: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            System.out.println("[INFO] Calendário gerado e salvo com sucesso para userId: " + userId);
        } finally {
            userScheduleLocks.remove(userId);
        }
    }


    public List<Calendario> getUserSchedule(int userId) {
        List<Calendario> allSchedules = calendarioRepository.findByUserUserId(userId);

        if (allSchedules.isEmpty()) {
            System.out.println("[DEBUG] Nenhum calendário encontrado para userId: " + userId);
        } else {
            System.out.println("[DEBUG] Calendários encontrados para userId " + userId + ": " + allSchedules);
        }

        return allSchedules;
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

