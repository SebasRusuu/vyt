import pickle
from sklearn.linear_model import LinearRegression
import numpy as np
from datetime import datetime

def convert_time_to_hours(duration_str):
    """Converte 'hh:mm:ss' para horas decimais ou retorna diretamente se já for float."""
    if isinstance(duration_str, float):
        return duration_str
    time_parts = list(map(int, duration_str.split(":")))
    return time_parts[0] + time_parts[1] / 60 + time_parts[2] / 3600

def clean_date(date_str):
    """Remove qualquer tempo adicional da data"""
    return date_str.split(" ")[0]  # Retorna apenas a parte da data

def encode_category(category):
    """Codifica categorias como números."""
    categories = {
        "Trabalho": 1, "Lazer": 2, "Saúde": 3, "Estudos": 4, "Casa": 5,
        "Social": 6, "Financeiro": 7, "Desenvolvimento Pessoal": 8, "Viagens": 9, "Recados": 10
    }
    return categories.get(category, 0)  # Default: 0 para desconhecidas

def encode_phase_of_day(phase):
    """Codifica as fases do dia (manhã, tarde, noite)."""
    phases = {"Manhã": 1, "Tarde": 2, "Noite": 3}
    return phases.get(phase, 0)  # Default: 0

def train_model(completed_tasks):
    """Treina o modelo com base nas tarefas completadas."""
    print("[DEBUG] Tarefas completadas recebidas para treinamento:", completed_tasks)

    required_fields = [
        "tarefaTitulo", "tarefaDuracao", "tarefaDataConclusao", "tarefaPrioridade",
        "feedbackValor", "tarefaCategoria", "tarefaFaseDoDia", "tarefaCompletada"
    ]
    for task in completed_tasks:
        for field in required_fields:
            if field not in task:
                raise KeyError(f"Campo '{field}' ausente na tarefa: {task}")

    X = np.array([
        [
            float(convert_time_to_hours(t["tarefaDuracao"])),  # Duração
            encode_category(t["tarefaCategoria"]),            # Categoria
            encode_phase_of_day(t["tarefaFaseDoDia"]),        # Fase do dia
            t.get("tarefaPrioridade", 1),                     # Prioridade
            (datetime.strptime(clean_date(t["tarefaDataConclusao"]), "%Y-%m-%d") - datetime.now()).days,  # Dias até prazo
            1 if t["tarefaCompletada"] else 0                 # Completada (0 ou 1)
        ]
        for t in completed_tasks
    ])
    y = np.array([t["feedbackValor"] for t in completed_tasks])

    model = LinearRegression()
    model.fit(X, y)

    with open("models/trained_model.pkl", "wb") as file:
        pickle.dump(model, file)
    print("[INFO] Modelo treinado e salvo com sucesso.")


def predict_task_schedule(task, model):
    """
    Prevê o feedback esperado para uma tarefa com base no modelo treinado.
    """
    try:
        duration = float(convert_time_to_hours(task.get("tarefaDuracao", "00:00:00")))
        category = encode_category(task.get("tarefaCategoria", ""))
        phase_of_day = encode_phase_of_day(task.get("tarefaFaseDoDia", ""))
        priority = task.get("tarefaPrioridade", 1)
        days_to_deadline = (
            (datetime.strptime(task["tarefaDataConclusao"], "%Y-%m-%d") - datetime.now()).days
            if "tarefaDataConclusao" in task
            else 0
        )
        tarefa_completada = 1 if task.get("tarefaCompletada", False) else 0

        X_new = np.array([[duration, category, phase_of_day, priority, days_to_deadline, tarefa_completada]])
        predicted_feedback = model.predict(X_new)
        return predicted_feedback[0]

    except Exception as e:
        print(f"[ERROR] Previsão falhou para a tarefa: {task}")
        print(f"[DETAILS] {e}")
        return -1  # fallback




# Exemplo de como treinar o modelo com dados de tarefas completadas
completed_tasks = [
    {"tarefaTitulo": "Estudar", "tarefaDuracao": "02:00:00", "tarefaDataConclusao": "2025-01-10", "tarefaPrioridade": 3, "feedbackValor": 8, "tarefaCategoria": "Estudos", "tarefaFaseDoDia": "Manhã", "tarefaCompletada": True},
    {"tarefaTitulo": "Trabalho", "tarefaDuracao": "03:00:00", "tarefaDataConclusao": "2025-01-12", "tarefaPrioridade": 5, "feedbackValor": 9, "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True},
    {"tarefaTitulo": "Exercício", "tarefaDuracao": "01:30:00", "tarefaDataConclusao": "2025-01-08", "tarefaPrioridade": 4, "feedbackValor": 7, "tarefaCategoria": "Saúde", "tarefaFaseDoDia": "Manhã", "tarefaCompletada": True},
    {"tarefaTitulo": "Leitura", "tarefaDuracao": "01:30:00", "tarefaDataConclusao": "2025-01-15", "tarefaPrioridade": 2, "feedbackValor": 6, "tarefaCategoria": "Lazer", "tarefaFaseDoDia": "Noite", "tarefaCompletada": True},
    {"tarefaTitulo": "Reunião", "tarefaDuracao": "01:00:00", "tarefaDataConclusao": "2025-01-14", "tarefaPrioridade": 5, "feedbackValor": 9, "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True},
    {"tarefaTitulo": "Compra de mantimentos", "tarefaDuracao": "02:00:00", "tarefaDataConclusao": "2025-01-18", "tarefaPrioridade": 3, "feedbackValor": 8, "tarefaCategoria": "Casa", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True},
    {"tarefaTitulo": "Meditação", "tarefaDuracao": "00:45:00", "tarefaDataConclusao": "2025-01-10", "tarefaPrioridade": 2, "feedbackValor": 7, "tarefaCategoria": "Saúde", "tarefaFaseDoDia": "Manhã", "tarefaCompletada": True},
    {"tarefaTitulo": "Trabalho de casa", "tarefaDuracao": "02:30:00", "tarefaDataConclusao": "2025-01-13", "tarefaPrioridade": 4, "feedbackValor": 8, "tarefaCategoria": "Estudos", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True},
    {"tarefaTitulo": "Exercício", "tarefaDuracao": "01:00:00", "tarefaDataConclusao": "2025-01-16", "tarefaPrioridade": 5, "feedbackValor": 9, "tarefaCategoria": "Saúde", "tarefaFaseDoDia": "Manhã", "tarefaCompletada": True},
    {"tarefaTitulo": "Relaxamento", "tarefaDuracao": "01:00:00", "tarefaDataConclusao": "2025-01-11", "tarefaPrioridade": 1, "feedbackValor": 5, "tarefaCategoria": "Lazer", "tarefaFaseDoDia": "Noite", "tarefaCompletada": True},
    {"tarefaTitulo": "Aulas de inglês", "tarefaDuracao": "01:30:00", "tarefaDataConclusao": "2025-01-20", "tarefaPrioridade": 3, "feedbackValor": 7, "tarefaCategoria": "Estudos", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True},
    {"tarefaTitulo": "Encontro com amigos", "tarefaDuracao": "02:00:00", "tarefaDataConclusao": "2025-01-17", "tarefaPrioridade": 4, "feedbackValor": 8, "tarefaCategoria": "Social", "tarefaFaseDoDia": "Noite", "tarefaCompletada": True},
    {"tarefaTitulo": "Planejamento financeiro", "tarefaDuracao": "01:00:00", "tarefaDataConclusao": "2025-01-21", "tarefaPrioridade": 3, "feedbackValor": 7, "tarefaCategoria": "Financeiro", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True},
    {"tarefaTitulo": "Leitura de relatório", "tarefaDuracao": "01:45:00", "tarefaDataConclusao": "2025-01-22", "tarefaPrioridade": 4, "feedbackValor": 8, "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "tarefaCompletada": True},
    {"tarefaTitulo": "Revisão de código", "tarefaDuracao": "02:00:00", "tarefaDataConclusao": "2025-01-19", "tarefaPrioridade": 5, "feedbackValor": 9, "tarefaCategoria": "Desenvolvimento Pessoal", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True},
    {"tarefaTitulo": "Organização de viagens", "tarefaDuracao": "03:00:00", "tarefaDataConclusao": "2025-01-23", "tarefaPrioridade": 3, "feedbackValor": 8, "tarefaCategoria": "Viagens", "tarefaFaseDoDia": "Tarde", "tarefaCompletada": True}
]

# Treinamento do modelo com tarefas completadas
train_model(completed_tasks)


# Carregar o modelo treinado
with open("models/trained_model.pkl", "rb") as file:
    model = pickle.load(file)

# Previsão para uma nova tarefa
new_task = {"tarefaTitulo": "Leitura", "tarefaDuracao": "01:30:00", "tarefaDataConclusao": "2025-01-09", "tarefaPrioridade": 2, "feedbackValor": None, "tarefaCategoria": "Lazer", "tarefaFaseDoDia": "Noite"}  # Tarefa nova, sem feedbackValor
predicted_feedbackValor = predict_task_schedule(new_task, model)
print(f"Previsão de feedbackValor para 'Leitura': {predicted_feedbackValor}")
