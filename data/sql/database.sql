CREATE TABLE IF NOT EXISTS uservyt(
    user_id SERIAL PRIMARY KEY not null,
    user_name VARCHAR(30) not null,
    email VARCHAR(50) UNIQUE not null,
    password_hash VARCHAR(100) not null
    );

CREATE TABLE IF NOT EXISTS tokens(
    token_id SERIAL PRIMARY KEY,
    token_user_id INT NOT NULL,
    token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (token_user_id) REFERENCES uservyt(user_id)
    );
CREATE TABLE if not exists tarefas(
    tarefa_id serial primary key,
    tarefa_user_id int,
    tarefa_titulo VARCHAR(70),
    tarefa_descricao VARCHAR(255),
    tarefa_prioridade int,
    tarefa_importancia int,
    tarefa_preferencia_tempo time,
    tarefa_criacao_at timestamp,
    FOREIGN KEY (tarefa_user_id) REFERENCES uservyt(user_id)

    );

CREATE TABLE if not exists feedback(
    feedback_id serial primary key,
    feedback_user_id int,
    feedback_tarefa_id int,
    feedback_performance int,
    feedback_comentario VARCHAR(50),
    FOREIGN KEY (feedback_user_id) REFERENCES uservyt(user_id),
    FOREIGN KEY (feedback_tarefa_id) REFERENCES tarefas(tarefa_id)
    );

CREATE TABLE if not exists horario(
    horario_id serial primary key,
    horario_user_id int,
    horario_tarefa_id int,
    horario_data date,
    horario_tempo time,
    horario_status VARCHAR(50),
    FOREIGN KEY (horario_user_id) REFERENCES uservyt(user_id),
    FOREIGN KEY (horario_tarefa_id) REFERENCES tarefas(tarefa_id)
    );