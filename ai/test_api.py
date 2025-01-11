from scripts.schedule import generate_schedule
from scripts.train import train_model
import pickle
import os

MODEL_PATH = "models/trained_model.pkl"

def run_schedule_test():
    # Conjunto fixo de tarefas completadas para treinamento
    completed_tasks = [
        # Tarefas com horários variados e feedbacks, focadas em "Trabalho" na "Manhã"
        {"tarefaTitulo": "Tarefa 1", "tarefaDuracao": "02:30:00", "horaInicio": "09:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 2", "tarefaDuracao": "01:30:00", "horaInicio": "09:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 3", "tarefaDuracao": "02:00:00", "horaInicio": "10:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 9},  # Feedback alto
        {"tarefaTitulo": "Tarefa 4", "tarefaDuracao": "03:00:00", "horaInicio": "10:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 4},
        {"tarefaTitulo": "Tarefa 5", "tarefaDuracao": "01:30:00", "horaInicio": "11:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 6", "tarefaDuracao": "02:30:00", "horaInicio": "11:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 7", "tarefaDuracao": "02:00:00", "horaInicio": "12:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 5},
        {"tarefaTitulo": "Tarefa 8", "tarefaDuracao": "01:00:00", "horaInicio": "12:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 4},
        {"tarefaTitulo": "Tarefa 9", "tarefaDuracao": "01:30:00", "horaInicio": "09:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 10", "tarefaDuracao": "02:30:00", "horaInicio": "09:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 11", "tarefaDuracao": "01:00:00", "horaInicio": "10:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 9},  # Feedback alto
        {"tarefaTitulo": "Tarefa 12", "tarefaDuracao": "03:00:00", "horaInicio": "10:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 3},
        {"tarefaTitulo": "Tarefa 13", "tarefaDuracao": "02:30:00", "horaInicio": "11:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 14", "tarefaDuracao": "01:30:00", "horaInicio": "11:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 15", "tarefaDuracao": "01:00:00", "horaInicio": "12:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 5},
        {"tarefaTitulo": "Tarefa 16", "tarefaDuracao": "02:00:00", "horaInicio": "12:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 4},
        {"tarefaTitulo": "Tarefa 17", "tarefaDuracao": "02:30:00", "horaInicio": "09:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 18", "tarefaDuracao": "01:30:00", "horaInicio": "09:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 19", "tarefaDuracao": "02:00:00", "horaInicio": "10:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 9},  # Feedback alto
        {"tarefaTitulo": "Tarefa 20", "tarefaDuracao": "03:00:00", "horaInicio": "10:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 10},
        {"tarefaTitulo": "Tarefa 21", "tarefaDuracao": "01:30:00", "horaInicio": "11:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 22", "tarefaDuracao": "02:30:00", "horaInicio": "11:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 23", "tarefaDuracao": "02:00:00", "horaInicio": "12:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 5},
        {"tarefaTitulo": "Tarefa 24", "tarefaDuracao": "01:00:00", "horaInicio": "12:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 4},
        {"tarefaTitulo": "Tarefa 25", "tarefaDuracao": "01:30:00", "horaInicio": "09:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 26", "tarefaDuracao": "02:30:00", "horaInicio": "09:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 27", "tarefaDuracao": "01:00:00", "horaInicio": "10:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 9},  # Feedback alto
        {"tarefaTitulo": "Tarefa 28", "tarefaDuracao": "03:00:00", "horaInicio": "10:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 8},
        {"tarefaTitulo": "Tarefa 29", "tarefaDuracao": "02:30:00", "horaInicio": "11:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 7},
        {"tarefaTitulo": "Tarefa 30", "tarefaDuracao": "01:30:00", "horaInicio": "11:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 6},
        {"tarefaTitulo": "Tarefa 31", "tarefaDuracao": "01:00:00", "horaInicio": "12:00",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 5},
        {"tarefaTitulo": "Tarefa 32", "tarefaDuracao": "02:00:00", "horaInicio": "12:30",
         "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 4},
        # Adicione mais tarefas se necessário para robustez
    ]

    # Treinar ou recarregar modelo
    if not os.path.exists(MODEL_PATH):
        print("[INFO] Modelo não encontrado. Treinando modelo com dados controlados...")
        train_model(completed_tasks)

    # Carregar o modelo treinado
    with open(MODEL_PATH, "rb") as file:
        model = pickle.load(file)

    # Definir a nova tarefa similar para agendamento
    tasks = [
        {
            "tarefaTitulo": "Nova Reunião",  # Nova tarefa com mesma categoria e fase do dia
            "tarefaDuracao": "02:00:00",
            "tarefaCategoria": "Trabalho",
            "tarefaFaseDoDia": "Manhã",
            "tarefaPrioridade": 5,
            "tarefaDataConclusao": "2025-01-15",
            "tarefaCompletada": False
        }
    ]

    # Gerar e imprimir o cronograma
    schedule = generate_schedule(tasks, model, completed_tasks)
    print(schedule)

if __name__ == "__main__":
    run_schedule_test()
