import CalendarRow from "../CalendarRow/CalendarRow";
import './calendar.scss';
import { useState } from 'react';

const Calendar = () => {
    const [weekEvents, setWeekEvents] = useState([[],[],[],[],[],[],[]]);

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const calendar = [];

    const date = new Date();
    var day = date.getDay();

    const updateHandler = (id, events) => {
        const newEvents = [...weekEvents];
        newEvents[id] = events;
        setWeekEvents(newEvents);
    }

    for (let i = 0; i < 7; i++) {
        calendar.push(<CalendarRow updateCalendar={updateHandler} key={day} id={day} day={weekday[day]}/>);
        if (day === 6) {
            day = 0
        } else {
            day++
        }
    };
    return (
        <div className="calendar">
            {calendar}
        </div>
    )
}

export default Calendar;