package com.iade.vyt.controlers;

import com.iade.vyt.models.Tarefa;
import com.iade.vyt.services.TarefaService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/tarefa")
public class    TarefaController {

    private final TarefaService tarefaService;

    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @GetMapping("/{userId}")
    public List<Tarefa> getTarefasByUser(@PathVariable int userId) {
        return tarefaService.getTarefasByUserId(userId);
    }

    @PostMapping("/create")
    public ResponseEntity<Tarefa> createTarefa(@RequestBody Tarefa tarefa, HttpServletRequest request) {
        // Extrair o userId do token JWT
        Integer userId = (Integer) request.getAttribute("user_id");

        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Token inválido
        }

        // Associar o userId à tarefa
        tarefaService.associateTarefaWithUser(tarefa, userId);

        // Salvar a tarefa no banco de dados
        Tarefa createdTarefa = tarefaService.createTarefa(tarefa);
        return new ResponseEntity<>(createdTarefa, HttpStatus.CREATED);
    }
}

