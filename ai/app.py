from flask import Flask, jsonify, request
import pickle
import traceback
import os
from scripts.schedule import generate_schedule

app = Flask(__name__)

# Caminho do modelo
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "trained_model.pkl")

# Garantir que o diretório 'models' existe
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

# Carregar ou treinar o modelo
try:
    if not os.path.exists(MODEL_PATH):
        print("[INFO] Modelo não encontrado. Treinando modelo inicial...")

    with open(MODEL_PATH, "rb") as file:
        model = pickle.load(file)
        print("[INFO] Modelo carregado com sucesso de:", MODEL_PATH)
except Exception as e:
    print(f"[ERROR] Falha ao carregar ou treinar o modelo: {e}")
    model = None


@app.route("/generate-schedule", methods=["POST"])
def generate_schedule_api():
    try:
        user_data = request.get_json()
        print("[DEBUG] Dados recebidos na IA:", user_data)

        tasks = user_data.get("tasks", [])
        if not tasks:
            print("[INFO] Nenhuma tarefa fornecida para o utilizador.")
            return jsonify({"tasks": []}), 200

        # Validação de campos obrigatórios
        required_fields = [
            "tarefaTitulo",
            "tarefaDuracao",
            "tarefaDataConclusao",
            "tarefaPrioridade",
            "tarefaCategoria",
            "tarefaFaseDoDia",
            "tarefaCompletada"
        ]
        for task in tasks:
            for field in required_fields:
                if field not in task:
                    print(f"[ERROR] Campo '{field}' ausente na tarefa: {task}")
                    return jsonify({"error": f"Campo '{field}' ausente na tarefa: {task}"}), 400

        # Gerar cronograma com uma lista vazia para completed_tasks
        schedule = generate_schedule(tasks, model, [])
        print("[DEBUG] Cronograma gerado pela IA:", schedule)

        return jsonify(schedule), 200

    except Exception as e:
        print("[ERROR] Exception occurred:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



@app.route("/train", methods=["POST"])
def train_model_api():
    try:
        from scripts.train import train_model
        completed_tasks = request.get_json().get("completed_tasks", [])
        print("[DEBUG] Dados recebidos para treinamento:", completed_tasks)  # Log
        if not completed_tasks:
            raise ValueError("Nenhuma tarefa completada fornecida para treinamento.")

        # Certifique-se de que o diretório de modelos existe
        if not os.path.exists(MODEL_DIR):
            os.makedirs(MODEL_DIR)
            print(f"[DEBUG] Diretório '{MODEL_DIR}' criado.")

        train_model(completed_tasks)  # Chama a lógica de treinamento
        return jsonify({"message": "Modelo treinado com sucesso!"}), 200

    except Exception as e:
        print("[ERROR] Falha no treinamento do modelo:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

