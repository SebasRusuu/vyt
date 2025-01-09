package com.iade.vyt.services;

import com.iade.vyt.models.Tarefa;
import com.iade.vyt.models.ScheduleResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

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
        String url = "http://ai_service:5001/generate-schedule";
        System.out.println("[INFO] Chamando IA com tarefas: " + tarefas);

        List<Map<String, Object>> tarefasFormatted = tarefas.stream().map(tarefa -> {
            Map<String, Object> map = new HashMap<>();
            map.put("title", tarefa.getTarefaTitulo());
            map.put("duration", tarefa.getTarefaDuracao().toString());
            map.put("deadline", tarefa.getTarefaDataConclusao().toString());
            map.put("priority", tarefa.getTarefaPrioridade());
            map.put("category", tarefa.getTarefaCategoria());
            map.put("phase_of_day", tarefa.getTarefaFaseDoDia());
            return map;
        }).collect(Collectors.toList());

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

}
