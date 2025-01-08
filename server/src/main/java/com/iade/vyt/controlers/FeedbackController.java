package com.iade.vyt.controlers;

import com.iade.vyt.models.Feedback;
import com.iade.vyt.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping("/{tarefaId}")
    public ResponseEntity<Feedback> createFeedback(
            @PathVariable int tarefaId,
            @RequestBody Map<String, Object> feedbackData) { // Atualizado para receber o corpo como JSON

        // Extração dos dados do corpo da requisição
        int feedbackValor = (int) feedbackData.get("feedbackValor");
        String feedbackComentario = (String) feedbackData.get("feedbackComentario");

        // Criação do feedback
        Feedback feedback = feedbackService.createFeedback(tarefaId, feedbackValor, feedbackComentario);
        return ResponseEntity.status(201).body(feedback);
    }

    @GetMapping("/id/{feedbackId}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable int feedbackId) {
        Feedback feedback = feedbackService.getFeedbackById(feedbackId);
        return ResponseEntity.ok(feedback);
    }

    @GetMapping("/tarefa/{tarefaId}")
    public ResponseEntity<Feedback> getFeedbackByTarefaId(@PathVariable int tarefaId) {
        Feedback feedback = feedbackService.getFeedbackByTarefaId(tarefaId);
        return ResponseEntity.ok(feedback);
    }

}
