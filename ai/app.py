from flask import Flask, jsonify, request
import pickle
import traceback
from scripts.schedule import generate_schedule

app = Flask(__name__)

# Carregar o modelo treinado
MODEL_PATH = "models/trained_model.pkl"

try:
    with open(MODEL_PATH, "rb") as file:
        model = pickle.load(file)
        print("[INFO] Modelo carregado com sucesso.")
except FileNotFoundError:
    model = None
    print("[ERROR] Modelo não encontrado. Certifique-se de treinar o modelo antes.")

@app.route("/generate-schedule", methods=["POST"])
def generate_schedule_api():
    try:
        user_data = request.get_json()
        print("[DEBUG] Dados recebidos na IA:", user_data)

        tasks = user_data.get("tasks", [])
        if not tasks:
            raise ValueError("Nenhuma tarefa fornecida.")

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
                    raise KeyError(f"Campo '{field}' ausente na tarefa: {task}")

        # Gerar cronograma (retorno agora vem já no formato {"tasks": [...]})
        schedule = generate_schedule(tasks, model)

        # schedule já é um dicionário com a chave "tasks", compatível com seu Java
        return jsonify(schedule), 200

    except KeyError as ke:
        print(f"[ERROR] Campo faltando: {ke}")
        return jsonify({"error": f"Campo faltando: {str(ke)}"}), 400
    except Exception as e:
        print("[ERROR] Exception occurred:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/train", methods=["POST"])
def train_model():
    try:
        from scripts.train import train_model
        completed_tasks = request.get_json().get("completed_tasks", [])
        if not completed_tasks:
            raise ValueError("Nenhuma tarefa completada fornecida para treinamento.")

        train_model(completed_tasks)  # Chama a lógica de treinamento
        return jsonify({"message": "Modelo treinado com sucesso!"}), 200

    except Exception as e:
        print("[ERROR] Falha no treinamento do modelo:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)