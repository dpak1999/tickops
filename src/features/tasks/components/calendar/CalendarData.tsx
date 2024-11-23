import { Task } from "../../types";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import {
  addMonths,
  format,
  getDay,
  parse,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";
import EventCard from "./EventCard";
import CustomToolbar from "./CustomToolbar";

const locales = {
  en: enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarDataProps {
  data: Task[];
}

export const CalendarData = ({ data }: CalendarDataProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.name,
    project: task.project,
    assignee: task.assignee,
    status: task.status,
    id: task.$id,
  }));

  const handleNavigator = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else {
      setValue(new Date());
    }
  };

  return (
    <Calendar
      localizer={localizer}
      events={events}
      views={["month"]}
      date={value}
      defaultView="month"
      toolbar
      showAllEvents
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      className="h-full"
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
            id={event.id}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigator} />
        ),
      }}
    />
  );
};
