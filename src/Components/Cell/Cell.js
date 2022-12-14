import './cell.scss';

const Cell = ({hour}) => {
    return(
        <div className='cell clickable'>
            <span className='time clickable'>{hour}:00</span>
            <div className="vertical_divider clickable"></div>
        </div>
    )
};

export default Cell;
