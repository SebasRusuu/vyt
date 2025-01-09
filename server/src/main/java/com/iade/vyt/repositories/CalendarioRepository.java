package com.iade.vyt.repositories;

import com.iade.vyt.models.Calendario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CalendarioRepository extends JpaRepository<Calendario, Integer> {
    List<Calendario> findByUserUserId(int userId);
}
