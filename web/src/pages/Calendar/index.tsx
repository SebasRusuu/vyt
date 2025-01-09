import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/api";
import Sidebar from "../../components/sidebar";
import { addDays, format, startOfWeek } from "date-fns";

interface Calendario {
    id?: number; // ID da tarefa, pode ser undefined para slots vazios
    tarefaTitulo?: string; // Título da tarefa
    data: string; // Data no formato YYYY-MM-DD
    horaInicio?: string; // Hora de início (opcional)
    horaFim?: string; // Hora de fim (opcional)
}

const Calendar: React.FC = () => {
    const [schedule, setSchedule] = useState<Calendario[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Função para gerar a semana atual (segunda a domingo)
    const generateEmptyWeek = (): Calendario[] => {
        const today = new Date();
        const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Segunda-feira
        const emptyWeek: Calendario[] = [];

        for (let i = 0; i < 7; i++) {
            const day = addDays(startOfCurrentWeek, i);
            emptyWeek.push({
                data: format(day, "yyyy-MM-dd"), // Formato YYYY-MM-DD
            });
        }

        return emptyWeek;
    };

    useEffect(() => {
        const fetchAndGenerateSchedule = async () => {
            try {
                // Gerar uma semana vazia como base
                const week = generateEmptyWeek();
                setSchedule(week); // Exibir a semana, mesmo que vazia

                console.log("[INFO] Tentando gerar o calendário automaticamente...");

                // Passo 1: Gerar o calendário (apenas se houver novas tarefas)
                await axiosInstance.post("/calendario/generate");
                console.log("[INFO] Calendário gerado com sucesso.");

                // Passo 2: Buscar o calendário gerado do backend
                console.log("[INFO] Buscando calendário do backend...");
                const response = await axiosInstance.get("/calendario/user");
                const fetchedSchedule = response.data;

                console.log("[INFO] Resposta do backend:", fetchedSchedule);

                // Mesclar o calendário existente com a semana atual
                const mergedSchedule = week.map((day) => {
                    const task = fetchedSchedule.find(
                        (t: Calendario) => t.data === day.data
                    );
                    return task || day; // Se houver tarefa no dia, usa-a; caso contrário, mantém vazio
                });

                setSchedule(mergedSchedule);
            } catch (err: any) {
                console.error("[ERROR] Erro ao gerar ou buscar o calendário:", err);
                setError("Erro ao carregar o calendário. Verifique sua conexão.");
            }
        };

        fetchAndGenerateSchedule();
    }, []); // Executa apenas uma vez ao carregar a página.

    return (
        <div className="calendar-container">
            <Sidebar />
            <h1>Calendário</h1>
            {error && <p className="error">{error}</p>}
            <div className="schedule">
                {schedule.map((item, index) => (
                    <div key={index} className="schedule-item">
                        <h3>{item.data}</h3>
                        {item.tarefaTitulo ? (
                            <>
                                <p>Tarefa: {item.tarefaTitulo}</p>
                                <p>Hora: {item.horaInicio} - {item.horaFim}</p>
                            </>
                        ) : (
                            <p>Sem tarefas agendadas.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Calendar;
