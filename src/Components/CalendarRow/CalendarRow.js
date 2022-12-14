import './calendarRow.scss';

import Cell from '../Cell/Cell';
import Modal from '../Modal/Modal';
import Event from '../EventComponent/Event';
import Temporar from '../Temporar/Temporar';

import { useState, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';

const CalendarRow = ({id, day, updateCalendar}) => {

    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [box, setBox] = useState(null);
    const [piece, setPiece] = useState();
    
    const row = useRef();
    useEffect( () => {
        if (row.current) {
            setPiece(row.current.offsetWidth / 96);
        }
    }, []);

    useEffect( () => {
        updateCalendar(id, events);
        //eslint-disable-next-line
    }, [events]);

    let hours = [];
    for (let i = 0; i < 24; i+=2) {
        hours.push(i);
    };

    const clickHandler = (e) => {
        if (e.button !== 0) return;
        const offset = Math.floor((e.clientX - e.currentTarget.getBoundingClientRect().left) / piece);
        if (/clickable/.test(e.target.className)) {
            setBox({
                id: uuid(),
                changable: true,
                left: offset * piece,
                timeStart: offset,
                width: piece,
                timeEnd: offset + 1
            })   
        }
    };

    const moveHandler = (e) => {
        const offset = Math.floor((e.clientX - e.currentTarget.getBoundingClientRect().left) / piece);
        if (box && box.changable && (/clickable/.test(e.target.className) || e.target.getAttribute('data-type') === 'cell')) {
            const width = ((offset + 1) * piece) - box.left;
            const timeEnd = box.timeStart + (((offset * piece) - box.left) / piece) + 1;
            setBox({
                ...box,
                width: width < piece ? piece : width,
                timeEnd: timeEnd < box.timeStart  ? box.timeStart + 1 : timeEnd
            })
        }
    };

    const saveHandler = () => {
        let width
        box && box.width > 47.5 ? width = box.width : width = 47.5;
        if(box && box.width > 0) {
            setShowModal(true);
            setBox({
                ...box, 
                changable: false,
                width: width,
                timeEnd: box.timeStart + width / piece
            })
        } else {
            setBox(null);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        setBox(null);
    };

    const saveEvent = ({title, description, availability}) => {
        setShowModal(false);
        setEvents([
            ...events,
            {...box,
                title,
                description,
                availability
            }
        ]);
        setBox(null);
    };

    const moveEvent = (id, leftOffset) => {
        const reloc = events.find( event => event.id === id);
        const pieceOffset = Math.floor(leftOffset / piece) * piece;
        const left = reloc.left + pieceOffset;
        let targetLeft;
        if (left < 0) {
            targetLeft = 0;
        } else if ( left + reloc.width > row.current.offsetWidth) {
            targetLeft = row.current.offsetWidth - reloc.width;
        } else {
            targetLeft = left;
        };
        const newEvent = {
            ...reloc,
            left: targetLeft,
            timeStart: targetLeft / piece,
            timeEnd: targetLeft / piece + reloc.width / piece
        }
        setEvents(events.map( event => {
            if (event.id === id) {
                return newEvent
            } else {
                return event;
            }
        }))
    };

    const changeWidth = (id, width) => {
        const reloc = events.find( event => event.id === id);
        const pieceWidth = Math.floor(width / piece) * piece;
        let targetWidth;
        if (pieceWidth + reloc.left > row.current.offsetWidth) {
            targetWidth = row.current.offsetWidth - reloc.width;
            return;
        } else {
            targetWidth = pieceWidth;
        }

        const newEvent = {
            ...reloc,
            width: targetWidth,
            timeEnd: reloc.timeStart + targetWidth / piece
        }
        setEvents(events.map( event => {
            if (event.id === id) {
                return newEvent
            } else {
                return event;
            }
        }))
    }


    const deleteEvent = (id) => {
        const newEvents = events.filter( event => event.id !== id);
        setEvents(newEvents); 
    };

    const modal = showModal ? 
        <Modal 
            left={box.left < row.current.offsetWidth / 2 ? box.left + box.width + 10 : box.left - 310} 
            show={showModal}
            closeModal={closeModal}
            saveModal={saveEvent}
        /> 
    : null;

    const elements = events.map( (item) => 
        <Event 
            key={item.id}
            data={item}
            deleteEvent={deleteEvent}
            moveEvent={moveEvent}
            changeWidth={changeWidth}
        />
    );

    return(
        <>
            <div 
            ref={row}
            className="row"
            onMouseDown={clickHandler}
            onMouseMove={moveHandler}
            onMouseUp={saveHandler}
            >
                {modal}
                <h2 className='row__day'>{day}</h2>
                {hours.map(item => (
                    <Cell key={item} hour={item} />
                ))}
                {elements}
                {box && <Temporar box={box} />}
            </div>
        </>
    )
};

export default CalendarRow;