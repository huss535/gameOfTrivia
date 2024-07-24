interface radioButtonProps {
    radioText: string;
    handler: React.ChangeEventHandler<HTMLInputElement>;
    isCorrect: boolean// Use React.ChangeEventHandler for onChange events
}


function RadioButton(props: radioButtonProps) {
    return (<div className="radioText" >
        <label className={props.isCorrect ? 'correctAnswer' : ''} >
            <input type="radio" name="answers" value={props.radioText} onChange={props.handler} />
            <span>{props.radioText}</span>
        </label>
    </div>);


}

export default RadioButton;