# train.py
import pickle
from sklearn.linear_model import LinearRegression
import numpy as np
from .utils import encode_phase_of_day, encode_category, convert_time_to_hours, round_to_nearest_interval

def train_model(completed_tasks):
    # Adiciona tarefas genéricas se houver poucos dados
    if len(completed_tasks) < 5:
        completed_tasks += [
            {"tarefaTitulo": "Genérica Manhã", "tarefaDuracao": "01:00:00", "horaInicio": "09:00",
             "tarefaCategoria": "Trabalho", "tarefaFaseDoDia": "Manhã", "feedbackValor": 8},
            {"tarefaTitulo": "Genérica Tarde", "tarefaDuracao": "01:30:00", "horaInicio": "14:00",
             "tarefaCategoria": "Estudos", "tarefaFaseDoDia": "Tarde", "feedbackValor": 7},
        ]

    X = np.array([
        [
            convert_time_to_hours(t["tarefaDuracao"]),
            encode_category(t["tarefaCategoria"]),
            encode_phase_of_day(t["tarefaFaseDoDia"])
        ] for t in completed_tasks
    ])
    y = np.array([
        convert_time_to_hours(t["horaInicio"]) for t in completed_tasks
    ])

    model = LinearRegression()
    model.fit(X, y)

    with open("models/trained_model.pkl", "wb") as file:
        pickle.dump(model, file)
    print("[INFO] Modelo treinado com sucesso.")

def predict_task_time(task, completed_tasks, model):
    from collections import defaultdict
    # Filtrar tarefas semelhantes
    similares = [t for t in completed_tasks if t["tarefaCategoria"] == task["tarefaCategoria"]
                 and t["tarefaFaseDoDia"] == task["tarefaFaseDoDia"]]

    if similares:
        # Agrupar feedbacks por horaInicio e calcular média
        feedbacks = defaultdict(list)
        for t in similares:
            feedbacks[t["horaInicio"]].append(t["feedbackValor"])
        avg_feedback = {hora: sum(vals)/len(vals) for hora, vals in feedbacks.items()}

        # Retornar hora com maior feedback médio
        melhor_hora = max(avg_feedback, key=avg_feedback.get)
        return convert_time_to_hours(melhor_hora)

    # Se não houver tarefas semelhantes, use o modelo para prever
    X_test = np.array([[
        convert_time_to_hours(task["tarefaDuracao"]),
        encode_category(task["tarefaCategoria"]),
        encode_phase_of_day(task["tarefaFaseDoDia"])
    ]])
    # Prever e arredondar para o intervalo mais próximo
    return round_to_nearest_interval(model.predict(X_test)[0])
