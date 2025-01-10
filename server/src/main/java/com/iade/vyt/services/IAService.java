package com.iade.vyt.services;

import com.iade.vyt.models.Tarefa;
import com.iade.vyt.models.ScheduleResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IAService {

    private final RestTemplate restTemplate;

    public IAService() {
        this.restTemplate = new RestTemplate();
    }

    public ScheduleResponse generateSchedule(List<Tarefa> tarefas) {
        String url = "http://aiservice:5001/generate-schedule";

        // Garantir que tarefas incompletas estão sendo enviadas
        List<Map<String, Object>> tarefasFormatted = tarefas.stream()
                .filter(tarefa -> !tarefa.isTarefaCompletada())
                .map(tarefa -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("tarefaTitulo", tarefa.getTarefaTitulo());
                    map.put("tarefaDuracao", tarefa.getTarefaDuracao().toString());
                    map.put("tarefaDataConclusao", new SimpleDateFormat("yyyy-MM-dd").format(tarefa.getTarefaDataConclusao()));
                    map.put("tarefaPrioridade", tarefa.getTarefaPrioridade());
                    map.put("tarefaCategoria", tarefa.getTarefaCategoria());
                    map.put("tarefaFaseDoDia", tarefa.getTarefaFaseDoDia());
                    map.put("tarefaCompletada", tarefa.isTarefaCompletada());
                    return map;
                })
                .toList();

        System.out.println("[DEBUG] Dados formatados para IA: " + tarefasFormatted);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(Map.of("tasks", tarefasFormatted), headers);

        try {
            ResponseEntity<ScheduleResponse> response = restTemplate.postForEntity(url, request, ScheduleResponse.class);
            System.out.println("[INFO] Resposta da IA: " + response.getBody());
            return response.getBody();
        } catch (Exception e) {
            System.err.println("[ERROR] Falha ao chamar a IA: " + e.getMessage());
            throw e;
        }
    }

    public void trainModel(List<Tarefa> completedTasks) {
        String url = "http://aiservice:5001/train"; // Endpoint para treinar o modelo

        List<Map<String, Object>> formattedTasks = completedTasks.stream().map(tarefa -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tarefaTitulo", tarefa.getTarefaTitulo());
            map.put("tarefaDuracao", tarefa.getTarefaDuracao().toString());
            map.put("tarefaDataConclusao", tarefa.getTarefaDataConclusao().toString());
            map.put("tarefaPrioridade", tarefa.getTarefaPrioridade());
            map.put("feedbackValor", tarefa.getFeedbackValor()); // Certifique-se de que o feedback está disponível
            map.put("tarefaCategoria", tarefa.getTarefaCategoria());
            map.put("tarefaFaseDoDia", tarefa.getTarefaFaseDoDia());
            map.put("tarefaCompletada", tarefa.isTarefaCompletada());
            return map;
        }).toList();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(Map.of("completed_tasks", formattedTasks), headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("[INFO] Resposta da IA: " + response.getBody());
        } catch (Exception e) {
            System.err.println("[ERROR] Falha ao enviar tarefas completadas para a IA: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
