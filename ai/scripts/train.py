import pickle
from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import datetime

def convert_time_to_hours(duration_str):
    """Converte 'hh:mm:ss' para horas decimais ou retorna diretamente se já for float."""
    if isinstance(duration_str, float):
        return duration_str  # Retorna diretamente se já for decimal
    time_parts = list(map(int, duration_str.split(":")))
    return time_parts[0] + time_parts[1] / 60 + time_parts[2] / 3600


def encode_category(category):
    """Codifica categorias como números."""
    categories = {
        "Trabalho": 1, "Lazer": 2, "Saúde": 3, "Estudos": 4, "Casa": 5,
        "Social": 6, "Financeiro": 7, "Desenvolvimento Pessoal": 8, "Viagens": 9, "Recados": 10
    }
    return categories.get(category, 0)  # Default: 0 para categorias desconhecidas

def encode_phase_of_day(phase):
    """Codifica as fases do dia (manhã, tarde, noite)."""
    phases = {"Manhã": 1, "Tarde": 2, "Noite": 3}
    return phases.get(phase, 0)  # Default: 0 para fases desconhecidas

def train_model(completed_tasks):
    """Treina o modelo com base nas tarefas completadas."""
    from datetime import datetime

    X = np.array([
        [
            float(convert_time_to_hours(t["duration"])),  # Duração
            encode_category(t["category"]),              # Categoria
            encode_phase_of_day(t["phase_of_day"]),       # Fase do dia
            t.get("priority", 1),                        # Prioridade (valor padrão 1 se não fornecido)
            (datetime.strptime(t["deadline"], "%Y-%m-%d") - datetime.now()).days  # Dias até o prazo
        ]
        for t in completed_tasks
    ])
    y = np.array([t["feedback"] for t in completed_tasks])  # Feedback

    model = LinearRegression()
    model.fit(X, y)

    with open("ai/models/trained_model.pkl", "wb") as file:
        pickle.dump(model, file)
    print("Modelo treinado e guardado com sucesso.")


def predict_task_schedule(task, model):
    """
    Prevê o feedback esperado para uma tarefa com base no modelo treinado.
    """
    try:
        # Validar e converter os parâmetros da tarefa
        duration = float(convert_time_to_hours(task.get("duration", "00:00:00")))
        category = encode_category(task.get("category", ""))
        phase_of_day = encode_phase_of_day(task.get("phase_of_day", ""))
        priority = task.get("priority", 1)  # Default de prioridade: 1
        days_to_deadline = (
            (datetime.strptime(task["deadline"], "%Y-%m-%d") - datetime.now()).days
            if "deadline" in task
            else 0
        )

        # Criar os dados para previsão com 5 features
        X_new = np.array([[duration, category, phase_of_day, priority, days_to_deadline]])

        # Realizar a previsão com o modelo treinado
        predicted_feedback = model.predict(X_new)
        return predicted_feedback[0]
    except Exception as e:
        print(f"[ERROR] Previsão falhou para a tarefa: {task}")
        print(f"[DETAILS] {e}")
        return -1  # Valor padrão em caso de falha




# Exemplo de como treinar o modelo com dados de tarefas completadas
completed_tasks = [
    {"title": "Estudar", "duration": "02:00:00", "deadline": "2025-01-10", "priority": 3, "feedback": 8, "category": "Estudos", "phase_of_day": "Manhã"},
    {"title": "Trabalho", "duration": "03:00:00", "deadline": "2025-01-12", "priority": 5, "feedback": 9, "category": "Trabalho", "phase_of_day": "Tarde"},
    {"title": "Exercício", "duration": "01:30:00", "deadline": "2025-01-08", "priority": 4, "feedback": 7, "category": "Saúde", "phase_of_day": "Manhã"},
    {"title": "Leitura", "duration": "01:30:00", "deadline": "2025-01-15", "priority": 2, "feedback": 6, "category": "Lazer", "phase_of_day": "Noite"},
    {"title": "Reunião", "duration": "01:00:00", "deadline": "2025-01-14", "priority": 5, "feedback": 9, "category": "Trabalho", "phase_of_day": "Tarde"},
    {"title": "Compra de mantimentos", "duration": "02:00:00", "deadline": "2025-01-18", "priority": 3, "feedback": 8, "category": "Casa", "phase_of_day": "Tarde"},
    {"title": "Meditação", "duration": "00:45:00", "deadline": "2025-01-10", "priority": 2, "feedback": 7, "category": "Saúde", "phase_of_day": "Manhã"},
    {"title": "Trabalho de casa", "duration": "02:30:00", "deadline": "2025-01-13", "priority": 4, "feedback": 8, "category": "Estudos", "phase_of_day": "Tarde"},
    {"title": "Exercício", "duration": "01:00:00", "deadline": "2025-01-16", "priority": 5, "feedback": 9, "category": "Saúde", "phase_of_day": "Manhã"},
    {"title": "Relaxamento", "duration": "01:00:00", "deadline": "2025-01-11", "priority": 1, "feedback": 5, "category": "Lazer", "phase_of_day": "Noite"},
    {"title": "Aulas de inglês", "duration": "01:30:00", "deadline": "2025-01-20", "priority": 3, "feedback": 7, "category": "Estudos", "phase_of_day": "Tarde"},
    {"title": "Encontro com amigos", "duration": "02:00:00", "deadline": "2025-01-17", "priority": 4, "feedback": 8, "category": "Social", "phase_of_day": "Noite"},
    {"title": "Planejamento financeiro", "duration": "01:00:00", "deadline": "2025-01-21", "priority": 3, "feedback": 7, "category": "Financeiro", "phase_of_day": "Tarde"},
    {"title": "Leitura de relatório", "duration": "01:45:00", "deadline": "2025-01-22", "priority": 4, "feedback": 8, "category": "Trabalho", "phase_of_day": "Manhã"},
    {"title": "Revisão de código", "duration": "02:00:00", "deadline": "2025-01-19", "priority": 5, "feedback": 9, "category": "Desenvolvimento Pessoal", "phase_of_day": "Tarde"},
    {"title": "Organização de viagens", "duration": "03:00:00", "deadline": "2025-01-23", "priority": 3, "feedback": 8, "category": "Viagens", "phase_of_day": "Tarde"},
    {"title": "Tarefas domésticas", "duration": "02:30:00", "deadline": "2025-01-24", "priority": 2, "feedback": 6, "category": "Casa", "phase_of_day": "Tarde"},
    {"title": "Pesquisas online", "duration": "01:30:00", "deadline": "2025-01-25", "priority": 2, "feedback": 6, "category": "Lazer", "phase_of_day": "Tarde"},
    {"title": "Estudo de caso", "duration": "02:00:00", "deadline": "2025-01-26", "priority": 5, "feedback": 9, "category": "Estudos", "phase_of_day": "Noite"},
    {"title": "Consultoria financeira", "duration": "02:00:00", "deadline": "2025-01-27", "priority": 4, "feedback": 8, "category": "Financeiro", "phase_of_day": "Tarde"},
    {"title": "Visita ao médico", "duration": "01:00:00", "deadline": "2025-01-28", "priority": 1, "feedback": 5, "category": "Saúde", "phase_of_day": "Manhã"},
    {"title": "Fazer compras online", "duration": "02:00:00", "deadline": "2025-01-29", "priority": 3, "feedback": 7, "category": "Casa", "phase_of_day": "Tarde"},
    {"title": "Aula de culinária", "duration": "03:00:00", "deadline": "2025-01-30", "priority": 4, "feedback": 8, "category": "Lazer", "phase_of_day": "Tarde"}
]

# Treinamento do modelo com tarefas completadas
train_model(completed_tasks)

# Carregar o modelo treinado
with open("ai/models/trained_model.pkl", "rb") as file:
    model = pickle.load(file)

# Previsão para uma nova tarefa
new_task = {"title": "Leitura", "duration": "01:30:00", "deadline": "2025-01-09", "priority": 2, "feedback": None, "category": "Lazer", "phase_of_day": "Noite"}  # Tarefa nova, sem feedback
predicted_feedback = predict_task_schedule(new_task, model)
print(f"Previsão de feedback para 'Leitura': {predicted_feedback}")
