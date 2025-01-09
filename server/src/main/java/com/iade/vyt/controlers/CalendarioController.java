package com.iade.vyt.controlers;

import com.iade.vyt.models.Calendario;
import com.iade.vyt.services.CalendarioService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendario")
public class CalendarioController {

    private final CalendarioService calendarioService;

    public CalendarioController(CalendarioService calendarioService) {
        this.calendarioService = calendarioService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateSchedule(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id");
        System.out.println("[INFO] POST /generate chamado por userId: " + userId);

        if (userId == null) {
            System.err.println("[ERROR] Usuário não autenticado.");
            return new ResponseEntity<>("Usuário não autenticado.", HttpStatus.FORBIDDEN);
        }

        try {
            calendarioService.generateSchedule(userId);
            System.out.println("[INFO] Calendário gerado com sucesso para userId: " + userId);
            return new ResponseEntity<>("Calendário gerado com sucesso!", HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println("[ERROR] Falha ao gerar calendário: " + e.getMessage());
            return new ResponseEntity<>("Erro ao gerar o calendário: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserSchedule(HttpServletRequest request) {
        Integer userId = (Integer) request.getAttribute("user_id");
        System.out.println("[INFO] GET /user chamado por userId: " + userId);

        if (userId == null) {
            System.err.println("[ERROR] Usuário não autenticado.");
            return new ResponseEntity<>("Usuário não autenticado.", HttpStatus.FORBIDDEN);
        }

        try {
            List<Calendario> schedule = calendarioService.getUserSchedule(userId);
            System.out.println("[INFO] Retornando calendário para userId: " + userId);
            return ResponseEntity.ok(schedule);
        } catch (Exception e) {
            System.err.println("[ERROR] Falha ao buscar calendário: " + e.getMessage());
            return new ResponseEntity<>("Erro ao buscar o calendário: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
