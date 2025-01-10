CREATE TABLE IF NOT EXISTS uservyt(
    user_id SERIAL PRIMARY KEY not null,
    user_name VARCHAR(30) not null,
    email VARCHAR(50) UNIQUE not null,
    password VARCHAR(100),
    provider VARCHAR(50) DEFAULT 'local'
    );

CREATE TABLE if not exists tarefas(
    tarefa_id serial primary key,
    tarefa_user_id int,
    tarefa_titulo VARCHAR(40),
    tarefa_descricao VARCHAR(255),
    tarefa_prioridade int,
    tarefa_duracao time,
    tarefa_data_conclusao date,
    tarefa_categoria VARCHAR(30),
    tarefa_fasedodia VARCHAR(30),
    tarefa_completada boolean,
    feedback_valor int,
    FOREIGN KEY (tarefa_user_id) REFERENCES uservyt(user_id)
    );

CREATE TABLE if not exists feedback(
    feedback_id serial primary key,
    feedback_tarefa_id int,
    feedback_valor int NOT NULL,
    feedback_comentario VARCHAR(100),
    FOREIGN KEY (feedback_tarefa_id) REFERENCES tarefas(tarefa_id)
    );

CREATE TABLE IF NOT EXISTS calendario(
     calendario_id SERIAL PRIMARY KEY NOT NULL,
     user_id INT NOT NULL,
     tarefa_id INT NOT NULL,
     data DATE NOT NULL,
     hora_inicio TIME NOT NULL,
     hora_fim TIME NOT NULL,
     FOREIGN KEY (user_id) REFERENCES uservyt(user_id),
     FOREIGN KEY (tarefa_id) REFERENCES tarefas(tarefa_id) ON DELETE CASCADE
    );
