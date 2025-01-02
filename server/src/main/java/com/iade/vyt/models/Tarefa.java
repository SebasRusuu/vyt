// Tarefa.java
package com.iade.vyt.models;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Time;
import java.sql.Timestamp;
import org.hibernate.annotations.CreationTimestamp;

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

    @Column(name = "tarefa_importancia_prioridade")
    private String tarefaImportanciaPrioridade;

    @Column(name = "tarefa_preferencia_tempo")
    private Time tarefaPreferenciaTempo;

    @CreationTimestamp
    @Column(name = "tarefa_criacao_at", updatable = false)
    private Timestamp tarefaCriacaoAt;
}

