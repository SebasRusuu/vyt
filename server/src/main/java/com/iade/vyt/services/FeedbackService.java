package com.iade.vyt.services;

import com.iade.vyt.models.Feedback;
import com.iade.vyt.models.Tarefa;
import com.iade.vyt.repositories.FeedbackRepository;
import com.iade.vyt.repositories.TarefaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final TarefaRepository tarefaRepository;

    public FeedbackService(FeedbackRepository feedbackRepository, TarefaRepository tarefaRepository) {
        this.feedbackRepository = feedbackRepository;
        this.tarefaRepository = tarefaRepository;
    }

    public Feedback createFeedback(int tarefaId, int feedbackValor, String feedbackComentario) {
        // Buscar a tarefa pelo ID
        Tarefa tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

        // Atualizar o valor de feedback na tarefa
        tarefa.setFeedbackValor(feedbackValor);
        tarefaRepository.save(tarefa); // Salvar a tarefa atualizada no banco de dados

        // Criar e salvar o feedback
        Feedback feedback = new Feedback();
        feedback.setFeedbackTarefa(tarefa);
        feedback.setFeedbackValor(feedbackValor);
        feedback.setFeedbackComentario(feedbackComentario);

        return feedbackRepository.save(feedback);
    }


    public Feedback getFeedbackById(int feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback não encontrado"));
    }

    public Feedback getFeedbackByTarefaId(int tarefaId) {
        return feedbackRepository.findByFeedbackTarefa_TarefaId(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Feedback não encontrado"));
    }

}
