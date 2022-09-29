import './App.scss';
import React from 'react';
import CardPage from './components/CardPage';
import TimeTable from './components/TimeTable';
import Settings from './components/Settings';
import Calendar from 'react-calendar';

function App() {
  const [inCalendar, setInCalendar] = React.useState(false)
  const [inSettings, setInSettings] = React.useState(false)
  const [date, setDate] = React.useState(new Date())
  const [settings, setSettings] = React.useState({
    location: {
      "Country": {label: "United States", value: "US"},
      "State": {label: "New York", value: "NY"},
      "City": {label: "New York City", value: "New York City"},
    },
    school: 0,
    shownTimes: {
        "Fajr": true,
        "Sunrise": true,
        "Dhuhr": true,
        "Asr": true,
        "Sunset": true,
        "Maghrib": true,
        "Isha": true,
        "Imsak": true,
        "Midnight": true, 
        "Firstthird": true,
        "Lastthird": true,       
    },
    timeFormat: 0,
  })

  const [width, setWidth] = React.useState(0)
  const onResize = () => setWidth(window.innerWidth)
  const isMobile = width <= 768
  
  React.useEffect(() => {
    try {
      const item = localStorage.getItem('settings')
      const parsed = JSON.parse(item)
      if (Object.keys(settings).every(prop => parsed.hasOwnProperty(prop))) {
        setSettings(parsed)
      }
    }
    catch {
      console.log('No previous settings found')
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // Don't want this running on first render, as it always resets options and saves it
  const firstRender = React.useRef(true)
  const settingsString = JSON.stringify(settings)
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
    }
    else {
      localStorage.setItem('settings', settingsString)
    }
  }, [settingsString])

  const today = new Date()

  return <div className='App'>
    <TimeTable
      date={date}
      // month={date.getMonth()}
      // year={date.getFullYear()}
      openCalendar={() => setInCalendar(true)}
      openSettings={() => setInSettings(true)}
      settings={settings}
    />

    <CardPage
      className={'calendar'}
      isShown={inCalendar}
      onClose={() => setInCalendar(false)}
      isMobile={isMobile}
      >
      <Calendar
        value={date}
        onChange={val => {
          setDate(val)
          setInCalendar(false)
        }}
        calendarType='US'
        tileClassName={(obj) => (obj.date.getDate() === today.getDate()? 'today': 'not-today')}
      />
    </CardPage>

    <CardPage
      isShown={inSettings}
      onClose={() => setInSettings(false)}
      isMobile={isMobile}
    >
      <Settings
        settings={settings}
        setSettings={setSettings}
      />
    </CardPage>

  </div>
}

export default App;
