from datetime import datetime

def preprocess_tasks(tasks):
    """Converte as deadlines das tarefas em número de dias restantes."""
    for task in tasks:
        task["deadline"] = (datetime.strptime(task["deadline"], "%Y-%m-%d") - datetime.now()).days
    return tasks
