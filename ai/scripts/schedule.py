from .train import predict_task_schedule
from datetime import datetime, timedelta

def convert_time_to_hours(duration_str):
    """Converte 'hh:mm:ss' para horas decimais ou retorna diretamente se já for float."""
    if isinstance(duration_str, float):
        return duration_str
    time_parts = list(map(int, duration_str.split(":")))
    return time_parts[0] + time_parts[1] / 60 + time_parts[2] / 3600

def format_time(decimal_time):
    """Converte tempo decimal (e.g., 10.5) para o formato HH:MM."""
    hours = int(decimal_time)
    minutes = int((decimal_time - hours) * 60)
    return f"{hours:02}:{minutes:02}"

def can_schedule(day, start_slot, duration, phase, task_category, schedule, phase_slots, hours_per_day, max_hours_per_day, time_slots):
    """Verifica se a tarefa pode ser alocada."""
    slots_needed = int(duration * 2)
    end_slot = start_slot + slots_needed

    if start_slot < phase_slots[phase][0] or end_slot > phase_slots[phase][1]:
        return False
    if hours_per_day[day] + duration > max_hours_per_day:
        return False
    if not all(not time_slots[day][i] for i in range(start_slot, end_slot)):
        return False
    if schedule[day]:
        last_task = schedule[day][-1]
        if last_task["tarefaCategoria"] == task_category:
            return False
    return True

def generate_schedule(tasks, model, work_start=8, work_end=22, max_hours_per_day=8):
    """Organiza as tarefas respeitando prioridade, deadline, feedback e fase do dia."""
    start_date = datetime.now().date()
    end_date = max(datetime.strptime(t["tarefaDataConclusao"], "%Y-%m-%d").date() for t in tasks)
    days = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

    schedule = {day.isoformat(): [] for day in days}
    hours_per_day = {day.isoformat(): 0 for day in days}

    phase_slots = {
        "Manhã": (0, int((13 - work_start) * 2)),
        "Tarde": (int((13 - work_start) * 2), int((18 - work_start) * 2)),
        "Noite": (int((18 - work_start) * 2), int((work_end - work_start) * 2)),
    }

    time_slots = {day.isoformat(): [False] * ((work_end - work_start) * 2) for day in days}

    # Ordenar tarefas por prioridade e prazo
    tasks.sort(key=lambda t: (-t["tarefaPrioridade"], datetime.strptime(t["tarefaDataConclusao"], "%Y-%m-%d")))

    for task in tasks:
        duration = convert_time_to_hours(task["tarefaDuracao"])
        phase = task.get("tarefaFaseDoDia", "Manhã")
        deadline_date = datetime.strptime(task["tarefaDataConclusao"], "%Y-%m-%d").date()

        best_day, best_slot, best_feedback = None, None, float("-inf")

        for day in days:
            day_str = day.isoformat()

            # Adicionar penalização para tarefas atrasadas
            delay_penalty = max(0, (day - deadline_date).days)

            start_slot, end_slot = phase_slots[phase]
            for slot in range(start_slot, end_slot):
                if can_schedule(day_str, slot, duration, phase, task["tarefaCategoria"], schedule, phase_slots, hours_per_day, max_hours_per_day, time_slots):
                    temp_task = task.copy()
                    temp_task["tarefaDuracao"] = duration
                    predicted_feedback = predict_task_schedule(temp_task, model)

                    # Ajustar feedback com penalização por atraso
                    predicted_feedback -= delay_penalty

                    if predicted_feedback > best_feedback:
                        best_day, best_slot, best_feedback = day_str, slot, predicted_feedback

        if best_day and best_slot is not None:
            start_time = work_start + best_slot / 2
            end_time = start_time + duration
            schedule[best_day].append({
                "tarefaTitulo": task["tarefaTitulo"],
                "start": format_time(start_time),
                "end": format_time(end_time),
                "phase": phase,
                "tarefaCategoria": task["tarefaCategoria"],
                "tarefaCompletada": task.get("tarefaCompletada", False)  # Adicionado campo tarefaCompletada
            })
            for i in range(best_slot, best_slot + int(duration * 2)):
                time_slots[best_day][i] = True
            hours_per_day[best_day] += duration

    remaining_tasks = [t for t in tasks if not any(t["tarefaTitulo"] in d["tarefaTitulo"] for day in schedule.values() for d in day)]
    print("Tarefas não agendadas:", remaining_tasks)

    return schedule
