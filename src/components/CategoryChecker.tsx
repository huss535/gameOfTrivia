
interface checkBoxProps {

    checkBoxText: string,
    key: number

}
export const CategoryChecker = (props: checkBoxProps) => {


    return (

        <div key={props.key} className="checkbox-container">
            <div className="checkBox">
                <label >

                    <input type="checkbox" />
                    <span>{props.checkBoxText}</span>

                </label>
            </div>
        </div>
    );

}