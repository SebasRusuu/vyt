# utils.py
def encode_phase_of_day(phase):
    phases = {"Manhã": 1, "Tarde": 2, "Noite": 3}
    return phases.get(phase, 0)

def encode_category(category):
    categories = {
        "Trabalho": 1, "Lazer": 2, "Saúde": 3, "Estudos": 4, "Casa": 5,
        "Social": 6, "Financeiro": 7, "Desenvolvimento Pessoal": 8,
        "Viagens": 9, "Recados": 10
    }
    return categories.get(category, 0)

def convert_time_to_hours(duration_str):
    """Converte 'hh:mm:ss' ou 'hh:mm' para horas decimais."""
    if isinstance(duration_str, float):
        return duration_str
    time_parts = list(map(int, duration_str.split(":")))
    if len(time_parts) == 2:
        return time_parts[0] + time_parts[1] / 60
    elif len(time_parts) == 3:
        return time_parts[0] + time_parts[1] / 60 + time_parts[2] / 3600
    raise ValueError(f"Formato inválido de tempo: {duration_str}")

def round_to_nearest_interval(decimal_time, interval=30):
    minutes = int(decimal_time * 60)
    # Arredonda para o intervalo mais próximo
    rounded_minutes = (minutes // interval) * interval
    if minutes % interval >= interval / 2:
        rounded_minutes += interval
    return rounded_minutes / 60

def format_time(decimal_time):
    """Converte tempo decimal (e.g., 10.5) para o formato HH:MM."""
    hours = int(decimal_time)
    minutes = int(round((decimal_time - hours) * 60))
    return f"{hours:02}:{minutes:02}"
