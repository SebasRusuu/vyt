import requests

# URL da API
url = "http://127.0.0.1:5001/generate-schedule"

# Conjunto de tarefas para teste
payload = {
    "tasks": [
        {"title": "Exercício", "duration": "01:30:00", "deadline": "2025-01-08", "priority": 4, "category": "Saúde", "phase_of_day": "Manhã"},
        {"title": "Reunião", "duration": "01:00:00", "deadline": "2025-01-09", "priority": 5, "category": "Trabalho", "phase_of_day": "Tarde"},
        {"title": "Estudar", "duration": "02:00:00", "deadline": "2025-01-10", "priority": 3, "category": "Estudos", "phase_of_day": "Manhã"},
        {"title": "Trabalho de casa", "duration": "02:30:00", "deadline": "2025-01-11", "priority": 4, "category": "Estudos", "phase_of_day": "Tarde"},
        {"title": "Relaxamento", "duration": "01:00:00", "deadline": "2025-01-12", "priority": 1, "category": "Lazer", "phase_of_day": "Noite"},
        {"title": "Planejamento financeiro", "duration": "01:00:00", "deadline": "2025-01-13", "priority": 3, "category": "Financeiro", "phase_of_day": "Tarde"},
        {"title": "Leitura", "duration": "01:30:00", "deadline": "2025-01-14", "priority": 2, "category": "Lazer", "phase_of_day": "Noite"},
        {"title": "Revisão de código", "duration": "02:00:00", "deadline": "2025-01-15", "priority": 5, "category": "Desenvolvimento Pessoal", "phase_of_day": "Tarde"},
        {"title": "Entrega de projeto", "duration": "03:00:00", "deadline": "2025-01-08", "priority": 5, "category": "Trabalho", "phase_of_day": "Manhã"},
        {"title": "Estudar para prova", "duration": "02:00:00", "deadline": "2025-01-09", "priority": 4, "category": "Estudos", "phase_of_day": "Manhã"},
        {"title": "Apresentação", "duration": "01:30:00", "deadline": "2025-01-09", "priority": 5, "category": "Trabalho", "phase_of_day": "Tarde"},
        {"title": "Relaxamento", "duration": "01:00:00", "deadline": "2025-01-10", "priority": 1, "category": "Lazer", "phase_of_day": "Noite"},
        {"title": "Feedback do cliente", "duration": "01:30:00", "deadline": "2025-01-08", "priority": 4, "category": "Trabalho", "phase_of_day": "Tarde"},
        {"title": "Exercício 2", "duration": "01:30:00", "deadline": "2025-01-08", "priority": 4, "category": "Saúde", "phase_of_day": "Manhã"},
        {"title": "Reunião 2", "duration": "01:00:00", "deadline": "2025-01-09", "priority": 5, "category": "Trabalho", "phase_of_day": "Tarde"},
        {"title": "Estudar 2", "duration": "02:00:00", "deadline": "2025-01-10", "priority": 3, "category": "Estudos", "phase_of_day": "Manhã"},
        {"title": "Planejamento financeiro 2", "duration": "01:00:00", "deadline": "2025-01-13", "priority": 3, "category": "Financeiro", "phase_of_day": "Tarde"},
        {"title": "Leitura 2", "duration": "01:30:00", "deadline": "2025-01-14", "priority": 2, "category": "Lazer", "phase_of_day": "Noite"},
        {"title": "Revisão de código 2", "duration": "02:00:00", "deadline": "2025-01-15", "priority": 5, "category": "Desenvolvimento Pessoal", "phase_of_day": "Tarde"},
        {"title": "Aulas de inglês", "duration": "01:30:00", "deadline": "2025-01-15", "priority": 2, "category": "Estudos", "phase_of_day": "Tarde"},
        {"title": "Leitura técnica", "duration": "01:00:00", "deadline": "2025-01-14", "priority": 2, "category": "Estudos", "phase_of_day": "Noite"},
        {"title": "Planejamento semanal", "duration": "02:00:00", "deadline": "2025-01-12", "priority": 3, "category": "Trabalho", "phase_of_day": "Manhã"},
        {"title": "Pesquisa de mercado", "duration": "02:30:00", "deadline": "2025-01-11", "priority": 3, "category": "Trabalho", "phase_of_day": "Manhã"},
        {"title": "Exercício Matinal", "duration": "01:00:00", "deadline": "2025-01-09", "priority": 5, "category": "Saúde", "phase_of_day": "Manhã"},
        {"title": "Reunião de Equipa", "duration": "01:30:00", "deadline": "2025-01-10", "priority": 4, "category": "Trabalho", "phase_of_day": "Manhã"},
        {"title": "Planejamento Estratégico", "duration": "02:00:00", "deadline": "2025-01-11", "priority": 5, "category": "Trabalho", "phase_of_day": "Tarde"},
        {"title": "Meditação", "duration": "00:45:00", "deadline": "2025-01-10", "priority": 3, "category": "Saúde", "phase_of_day": "Manhã"},
        {"title": "Estudar para Exame", "duration": "03:00:00", "deadline": "2025-01-13", "priority": 4, "category": "Estudos", "phase_of_day": "Tarde"},
        {"title": "Jantar com Amigos", "duration": "02:00:00", "deadline": "2025-01-14", "priority": 2, "category": "Social", "phase_of_day": "Noite"},
        {"title": "Comprar Mantimentos", "duration": "01:30:00", "deadline": "2025-01-15", "priority": 3, "category": "Casa", "phase_of_day": "Tarde"},
        {"title": "Aula de Yoga", "duration": "01:00:00", "deadline": "2025-01-17", "priority": 4, "category": "Saúde", "phase_of_day": "Manhã"},
        {"title": "Preparação de Apresentação", "duration": "02:30:00", "deadline": "2025-01-18", "priority": 5, "category": "Trabalho", "phase_of_day": "Tarde"},
        {"title": "Ler um Livro", "duration": "01:30:00", "deadline": "2025-01-19", "priority": 1, "category": "Lazer", "phase_of_day": "Noite"},
        {"title": "Treino de Força", "duration": "01:30:00", "deadline": "2025-01-09", "priority": 4, "category": "Saúde", "phase_of_day": "Manhã"},
        {"title": "Planejamento Financeiro", "duration": "01:00:00", "deadline": "2025-01-16", "priority": 3, "category": "Financeiro", "phase_of_day": "Tarde"},
        {"title": "Revisão de Código", "duration": "02:00:00", "deadline": "2025-01-12", "priority": 5, "category": "Desenvolvimento Pessoal", "phase_of_day": "Tarde"},
        {"title": "Organização da Casa", "duration": "02:00:00", "deadline": "2025-01-15", "priority": 3, "category": "Casa", "phase_of_day": "Tarde"},
        {"title": "Corrida Noturna", "duration": "01:00:00", "deadline": "2025-01-16", "priority": 2, "category": "Saúde", "phase_of_day": "Noite"},
        {"title": "Escrever Artigo", "duration": "03:00:00", "deadline": "2025-01-20", "priority": 5, "category": "Trabalho", "phase_of_day": "Tarde"},
        {"title": "Assistir Filme", "duration": "02:00:00", "deadline": "2025-01-18", "priority": 2, "category": "Lazer", "phase_of_day": "Noite"},
        {"title": "Pesquisas Online", "duration": "01:30:00", "deadline": "2025-01-17", "priority": 2, "category": "Lazer", "phase_of_day": "Tarde"}
    ]
}


# Enviar o pedido POST para a API
response = requests.post(url, json=payload)

# Mostrar o resultado
print("Resposta da API:", response.json())
