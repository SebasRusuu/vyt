package com.iade.vyt.services;

import com.iade.vyt.models.User;
import com.iade.vyt.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.iade.vyt.models.Tarefa;
import com.iade.vyt.repositories.TarefaRepository;

import java.util.List;

@Service
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final UserRepository userRepository;

    public TarefaService(TarefaRepository tarefaRepository, UserRepository userRepository) {
        this.tarefaRepository = tarefaRepository;
        this.userRepository = userRepository;
    }

    public void associateTarefaWithUser(Tarefa tarefa, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilizador não encontrado."));
        tarefa.setTarefaUser(user); // Associa o utilizador à tarefa
    }

    public List<Tarefa> getTarefasByUserId(int userId) {
        List<Tarefa> tarefas = tarefaRepository.findByTarefaUserUserId(userId);
        if (tarefas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nenhuma tarefa encontrada para o utilizador.");
        }
        return tarefas;
    }

    public Tarefa createTarefa(Tarefa tarefa) {
        return tarefaRepository.save(tarefa);
    }

    public void deleteTarefa(int tarefaId) {
        Tarefa tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
        tarefaRepository.delete(tarefa);
    }

    public Tarefa updateTarefa(Tarefa tarefa) {
        Tarefa existingTarefa = tarefaRepository.findById(tarefa.getTarefaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
        existingTarefa.setTarefaTitulo(tarefa.getTarefaTitulo());
        existingTarefa.setTarefaDescricao(tarefa.getTarefaDescricao());
        existingTarefa.setTarefaImportanciaPrioridade(tarefa.getTarefaImportanciaPrioridade());
        existingTarefa.setTarefaPreferenciaTempo(tarefa.getTarefaPreferenciaTempo());
        return tarefaRepository.save(existingTarefa);
    }

    public Tarefa getTarefaById(int tarefaId) {
        return tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
    }

    public void markAsCompleted(int tarefaId) {
        Tarefa tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
        tarefa.setTarefaCompletada(true); // Marca como completada
        tarefaRepository.save(tarefa);
    }

    public List<Tarefa> getCompletedTarefasByUserId(int userId) {
        return tarefaRepository.findByTarefaUserUserIdAndTarefaCompletada(userId, true);
    }

    public List<Tarefa> getIncompleteTarefasByUserId(int userId) {
        return tarefaRepository.findByTarefaUserUserIdAndTarefaCompletada(userId, false);
    }

}