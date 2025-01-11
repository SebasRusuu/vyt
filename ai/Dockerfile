# Usar Python 3.11
FROM python:3.11-slim

# Configurar o diretório de trabalho no contêiner
WORKDIR /app

# Instalar dependências do sistema necessárias (ex.: gcc, build-essential)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Criar o diretório para os modelos
RUN mkdir -p models

# Copiar os arquivos necessários para o contêiner
COPY ./app.py ./requirements.txt ./
COPY ./scripts ./scripts
COPY ./entrypoint.sh ./entrypoint.sh
COPY ./test_api.py ./test_api.py

# Dar permissão de execução ao script de entrada e ao diretório de modelos
RUN chmod +x ./entrypoint.sh
RUN chmod -R 777 models

# Instalar dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Expor a porta usada pelo Flask
EXPOSE 5001

# Usar o script de entrada como comando padrão
ENTRYPOINT ["./entrypoint.sh"]
