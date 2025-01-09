// ScheduleTask.java
package com.iade.vyt.models;

import lombok.Data;

@Data
public class ScheduleTask {
    private int id; // ID da tarefa
    private String date; // Data em formato YYYY-MM-DD
    private String horaInicio; // Hora de início em formato HH:mm:ss
    private String horaFim; // Hora de fim em formato HH:mm:ss
}
