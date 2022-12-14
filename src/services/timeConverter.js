const toTime = (value) => {
    const current = Math.floor(value)
    const minutes = current * 15;
    const hours = Math.floor(minutes/ 60);
    const leftMinutes = minutes - hours * 60;
    return `${hours}:${leftMinutes === 0 ? "00" : leftMinutes}`
};

export default toTime;