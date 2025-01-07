package com.iade.vyt.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.iade.vyt.models.Tarefa;


@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Integer> {
}