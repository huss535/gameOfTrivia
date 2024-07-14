import Button from "../components/Button";
import { CategoryChecker } from "../components/CategoryChecker";

function CreateNewGame() {
    const categoryList = ["Movies", "TV", "History", "Geography", "Politics", "YA novels", "Celebrities", "Game of thrones", "Succession"]
    console.log(categoryList)
    return (
        <div>

            <CategoryChecker checkBoxText={categoryList[0]} key={1} />
            <CategoryChecker checkBoxText={categoryList[1]} key={2} />

            <Button buttonTitle="Next" eventHandler={() => { }} />
        </div>

    );
}

export default CreateNewGame;