# schedule.py
from datetime import datetime, timedelta
import traceback
from .utils import encode_phase_of_day, convert_time_to_hours, format_time
from .train import predict_task_time, round_to_nearest_interval

def can_schedule(day, start_slot, duration, phase_slots, time_slots):
    slots_needed = int(duration * 2)  # Cada slot representa 30 minutos
    end_slot = start_slot + slots_needed
    if start_slot < phase_slots[0] or end_slot > phase_slots[1]:
        print(f"[DEBUG] Falha na verificação de slots: start_slot={start_slot}, end_slot={end_slot}, phase_slots={phase_slots}")
        return False
    if not all(not time_slots[day][i] for i in range(start_slot, end_slot)):
        print(f"[DEBUG] Slots ocupados detectados entre {start_slot} e {end_slot} no dia {day}")
        return False
    return True

def schedule_task(day, start_slot, duration, phase_slots, time_slots, schedule, task):
    try:
        task_end_slot = start_slot + int(float(duration) * 2)
        if start_slot < phase_slots[0] or task_end_slot > phase_slots[1]:
            print(f"[DEBUG] Limites de fase do dia não atendidos para a tarefa {task['tarefaTitulo']}.")
            return False
        if not all(not time_slots[day][i] for i in range(start_slot, task_end_slot)):
            print(f"[DEBUG] Slots ocupados para a tarefa {task['tarefaTitulo']} no dia {day}.")
            return False

        for i in range(start_slot, task_end_slot):
            time_slots[day][i] = True

        schedule[day].append({
            "tarefaTitulo": task["tarefaTitulo"],
            "start": format_time(8 + start_slot / 2),
            "end": format_time(8 + task_end_slot / 2),
            "tarefaCategoria": task["tarefaCategoria"],
        })
        print(f"[DEBUG] Tarefa '{task['tarefaTitulo']}' agendada no dia {day} das {format_time(8 + start_slot / 2)} às {format_time(8 + task_end_slot / 2)}.")
        return True
    except Exception as e:
        print(f"[ERROR] Falha ao agendar tarefa: {e}")
        return False

def generate_schedule(tasks, model, completed_tasks, work_start=8, work_end=22, max_hours_per_day=8):
    try:
        if not tasks:
            print("[DEBUG] Nenhuma tarefa recebida pela IA.")
            return {"tasks": []}

        start_date = datetime.now().date()
        end_date = max(datetime.strptime(t["tarefaDataConclusao"], "%Y-%m-%d").date() for t in tasks)
        days = [start_date + timedelta(days=i) for i in range((end_date - start_date).days + 1)]

        print(f"[DEBUG] Dias calculados para agendamento: {days}")

        schedule = {day.isoformat(): [] for day in days}
        time_slots = {day.isoformat(): [False] * ((work_end - work_start) * 2) for day in days}

        # Ordenar tarefas por prioridade e data de conclusão
        tasks.sort(
            key=lambda t: (-t["tarefaPrioridade"], datetime.strptime(t["tarefaDataConclusao"], "%Y-%m-%d"))
        )
        print(f"[DEBUG] Tarefas após ordenação: {tasks}")

        for task in tasks:
            print(f"[DEBUG] Processando tarefa: {task['tarefaTitulo']}")
            phase = encode_phase_of_day(task.get("tarefaFaseDoDia", "Manhã"))
            phase_slots = {
                1: (0, 10),   # Manhã: 08:00 - 13:00 -> 10 slots
                2: (10, 20),  # Tarde: 13:00 - 18:00 -> 10 slots
                3: (20, 28),  # Noite: 18:00 - 22:00 -> 8 slots
            }.get(phase, (0, 28))
            print(f"[DEBUG] Fase do dia: {task.get('tarefaFaseDoDia', 'Manhã')} codificada como {phase} com phase_slots {phase_slots}")

            duration = convert_time_to_hours(task["tarefaDuracao"])
            print(f"[DEBUG] Duração da tarefa '{task['tarefaTitulo']}': {duration} horas")

            predicted_time = predict_task_time(task, completed_tasks, model)
            print(f"[DEBUG] Horário previsto para '{task['tarefaTitulo']}': {predicted_time} (em horas decimais)")

            rounded_time = round_to_nearest_interval(predicted_time)
            print(f"[DEBUG] Horário arredondado para intervalo mais próximo: {rounded_time}")

            task_start_slot = int((rounded_time - work_start) * 2)
            print(f"[DEBUG] Slot inicial calculado para '{task['tarefaTitulo']}': {task_start_slot}")

            # Dentro do loop for day in days em generate_schedule:

            for day in days:
                day_str = day.isoformat()
                print(f"[DEBUG] Tentando agendar '{task['tarefaTitulo']}' no dia {day_str}")

                if day == start_date:
                    current_time = datetime.now()
                    current_time_slot = int(((current_time.hour + current_time.minute/60) - work_start) * 2)
                    # Verifica se ainda há slots disponíveis na fase atual
                    if current_time_slot < phase_slots[1]:
                        phase_slots = (max(phase_slots[0], current_time_slot), phase_slots[1])
                        print(f"[DEBUG] Ajuste de phase_slots para o dia atual: {phase_slots}")
                    else:
                        print(f"[DEBUG] Nenhum slot disponível hoje após {current_time.hour}:{current_time.minute}. Pulando para o próximo dia.")
                        continue  # Pula o dia atual se não houver slots disponíveis

                if schedule_task(day_str, task_start_slot, float(duration), phase_slots, time_slots, schedule, task):
                    print(f"[DEBUG] Tarefa '{task['tarefaTitulo']}' agendada com sucesso no dia {day_str}")
                    break
                else:
                    print(f"[DEBUG] Não foi possível agendar '{task['tarefaTitulo']}' no dia {day_str}")


        print(f"[DEBUG] Cronograma final: {schedule}")
        return {"tasks": [t for day in schedule.values() for t in day]}
    except Exception as e:
        print("[ERROR] Erro ao gerar calendário:", e)
        traceback.print_exc()
        return {"tasks": []}
