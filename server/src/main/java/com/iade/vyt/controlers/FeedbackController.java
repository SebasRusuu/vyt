package com.iade.vyt.controlers;

import com.iade.vyt.models.Feedback;
import com.iade.vyt.services.FeedbackService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.iade.vyt.services.CalendarioService;

import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private final FeedbackService feedbackService;
    private final CalendarioService calendarioService; // Adicionar o CalendarioService

    public FeedbackController(FeedbackService feedbackService, CalendarioService calendarioService) {
        this.feedbackService = feedbackService;
        this.calendarioService = calendarioService; // Injetar corretamente
    }

    @PostMapping("/{tarefaId}")
    public ResponseEntity<Feedback> createFeedback(
            @PathVariable int tarefaId,
            @RequestBody Map<String, Object> feedbackData,
            HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id");

        if (userId == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        int feedbackValor = (int) feedbackData.get("feedbackValor");
        String feedbackComentario = (String) feedbackData.get("feedbackComentario");

        Feedback feedback = feedbackService.createFeedback(tarefaId, feedbackValor, feedbackComentario);

        // Enviar tarefas completadas para a IA
        calendarioService.sendCompletedTasksToIA(userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
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
