package com.iade.vyt.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn; 

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    @Setter(AccessLevel.NONE)
    private int feedbackId;

    @ManyToOne
    @JoinColumn(name = "feedback_tarefa_id", referencedColumnName = "tarefa_id")
    private Tarefa feedbackTarefa;

    @Column(name = "feedback_valor")
    private int feedbackValor;

    @Column(name = "feedback_comentario")
    private String feedbackComentario;
}
