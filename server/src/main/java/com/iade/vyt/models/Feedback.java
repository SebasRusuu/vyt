package com.iade.vyt.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn; 

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
    @JoinColumn(name = "feedback_user_id", referencedColumnName = "user_id")
    private User feedbackUser;

    @ManyToOne
    @JoinColumn(name = "feedback_tarefa_id", referencedColumnName = "tarefa_id")
    private Tarefa feedbackTarefa;

    @Column(name = "feedback_performance")
    private int feedbackPerformance;

    @Column(name = "feedback_comentario")
    private String feedbackComentario;
}
