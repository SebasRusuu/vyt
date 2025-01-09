# Usar Python 3.11
FROM python:3.11-slim

# Configurar o diretório de trabalho no contêiner
WORKDIR /app

# Instalar dependências do sistema necessárias (ex.: gcc, build-essential)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copiar os arquivos necessários para o contêiner
COPY ./app.py ./requirements.txt ./
COPY ./models ./models
COPY ./scripts ./scripts

# Instalar dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Expor a porta usada pelo Flask
EXPOSE 5001

# Comando para rodar a aplicação
CMD ["python", "app.py"]
