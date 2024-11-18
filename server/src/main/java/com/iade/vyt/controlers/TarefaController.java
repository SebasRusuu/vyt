package com.iade.vyt.controlers;


import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tarefa")
public class TarefaController {

    @GetMapping("")
    public String getAllCategories(HttpServletRequest request) {
        int user_id = (int) request.getAttribute("user_id");
        return "All tarefas for user: " + user_id;
    }
}
