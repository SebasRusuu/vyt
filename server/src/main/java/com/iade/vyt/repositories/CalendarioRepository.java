package com.iade.vyt.repositories;

import com.iade.vyt.models.Calendario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CalendarioRepository extends JpaRepository<Calendario, Integer> {
    @Query("SELECT c FROM Calendario c WHERE c.user.userId = :userId")
    List<Calendario> findByUserUserId(@Param("userId") int userId);
}

