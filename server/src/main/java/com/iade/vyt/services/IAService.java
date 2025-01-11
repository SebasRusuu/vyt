package com.iade.vyt.services;

import com.iade.vyt.models.ScheduleResponse;
import com.iade.vyt.models.Tarefa;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IAService {

    private final RestTemplate restTemplate;
    private final String IA_GENERATE_URL = "http://aiservice:5001/generate-schedule";
    private final String IA_TRAIN_URL = "http://aiservice:5001/train";

    public IAService() {
        this.restTemplate = new RestTemplate();
    }

    public ScheduleResponse generateSchedule(List<Tarefa> tarefas) {
        // Preparação dos dados no formato esperado pela API Flask
        List<Map<String, Object>> tarefasFormatted = tarefas.stream()
                .filter(tarefa -> !tarefa.isTarefaCompletada())
                .map(tarefa -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("tarefaId", tarefa.getTarefaId());
                    map.put("tarefaTitulo", tarefa.getTarefaTitulo());
                    map.put("tarefaDuracao", tarefa.getTarefaDuracao().toString());
                    map.put("tarefaDataConclusao", new SimpleDateFormat("yyyy-MM-dd").format(tarefa.getTarefaDataConclusao()));
                    map.put("tarefaPrioridade", tarefa.getTarefaPrioridade());
                    map.put("tarefaCategoria", tarefa.getTarefaCategoria());
                    map.put("tarefaFaseDoDia", tarefa.getTarefaFaseDoDia());
                    map.put("tarefaCompletada", tarefa.isTarefaCompletada());
                    return map;
                })
                .collect(Collectors.toList());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("tasks", tarefasFormatted);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<ScheduleResponse> response = restTemplate.postForEntity(IA_GENERATE_URL, request, ScheduleResponse.class);
            return response.getBody();
        } catch (Exception e) {
            System.err.println("[ERROR] Falha ao chamar a IA: " + e.getMessage());
            throw e;
        }
    }

    public void trainModel(List<Tarefa> completedTasks) {
        // Preparação dos dados para o treinamento do modelo
        List<Map<String, Object>> formattedTasks = completedTasks.stream().map(tarefa -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tarefaTitulo", tarefa.getTarefaTitulo());
            map.put("tarefaDuracao", tarefa.getTarefaDuracao().toString());
            // Atualize a formatação da data conforme necessário:
            map.put("tarefaDataConclusao", new SimpleDateFormat("yyyy-MM-dd").format(tarefa.getTarefaDataConclusao()));
            map.put("tarefaPrioridade", tarefa.getTarefaPrioridade());
            map.put("feedbackValor", tarefa.getFeedbackValor());
            map.put("tarefaCategoria", tarefa.getTarefaCategoria());
            map.put("tarefaFaseDoDia", tarefa.getTarefaFaseDoDia());
            map.put("tarefaCompletada", tarefa.isTarefaCompletada());
            return map;
        }).collect(Collectors.toList());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        body.put("completed_tasks", formattedTasks);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(IA_TRAIN_URL, request, String.class);
            System.out.println("[INFO] Resposta da IA ao treinar: " + response.getBody());
        } catch (Exception e) {
            System.err.println("[ERROR] Falha ao enviar tarefas completadas para a IA: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
