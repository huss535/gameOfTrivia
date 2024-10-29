import { useState, useEffect } from "react";
import Button from "../components/Button";
import { CategoryChecker } from "../components/CategoryChecker";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TailSpin } from 'react-loader-spinner';
import { uniqueNamesGenerator, starWars, adjectives, colors, animals, NumberDictionary } from 'unique-names-generator';

function CreateNewGame() {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const categoryList = [
        "Movies", "TV", "Sports", "Geography", "History", "Politics",
        "Celebrities", "Music", "Literature", "Pop culture", "Food", "Science", "General Knowledge"
    ];

    const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedItems([...selectedItems, value]);
        } else {
            setSelectedItems((prevSelectedItems) =>
                prevSelectedItems.filter((item) => item !== value)
            );
        }
    };

    //handles game creation
    const handleButtonClick = (buttonTitle: string, event: React.MouseEvent<HTMLButtonElement>) => {
        if (selectedItems.length === 0) {
            console.log(buttonTitle)
            alert("You have not selected anything");
        } else if (buttonTitle == "Play Solo") {

            const params = { topics: { categoryList: selectedItems.toString() } };
            // console.log(import.meta.env.VITE_BACKEND_SERVER);
            setLoading(true);
            axios.post(import.meta.env.VITE_BACKEND_SERVER + "/fetchQuestions", params)
                .then((response) => {
                    const fetchedQuestions = response.data;
                    console.log(fetchedQuestions);
                    navigate("/triviaPage", { state: { fetchedQuestions: fetchedQuestions, sessionKey: null } });
                })
                .catch((error) => {
                    alert(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        else {
            /*  const lowerCaseName: string = uniqueNamesGenerator({
                 dictionaries: [adjectives, animals],
                 style: 'lowerCase',
                 separator: "-"
             }); */
            navigate("/hostingGame", { state: selectedItems })


        }
    };



    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <TailSpin height="80" width="80" color="#00BFFF" ariaLabel="loading" />
                    <h2>Fetching your questions</h2>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '100vh' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '500px', justifyContent: 'center' }}>
                        {categoryList.map((category, index) => (
                            <CategoryChecker checkBoxText={category} key={category} handler={handleSelection} />
                        ))}
                    </div>



                    <div>
                        {/* <Button buttonTitle="Host Game" eventHandler={handleButtonClick} /> */}
                        <Button buttonTitle="Start" eventHandler={handleButtonClick} />

                    </div>
                </div>
            )}
        </>
    );
}

export default CreateNewGame;
