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

import java.sql.Time;
import java.sql.Timestamp;

@Entity
@Table(name = "tarefas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tarefa_id")
    @Setter(AccessLevel.NONE)
    private int tarefaId;

    @ManyToOne
    @JoinColumn(name = "tarefa_user_id", referencedColumnName = "user_id")
    private User tarefaUser;

    @Column(name = "tarefa_titulo")
    private String tarefaTitulo;

    @Column(name = "tarefa_descricao")
    private String tarefaDescricao;

    @Column(name = "tarefa_prioridade")
    private int tarefaPrioridade;

    @Column(name = "tarefa_importancia")
    private int tarefaImportancia;

    @Column(name = "tarefa_preferencia_tempo")
    private Time tarefaPreferenciaTempo;

    @Column(name = "tarefa_criacao_at")
    private Timestamp tarefaCriacaoAt;
}
