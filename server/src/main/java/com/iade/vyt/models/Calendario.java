package com.iade.vyt.models;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Time;
import java.util.Date;

@Entity
@Table(name = "calendario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Calendario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "calendario_id")
    @Setter(AccessLevel.NONE)
    private int calendarioId;

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "tarefa_id", referencedColumnName = "tarefa_id")
    private Tarefa tarefa;

    @Column(name = "data")
    private Date data;

    @Column(name = "hora_inicio")
    private Time horaInicio;

    @Column(name = "hora_fim")
    private Time horaFim;
}
