import { useState } from "react";
import Button from "../components/Button";
import { CategoryChecker } from "../components/CategoryChecker";

function CreateNewGame() {
    const categoryList = ["Movies", "TV", "History", "Geography", "Politics", "YA novels", "Celebrities", "Game of thrones", "Succession"]
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedItems([...selectedItems, value]);

        }
        else {
            setSelectedItems((prevSelectedItems) =>
                prevSelectedItems.filter((item) => item !== value)
            );
        }

        console.log(selectedItems);

    }
    // console.log(categoryList)
    return (
        <>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '500px', justifyContent: 'center' }}>

                {categoryList.map((category, index) => {
                    return (<CategoryChecker checkBoxText={category} key={category} handler={handleSelection} />);
                })}


            </div>
            <Button buttonTitle="Next" eventHandler={() => { }} />
        </>

    );
}

export default CreateNewGame;