package com.iade.vyt.repositories;

import com.iade.vyt.models.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    Optional<Feedback> findByFeedbackTarefa_TarefaId(int tarefaId);
}
