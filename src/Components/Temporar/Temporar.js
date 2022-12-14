import toTime from "../../services/timeConverter";
import bubble from '../../resourses/speech-bubble.png';
import './temporar.scss';

const Temporar = ({box}) => {
    return (
        <div 
            data-type='cell'
            className="temporar"
            style={{
                left: box.left,
                width: box.width
            }}
        >
            <p className="temporar__text">
                {`${toTime(box.timeStart)} - ${toTime(box.timeEnd)}`}
            </p>
            <img 
                src={bubble} 
                alt="bubble"
                className='temporar__img' /></div>
    )
};

export default Temporar;