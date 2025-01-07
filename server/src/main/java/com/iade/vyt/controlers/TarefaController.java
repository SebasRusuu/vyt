package com.iade.vyt.controlers;

import com.iade.vyt.models.Tarefa;
import com.iade.vyt.services.TarefaService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/tarefa")
public class    TarefaController {

    private final TarefaService tarefaService;

    public TarefaController(TarefaService tarefaService) {
        this.tarefaService = tarefaService;
    }

    @PostMapping("/create")
    public ResponseEntity<Tarefa> createTarefa(@RequestBody Tarefa tarefa, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id"); // Agora o user_id será configurado

        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Token inválido
        }

        tarefaService.associateTarefaWithUser(tarefa, userId);
        tarefa.setTarefaCompletada(false);
        Tarefa createdTarefa = tarefaService.createTarefa(tarefa);
        return new ResponseEntity<>(createdTarefa, HttpStatus.CREATED);
    }


}