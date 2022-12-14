import toTime from "../../services/timeConverter";
import trashbin from '../../resourses/trash.svg';
import './event.scss';
import { useState } from "react";

const Event = ({data, deleteEvent, moveEvent, changeWidth}) => {
    const {id, left, width, title, availability, timeStart, timeEnd, description} = data;

    const color = availability === 'available' ? '#5adb5a' : '#dbd05a';
    const [showDescr, setShowDesr] = useState(false);
    const [startPosition, setStartPosition] = useState(null);
    const [startWidth, setStartWidth] = useState(null);

    const dragHandler = (e, stage) => {
        if (e.target.className === 'event') {
            if (stage === 'start') {
                setStartPosition(e.clientX)
            }
            if (stage === 'end') {
                const offset = e.clientX - startPosition;
                moveEvent(id, offset);
                setStartPosition(null);
            }
        }
    };

    const changeWidthHandler = (e) => {
        if (e.target.className === 'sideResizable') {
            const width = startWidth + e.clientX - startPosition;
            if (width > 47) {
                changeWidth(id, width);
            } else {
                return
            }
        }
    }

    const defaultElement = <div 
        draggable
        onDragStart={(e) => dragHandler(e, 'start')}
        onDragEnd={(e) => dragHandler(e, 'end')}
        className="event"
        data-id={id} 
        style={{
            left: left,
            width: width,
            backgroundColor: color
        }}>
        <img 
            src={trashbin} 
            alt="trashbin" 
            className="event__delete"
            onClick={() => deleteEvent(id)}/>
        <h5 className="event__title">{title ? title : 'no title'}</h5>
        <p className="event__time">{`${toTime(timeStart)} - ${toTime(timeEnd)}`}</p>
        {description ? 
            <p 
                className="event__descr"
                onMouseEnter={() => setShowDesr(true)}
                >
                Description...
            </p> 
        : null}
        {showDescr ? 
            <div 
                className="event__descr-text"
                onMouseLeave={() => setShowDesr(false)}>
                {description}
            </div>
        :null}
        <div className="sideResizable"
            onDragStart={(e) => {
                e.dataTransfer.setDragImage(new Image(), 0, 0)
                setStartWidth(width);
                setStartPosition(e.clientX);
            }}
            onDrag={changeWidthHandler}
            onDragEnd={(e) => {
                changeWidth(id, startWidth + e.clientX - startPosition)
                setStartPosition(null);
                setStartWidth(null);
            }}
            draggable/>
    </div>

    return (
        <>
            {defaultElement}
        </>
    )
};

export default Event;