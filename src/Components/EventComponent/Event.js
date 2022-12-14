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
    const [showInfo, setShowInfo] = useState(false);

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
            const targetWidth = startWidth + e.clientX - startPosition;
            targetWidth > 48 ? changeWidth(id, targetWidth) : changeWidth(id, 48);
        }
    }

    const body = <div>
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
                </div>

    const dots = width < 120 ? 
        <div className="dots" onClick={() => setShowInfo(true)}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    : null;

    const hideElement = <div 
        className="event__hidden"
        style={{
            backgroundColor: color,
            left: left
        }}>
            <div 
                className="event__hidden-cross"
                onClick={() => setShowInfo(false)}/>
            {body}
        </div>

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
        {width > 120 ? body : null}
        {dots}
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
            {showInfo ? hideElement : null}
        </>
    )
};

export default Event;