import React from "react";
import { Country, State, City } from "country-state-city";
import Select from "react-select";

export default function Settings(props) {
    const {settings, setSettings} = props
    const {location} = settings
    
    // React.useEffect(() => {
    //     setLocation(old => ({
    //         ...old,
    //         State: {label: '', value: ''},
    //         City: {label: '', value: ''}
    //     }))
    // }, [location.Country])
    // React.useEffect(() => {
    //     setLocation(old => ({
    //         ...old,
    //         City: {label: '', value: ''},
    //     }))
    // }, [location.State])

    const countryOptions = Country.getAllCountries().map((country) => ({
        label: country.name,
        value: country.id,
        ...country
    }));
    const stateOptions = State.getStatesOfCountry(location.Country.value).map(s => ({
        label: s.name,
        value: s.id,
        ...s
    }))
    const cityOptions = City.getCitiesOfState(location.Country.value, location.State.value).map(c => ({
        label: c.name,
        value: c.id,
        ...c
    }))

    const handleLocationChange = (property, label, value) => {
        const newItem = {label: label, value: value}
        const blankItem = {label: '', value: ''}
        setSettings(oldSettings => {
            const old = oldSettings.location
            let newLocation;
            if (property === "Country" && old.Country.value !== value) {
                newLocation = {
                    Country: {...newItem},
                    State: {...blankItem},
                    City: {...blankItem}
                }
            }
            else if (property === "State" && old.State.value !== value) {
                newLocation = {
                    ...old,
                    State: {...newItem},
                    City: {...blankItem}
                }
            }
            else {
                newLocation = {
                    ...old,
                    City: {...newItem}
                }
            }
            return {
                ...oldSettings,
                location: newLocation
            }
        })
    }

    const CscSelect = (props) => {
        const {label, options} = props
        return (
        <div>
            <label>{label || "Label"}</label>
            <Select
                id={props.label}
                name={props.label}
                label={props.label}
                options={props.options}
                value={location[label]}
                onChange={(event) => handleLocationChange(label, event.label, event[props.eventValueProp] || event)}
                className='country-container'
                classNamePrefix='country'
                ignoreAccents={false}
                components={{
                    IndicatorSeparator: () => null
                }}
                theme={theme => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: 'green',
                        primary75: 'transparentize(green, .25)',
                        primary50: 'transparentize(green, .5)',
                        primary25: 'transparentize(green, .75)',
                    },
                })}
            />
        </div>
        )
    }

    const onRadioChanged = (event) => {
        setSettings(old => ({
            ...old,
            [event.target.name]: event.target.value
        }))
    }

    return (
    <div className="Settings">

        <div className="location-selector">

            <CscSelect
                label='Country'
                options={countryOptions}
                eventValueProp='isoCode'
            />

            <CscSelect
                label='State'
                options={stateOptions}
                eventValueProp='isoCode'
            />

            <CscSelect
                label='City'
                options={cityOptions}
                eventValueProp='isoCode'
            />

        </div>

        <div className="time-format">
            <label className="radio-label">
                <input
                    type='radio'
                    name='timeFormat'
                    value={0}
                    checked={settings.timeFormat == 0}
                    onChange={onRadioChanged}
                />
                12-hour format
            </label>

            <label className="radio-label">
                <input
                    type='radio'
                    name='timeFormat'
                    value={1}
                    checked={settings.timeFormat == 1}
                    onChange={onRadioChanged}
                />
                24-hour format
            </label>
        </div>

        <div className="school">
            School: 
            <label className="radio-label"> 
                <input 
                    type='radio'
                    name="school"
                    value={0} 
                    checked={settings.school === '0'}
                    onChange={onRadioChanged}
                /> 
                Shafi 
            </label>
            
            <label className="radio-label"> 
                <input 
                    type='radio'
                    name="school"
                    value={1} 
                    checked={settings.school === '1'}
                    onChange={onRadioChanged}
                /> 
                Hanafi 
            </label>
        </div>

        <div className="prayer-checklist">
            {Object.keys(settings.shownTimes).map(key => (
                <label>
                    <input
                        type={'checkbox'}
                        checked={settings.shownTimes[key]}
                        onChange={(event) => 
                            setSettings(old => ({
                                ...old,
                            shownTimes: {
                                ...old.shownTimes,
                                [key]: event.target.checked
                            }
                        }))}
                    />
                    {key}
                </label>
            ))}
        </div>
    </div>
    )
}