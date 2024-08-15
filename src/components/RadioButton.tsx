interface radioButtonProps {
    radioText: string;
    handler: (value?: string, isCorrect?: boolean) => void;
    isCorrect: boolean; // Use React.ChangeEventHandler for onChange events
    isChecked: boolean;
    disabled: boolean
}


function RadioButton(props: radioButtonProps) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.handler(event.target.value, props.isCorrect);
    };
    return (<div className="radioText" >
        <label className={props.isCorrect ? 'correctAnswer' : ''} >
            <input disabled={props.disabled} checked={props.isChecked} type="radio" name="answers" value={props.radioText} onChange={handleChange} />
            <span>{props.radioText}</span>
        </label>
    </div>);


}

export default RadioButton;