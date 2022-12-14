import './modal.scss';
import { useState } from 'react';

const Modal = ({show, closeModal, saveModal, left}) => {

    const [status, setStatus] = useState({
        title: '',
        description: '',
        availability: 'available'
    });

    const changeHandler = (e) => {
        setStatus({
            ...status,
            [e.target.name]:e.target.value
        })
    };

    const clickHandler = (e) => {
        setStatus({...status, availability: e.target.value})
    };

    return(
        <>
        <div 
            className='cover'
            onClick={closeModal} />
        <div 
            className='modal' 
            style={{
                visibility: show === true ? 'visible' : 'hidden',
                left: left - 310}}>
                <input 
                    placeholder='Enter the title' 
                    type="text" 
                    name='title'
                    defaultValue={status.title}
                    onChange={changeHandler}/>
                <textarea 
                    placeholder='Enter the description' 
                    type="text" 
                    name='description'
                    value={status.description}
                    onChange={changeHandler}/>
                <div className='modal_switch'>
                    <button
                        className={`available ${status.availability === 'available' ? 'active' : null}`}
                        value="available"
                        onClick={clickHandler}>
                            Available
                    </button>
                    <button
                        className={`maybe ${status.availability === 'maybe' ? 'active' : null}`}
                        value="maybe"
                        onClick={clickHandler}>
                            Maybe
                    </button>
                    <button
                        className='save'
                        onClick={() => {
                            saveModal(status);
                            setStatus({
                                title: '',
                                description: '',
                                availability: 'available'
                            })
                        }}>
                            Save
                    </button>
                </div>
            </div>
            </>
    )
}

export default Modal;