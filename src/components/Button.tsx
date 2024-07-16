interface ButtonProps {
    buttonTitle: string,
    eventHandler: React.MouseEventHandler<HTMLButtonElement>,
}


// Button component for web app
function Button(props: ButtonProps) {


    return (<button className="button" onClick={props.eventHandler}>{props.buttonTitle}</button>);




}


export default Button;