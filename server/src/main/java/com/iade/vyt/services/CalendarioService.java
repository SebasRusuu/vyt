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

@Service
public class CalendarioService {

    private final CalendarioRepository calendarioRepository;
    private final TarefaService tarefaService;
    private final UserRepository userRepository;
    private final IAService iaService;

    public CalendarioService(CalendarioRepository calendarioRepository,
                             TarefaService tarefaService,
                             UserRepository userRepository,
                             IAService iaService) {
        this.calendarioRepository = calendarioRepository;
        this.tarefaService = tarefaService;
        this.userRepository = userRepository;
        this.iaService = iaService;
    }

    // Métod0 atualizado para verificar se há novas tarefas antes de gerar o calendário
    public void generateSchedule(int userId) {
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
    }

    public List<Calendario> getUserSchedule(int userId) {
        // Caso o calendário não exista, retorna uma lista vazia
        return calendarioRepository.findByUserUserId(userId);
    }
}

