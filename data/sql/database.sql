CREATE TABLE IF NOT EXISTS userVyT(
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(30) ,
    email VARCHAR(50) UNIQUE ,
    password_hash VARCHAR(100) ,
);

CREATE TABLE IF NOT EXISTS tokens(
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES userVyT(user_id)
);