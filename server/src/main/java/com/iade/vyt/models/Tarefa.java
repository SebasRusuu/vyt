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
import lombok.Setter;
import lombok.AccessLevel;

import java.sql.Time;
import java.sql.Timestamp;

@Entity
@Table(name = "tarefas")
@Data
public class Tarefa {

    public Tarefa() {
    }

    public Tarefa(int tarefaId, User tarefaUser, String tarefaTitulo, String tarefaDescricao,
                  int tarefaPrioridade, int tarefaImportancia, Time tarefaPreferenciaTempo,
                  Timestamp tarefaCriacaoAt) {
        this.tarefaId = tarefaId;
        this.tarefaUser = tarefaUser;
        this.tarefaTitulo = tarefaTitulo;
        this.tarefaDescricao = tarefaDescricao;
        this.tarefaPrioridade = tarefaPrioridade;
        this.tarefaImportancia = tarefaImportancia;
        this.tarefaPreferenciaTempo = tarefaPreferenciaTempo;
        this.tarefaCriacaoAt = tarefaCriacaoAt;
    }

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