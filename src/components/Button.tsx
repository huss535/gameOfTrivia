interface ButtonProps {
    buttonTitle: string,
    eventHandler: (title: string, event: React.MouseEvent<HTMLButtonElement>) => void
}


// Button component for web app
function Button(props: ButtonProps) {
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        props.eventHandler(props.buttonTitle, event);
    };


    return (<button className="button" onClick={handleClick}>{props.buttonTitle}</button>);




}


export default Button;