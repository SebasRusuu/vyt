#!/bin/bash
set -e

# Treinar o modelo se não existir
if [ ! -f "models/trained_model.pkl" ]; then
    echo "[INFO] Modelo não encontrado. Treinando modelo inicial..."
    python app.py train  # Ajuste isso se sua aplicação tiver um comando CLI para treinar o modelo
fi

# Iniciar o serviço Flask
exec python app.py
