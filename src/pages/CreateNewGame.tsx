import { useState } from "react";
import Button from "../components/Button";
import { CategoryChecker } from "../components/CategoryChecker";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateNewGame() {
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const navigate = useNavigate();
    //generate game code
    function generateSixDigitCode() {
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    }




    const categoryList = ["Movies", "TV", "History", "Geography", "Politics", "YA novels", "Celebrities", "Rock", "Grunge", "Game of thrones", "Succession", "US presidents", "Music"]
    // console.log(JSON.stringify({ categoryList }));


    // handler for selecting categories for creating questions
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



    }

    const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {

        if (selectedItems.length == 0) {

            alert("You have not selected anything")
        } else {

            const params = { topics: { categoryList: selectedItems.toString() } }
            console.log(import.meta.env.VITE_BACKEND_SERVER)
            axios.post(import.meta.env.VITE_BACKEND_SERVER + "/fetchQuestions", params).then((response) => {
                const fetchedQuestions = response.data;
                console.log(fetchedQuestions)
                navigate("/triviaPage", { state: { fetchedQuestions: fetchedQuestions } });
            }).catch((error) => {
                alert(error);
            })

            //    navigate('/triviaPage')

        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '500px', justifyContent: 'center' }}>

                {categoryList.map((category, index) => {
                    return (<CategoryChecker checkBoxText={category} key={category} handler={handleSelection} />);
                })}


            </div>
            <Button buttonTitle="Create" eventHandler={handleButtonClick} />
        </div>

    );
}

export default CreateNewGame;