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

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "horario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Horario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "horario_id")
    @Setter(AccessLevel.NONE)
    private int horarioId;

    @ManyToOne
    @JoinColumn(name = "horario_user_id", referencedColumnName = "user_id")
    private User horarioUser;

    @ManyToOne
    @JoinColumn(name = "horario_tarefa_id", referencedColumnName = "tarefa_id")
    private Tarefa horarioTarefa;

    @Column(name = "horario_data")
    private Date horarioData;

    @Column(name = "horario_tempo")
    private Time horarioTempo;

    @Column(name = "horario_status")
    private String horarioStatus;
}
