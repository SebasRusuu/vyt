import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/api";

// FullCalendar
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

interface BackendCalendario {
    data: string;        // ex: "2025-01-10T00:00:00"
    horaInicio: string;  // ex: "08:00:00"
    horaFim: string;     // ex: "09:30:00"
    tarefa: {
        tarefaTitulo: string;
        tarefaDescricao: string;
        tarefaCategoria: string;
    };
}

const FullCalendarPage: React.FC = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const fetchCalendar = async () => {
        if (isGenerating) return; // Evitar chamadas simultâneas

        setIsGenerating(true);
        try {
            console.log("[INFO] Gerando calendário...");
            await axiosInstance.post("/calendario/generate");

            console.log("[INFO] Carregando calendário...");
            const response = await axiosInstance.get("/calendario/user");
            const data: BackendCalendario[] = response.data;

            // Verificação dos dados recebidos
            console.log("[DEBUG] Dados recebidos do backend:", data);

            const fullCalendarEvents = data.map((item) => ({
                title: item.tarefa?.tarefaTitulo || "Sem título",
                start: mergeDateAndTime(item.data, item.horaInicio),
                end: mergeDateAndTime(item.data, item.horaFim),
                extendedProps: {
                    descricao: item.tarefa?.tarefaDescricao,
                    categoria: item.tarefa?.tarefaCategoria,
                },
            }));

            setEvents(fullCalendarEvents);
        } catch (err) {
            console.error("[ERROR] Erro ao carregar o calendário:", err);
            setError("Erro ao carregar o calendário. Por favor, tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };
    useEffect(() => {
        fetchCalendar();
    }, []); // Executa apenas uma vez ao montar o componente

    const mergeDateAndTime = (dateStr: string, timeStr: string) => {
        if (!dateStr) return "";
        const dateOnly = dateStr.split("T")[0]; // Ex: "2025-01-10"
        return dateOnly + "T" + timeStr;        // Ex: "2025-01-10T08:00:00"
    };

    return (
        <div style={{ flex: 1, padding: "1rem" }}>
            <h1>Calendário Semanal</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                slotDuration="00:30:00" // Intervalos de 30 minutos entre slots
                slotMinTime="07:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                nowIndicator={true}
                events={events}
                locale="pt-br"
                height="auto" // Ajusta a altura automaticamente
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay",
                }}
                eventContent={(arg) => {
                    const { title, extendedProps } = arg.event;
                    return (
                        <div>
                            <strong>{title}</strong>
                            {extendedProps.categoria && (
                                <div>Categoria: {extendedProps.categoria}</div>
                            )}
                            {extendedProps.descricao && (
                                <div>Descrição: {extendedProps.descricao}</div>
                            )}
                        </div>
                    );
                }}
            />
        </div>
    );
};

export default FullCalendarPage;
