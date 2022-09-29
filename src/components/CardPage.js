import React from "react";

export default function CardPage(props) {
    const [shouldRender, setShouldRender] = React.useState(false)
    const timeoutID = React.useRef()

    React.useEffect(() => {
        if (timeoutID !== undefined || timeoutID !== null) {
            clearTimeout(timeoutID.current)
        }
        if (props.isShown) {
            setShouldRender(true)
        }
        else {
            timeoutID.current = setTimeout(() => setShouldRender(false), 300)
        }
    }, [props.isShown])

    // if (!shouldRender) {
    //     return <div className="nothing-here"></div>
    // }

    return (
    <div className={`CardPage ${props.className} ${props.isShown? 'shown': 'hidden'}`}>
        <button className={`close-button ${props.isMobile && 'mobile'}`} onClick={props.onClose}>
            X
        </button>
        <div className="content-container">
            {shouldRender && props.children}
        </div>
    </div>
    )
}