import React from "react";
import settingsIcon from '../images/settings.svg';


export default function TimeTable(props) {
    const {date, openCalendar, settings} = props
    const [timesList, setTimesList] = React.useState([])
    const country = settings.location.Country.value
    const state = settings.location.State.value
    const city = settings.location.City.value
    const month = date.getMonth()
    const year = date.getFullYear()
    
    const objectMap = (obj, fn) =>
        Object.fromEntries(
            Object.entries(obj).map(
            ([k, v], i) => [k, fn(v, k, i)]
            )
        )

    React.useEffect(() => {
        if (country && state && city) {
            fetch('https://api.aladhan.com/v1/calendarByCity?' + new URLSearchParams({
                city: city,
                country: country,
                state: state,
                year: year,
                month: month + 1,
                school: settings.school,
            }))
            .then((response) => {
                return response.json()})
            .then((data) => {
                console.log(`month: ${month} year: ${year}`)
                return setTimesList(data.data.map(d => objectMap(d.timings, val => val.slice(0, -5).split(':'))))
            })
            .catch(error => {
                console.log("Error: ", error)
            });
        }
    }, [month, year, country, state, city, settings.school])

    const day = date.getDate() - 1
    const times = timesList[day]
    const dateString = date.toDateString()

    const cd = new Date()
    const [currentHour, currentMinute] = [cd.getHours(), cd.getMinutes()]
    let currentPrayer = "Isha"
    let selectedTimes = {}
    if (timesList.length > day) {
        selectedTimes = Object.fromEntries(Object.entries(timesList[day]).filter(([key, val]) => props.settings.shownTimes[key]))
        for (let key in selectedTimes) {
            const [hour, minute] = selectedTimes[key].map(s => Number(s))
            if (hour >= currentHour && minute >= currentMinute) {
                break;
            } 
            currentPrayer = key;
        }
    }

    const timeFormatter = ([hourText, minuteText]) => {
        if (settings.timeFormat == 1) {
            return hourText + ':' + minuteText
        }
        else {
            let hmod = Number(hourText) % 12
            hmod = hmod === 0 ? 12: hmod
            const amOrPm = Math.floor(Number(hourText)/12) === 0 ? 'am' : 'pm'
            const extraZero = hmod < 10 ? '\u00A0\u00A0' : ''
            return `${extraZero}${hmod}:${minuteText}${amOrPm}`
        }
    }

    return (
    <div 
        className="TimeTable"
        style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
        }}
    >

        <div>
            <button 
                className="calendar-button"
                onClick={openCalendar}
            >
                {dateString}
            </button>

            <button
                className="settings-button"
                onClick={props.openSettings}
            >
                <img src={settingsIcon} alt="settings"/>
            </button>
        </div>

        {timesList.length !== 0 && 
        <div
            className="day"
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                alignContent: 'space-around',
                // width: '60%',
                columnGap: '40px',
                alignSelf: 'center'
            }}
        >
            {Object.keys(selectedTimes).reduce((accum, key) => {
                // if (props.settings.shownTimes[key] === false) {return accum}
                return accum.concat([
                    <div className={currentPrayer === key? "bold": 'false'}>{key}</div>, 
                    <div className={`${currentPrayer === key? "bold": 'false'} time`}>
                        {timeFormatter(times[key])}
                    </div>
                ])
            }, [])}
        </div>}
                
    </div>)
}