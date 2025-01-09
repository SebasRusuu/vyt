// ScheduleResponse.java
package com.iade.vyt.models;

import lombok.Data;
import java.util.List;

@Data
public class ScheduleResponse {
    private List<ScheduleTask> tasks; // Lista de tarefas
}
