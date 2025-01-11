import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/api";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

interface BackendCalendario {
    data: string;
    horaInicio: string;
    horaFim: string;
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

    const mergeDateAndTime = (dateStr: string, timeStr: string) => {
        if (!dateStr) return "";
        const dateOnly = dateStr.split("T")[0];
        return dateOnly + "T" + timeStr;
    };

    const fetchCalendar = async () => {
        if (isGenerating) return;
        setIsGenerating(true);

        try {
            console.log("[INFO] Gerando calendário...");
            await axiosInstance.post("/calendario/generate");

            console.log("[INFO] Carregando calendário...");
            const response = await axiosInstance.get("/calendario/user");
            const data: BackendCalendario[] = response.data;

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

            // Atualiza os eventos, garantindo que não haja duplicatas
            setEvents(fullCalendarEvents);
        } catch (err: any) {
            console.error("[ERROR] Erro ao carregar o calendário:", err);
            setError("Erro ao carregar o calendário. Por favor, tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        fetchCalendar();
        // Executa apenas uma vez na montagem do componente
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ flex: 1, padding: "1rem" }}>
            <h1>Calendário Semanal</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <FullCalendar
                plugins={[timeGridPlugin]}
                initialView="timeGridWeek"
                slotDuration="00:30:00"
                slotMinTime="07:00:00"
                slotMaxTime="22:00:00"
                allDaySlot={false}
                nowIndicator={true}
                events={events}
                locale="pt-br"
                height="auto"
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
