// TarefaService.java
package com.iade.vyt.services;

import com.iade.vyt.models.Feedback;
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
    private final FeedbackService feedbackService;

    public TarefaService(TarefaRepository tarefaRepository, UserRepository userRepository, FeedbackService feedbackService) {
        this.tarefaRepository = tarefaRepository;
        this.userRepository = userRepository;
        this.feedbackService = feedbackService;
    }

    public void associateTarefaWithUser(Tarefa tarefa, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilizador não encontrado."));
        tarefa.setTarefaUser(user); // Associa o utilizador à tarefa
    }

    public List<Tarefa> getIncompleteTarefasByUserId(int userId) {
        return tarefaRepository.findByTarefaUserUserIdAndTarefaCompletada(userId, false);
    }

    public List<Tarefa> getCompleteTarefasByUserId(int userId) {
        return tarefaRepository.findByTarefaUserUserIdAndTarefaCompletada(userId, true);
    }

    public void markAsCompleted(int tarefaId) {
        System.out.println("[DEBUG] Marcando tarefa como completada. ID: " + tarefaId);

        // Buscar a tarefa pelo ID
        Tarefa tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
        System.out.println("[DEBUG] Tarefa encontrada: " + tarefa);

        // Atualizar o status para completada
        tarefa.setTarefaCompletada(true);
        tarefaRepository.save(tarefa);

        System.out.println("[DEBUG] Tarefa marcada como completada com sucesso. ID: " + tarefaId);
    }


    public void deleteTarefa(int tarefaId) {
        Tarefa tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
        tarefaRepository.delete(tarefa);
    }

    public Tarefa createTarefa(Tarefa tarefa) {
        System.out.println("Salvando no banco de dados: " + tarefa);
        return tarefaRepository.save(tarefa);
    }

    public Tarefa updateTarefa(int tarefaId, Tarefa tarefa) {
        Tarefa tarefaToUpdate = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
        tarefaToUpdate.setTarefaTitulo(tarefa.getTarefaTitulo());
        tarefaToUpdate.setTarefaDescricao(tarefa.getTarefaDescricao());
        tarefaToUpdate.setTarefaPrioridade(tarefa.getTarefaPrioridade());
        tarefaToUpdate.setTarefaDuracao(tarefa.getTarefaDuracao());
        tarefaToUpdate.setTarefaDataConclusao(tarefa.getTarefaDataConclusao());
        tarefaToUpdate.setTarefaCategoria(tarefa.getTarefaCategoria());
        tarefaToUpdate.setTarefaFaseDoDia(tarefa.getTarefaFaseDoDia());
        tarefaToUpdate.setTarefaCompletada(tarefa.isTarefaCompletada());
        return tarefaRepository.save(tarefaToUpdate);
    }

    public Tarefa getTarefaById(int tarefaId) {
        return tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada."));
    }

}