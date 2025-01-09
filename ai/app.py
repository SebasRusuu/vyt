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
except FileNotFoundError:
    model = None
    print("Modelo não encontrado. Certifique-se de treinar o modelo antes.")

@app.route("/generate-schedule", methods=["POST"])
def generate_schedule_api():
    try:
        user_data = request.get_json()
        tasks = user_data.get("tasks", [])
        schedule = generate_schedule(tasks, model)
        return jsonify(schedule), 200
    except Exception as e:
        print("[ERROR] Exception occurred:")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route("/train", methods=["POST"])
def train_model():
    try:
        from scripts.train import train_model
        completed_tasks = request.get_json().get("completed_tasks", [])
        train_model(completed_tasks)
        return jsonify({"message": "Modelo treinado com sucesso!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
