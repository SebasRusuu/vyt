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

    @GetMapping("/completed/{userId}")
    public List<Tarefa> getCompletedTarefasByUser(@PathVariable int userId) {
        return tarefaService.getCompletedTarefasByUserId(userId);
    }

    @GetMapping("/incomplete/{userId}")
    public List<Tarefa> getIncompleteTarefasByUser(@PathVariable int userId) {
        return tarefaService.getIncompleteTarefasByUserId(userId);
    }

    @PostMapping("/create")
    public ResponseEntity<Tarefa> createTarefa(@RequestBody Tarefa tarefa, HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id");

        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Token inválido
        }

        tarefaService.associateTarefaWithUser(tarefa, userId);
        tarefa.setTarefaCompletada(false);
        Tarefa createdTarefa = tarefaService.createTarefa(tarefa);
        return new ResponseEntity<>(createdTarefa, HttpStatus.CREATED);
    }

    @DeleteMapping("/delete/{tarefaId}")
    public ResponseEntity<Void> deleteTarefa(@PathVariable int tarefaId) {
        tarefaService.deleteTarefa(tarefaId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
    }

    @PutMapping("/update")
    public ResponseEntity<Tarefa> updateTarefa(@RequestBody Tarefa tarefa) {
        Tarefa updatedTarefa = tarefaService.updateTarefa(tarefa);
        return new ResponseEntity<>(updatedTarefa, HttpStatus.OK);
    }

    @GetMapping("/id/{tarefaId}")
    public Tarefa getTarefaById(@PathVariable int tarefaId) {
        return tarefaService.getTarefaById(tarefaId);
    }
    @PutMapping("/complete/{tarefaId}")
    public ResponseEntity<Void> markTarefaAsCompleted(@PathVariable int tarefaId) {
        tarefaService.markAsCompleted(tarefaId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}

