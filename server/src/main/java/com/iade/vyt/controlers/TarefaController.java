package com.iade.vyt.controlers;

import com.iade.vyt.models.Tarefa;
import com.iade.vyt.services.CalendarioService;
import com.iade.vyt.services.TarefaService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;


@RestController
@RequestMapping("/api/tarefa")
public class TarefaController {

    private final TarefaService tarefaService;
    private final CalendarioService calendarioService;

    public TarefaController(TarefaService tarefaService, CalendarioService calendarioService) {
        this.tarefaService = tarefaService;
        this.calendarioService = calendarioService;
    }

    @PostMapping("/create")
    public ResponseEntity<Tarefa> createTarefa(@RequestBody Tarefa tarefa, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id"); // Agora o user_id será configurado

        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Token inválido
        }

        System.out.println("Recebido no Controller: " + tarefa);

        tarefaService.associateTarefaWithUser(tarefa, userId);
        tarefa.setTarefaCompletada(false);
        Tarefa createdTarefa = tarefaService.createTarefa(tarefa);

        System.out.println("Enviado para o banco de dados: " + createdTarefa);

        return new ResponseEntity<>(createdTarefa, HttpStatus.CREATED);
    }

    @GetMapping("/incomplete")
    public ResponseEntity<?> getIncompleteTarefasByUser(HttpServletRequest request) {
        try {
            Integer userId = (Integer) request.getAttribute("user_id");

            if (userId == null) {
                return new ResponseEntity<>("Usuário não autenticado ou token inválido.", HttpStatus.FORBIDDEN);
            }

            List<Tarefa> tarefas = tarefaService.getIncompleteTarefasByUserId(userId);
            return ResponseEntity.ok(tarefas);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro ao buscar tarefas: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/completed")
    public ResponseEntity<?> getCompleteTarefasByUser(HttpServletRequest request) {
        try {
            Integer userId = (Integer) request.getAttribute("user_id");

            if (userId == null) {
                return new ResponseEntity<>("Usuário não autenticado ou token inválido.", HttpStatus.FORBIDDEN);
            }

            List<Tarefa> tarefas = tarefaService.getCompleteTarefasByUserId(userId);
            return ResponseEntity.ok(tarefas);
        } catch (Exception e) {
            return new ResponseEntity<>("Erro ao buscar tarefas: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/complete/{tarefaId}")
    public ResponseEntity<Void> markTarefaAsCompleted(@PathVariable int tarefaId, HttpServletRequest request) {
        System.out.println("[DEBUG] Requisição recebida para completar tarefa. ID: " + tarefaId);

        Integer userId = (Integer) request.getAttribute("user_id");
        if (userId == null) {
            System.out.println("[ERROR] Usuário não autenticado.");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        try {
            // Apenas marcar a tarefa como completada
            tarefaService.markAsCompleted(tarefaId);
            System.out.println("[DEBUG] Tarefa marcada como completada: " + tarefaId);

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (ResponseStatusException e) {
            System.err.println("[ERROR] Erro no processamento: " + e.getReason());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("[ERROR] Erro inesperado: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @DeleteMapping("/delete/{tarefaId}")
    public ResponseEntity<Void> deleteTarefa(@PathVariable int tarefaId, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id");

        if (userId == null) {
            System.out.println("Erro: User ID não encontrado. Token inválido ou usuário não autenticado.");
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        tarefaService.deleteTarefa(tarefaId);
        System.out.println("Tarefa excluída com sucesso.");
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @PutMapping("/update/{tarefaId}")
    public ResponseEntity<Void> updateTarefa(@PathVariable int tarefaId, @RequestBody Tarefa tarefa, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id");

        if (userId == null) {
            System.out.println("Erro: User ID não encontrado. Token inválido ou usuário não autenticado.");
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        tarefaService.updateTarefa(tarefaId, tarefa);
        System.out.println("Tarefa atualizada com sucesso.");
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/id/{tarefaId}")
    public ResponseEntity<?> getTarefaById(@PathVariable int tarefaId, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id");

        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        Tarefa tarefa = tarefaService.getTarefaById(tarefaId);
        return ResponseEntity.ok(tarefa);
    }
    
}

