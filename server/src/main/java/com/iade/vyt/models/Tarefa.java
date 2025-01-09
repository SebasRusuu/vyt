// Tarefa.java
package com.iade.vyt.models;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Time;
import java.util.Date;

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

    @Column(name = "tarefa_duracao")
    private Time tarefaDuracao;

    @Column(name = "tarefa_data_conclusao")
    private Date tarefaDataConclusao;

    @Column(name = "tarefa_categoria")
    private String tarefaCategoria;

    @Column(name = "tarefa_fasedodia")
    private String tarefaFaseDoDia;

    @Column(name = "tarefa_completada")
    private boolean tarefaCompletada;

    @Override
    public String toString() {
        return "Tarefa{" +
                "tarefaId=" + tarefaId +
                ", tarefaUser=" + tarefaUser +
                ", tarefaTitulo='" + tarefaTitulo + '\'' +
                ", tarefaDescricao='" + tarefaDescricao + '\'' +
                ", tarefaPrioridade=" + tarefaPrioridade +
                ", tarefaDuracao=" + tarefaDuracao +
                ", tarefaDataConclusao=" + tarefaDataConclusao +
                ", tarefaCategoria='" + tarefaCategoria + '\'' +
                ", tarefaFaseDoDia='" + tarefaFaseDoDia + '\'' +
                ", tarefaCompletada=" + tarefaCompletada +
                '}';
    }
}