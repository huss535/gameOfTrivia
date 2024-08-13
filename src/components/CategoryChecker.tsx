
interface checkBoxProps {
    checkBoxText: string;
    handler: React.ChangeEventHandler<HTMLInputElement>; // Use React.ChangeEventHandler for onChange events
}

export const CategoryChecker = (props: checkBoxProps) => {


    return (

        <div className="checkbox-container">
            <div className="checkBox">
                <label >

                    <input type="checkbox" value={props.checkBoxText} onChange={props.handler} />
                    <span >{props.checkBoxText}</span>

                </label>
            </div>
        </div>
    );

}