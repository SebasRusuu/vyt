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

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private TarefaRepository tarefaRepository;

    public Feedback createFeedback(int tarefaId, int feedbackValor, String feedbackComentario) {
        Tarefa tarefa = tarefaRepository.findById(tarefaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada"));

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
