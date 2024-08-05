import { useState, useEffect } from "react";
import Button from "../components/Button";
import { CategoryChecker } from "../components/CategoryChecker";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TailSpin } from 'react-loader-spinner';

function CreateNewGame() {
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();



    const categoryList = [
        "Movies", "TV", "History", "Geography", "Politics", "YA novels",
        "Celebrities", "Rock", "Grunge", "Game of thrones", "Succession",
        "US presidents", "Music"
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

    const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (selectedItems.length === 0) {
            alert("You have not selected anything");
        } else {
            const params = { topics: { categoryList: selectedItems.toString() } };
            console.log(import.meta.env.VITE_BACKEND_SERVER);
            setLoading(true);
            axios.post(import.meta.env.VITE_BACKEND_SERVER + "/fetchQuestions", params)
                .then((response) => {
                    const fetchedQuestions = response.data;
                    console.log(fetchedQuestions);
                    navigate("/triviaPage", { state: { fetchedQuestions: fetchedQuestions } });
                })
                .catch((error) => {
                    alert(error);
                })
                .finally(() => {
                    setLoading(false);
                });
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
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', height: '150vh' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', width: '500px', justifyContent: 'center' }}>
                        {categoryList.map((category, index) => (
                            <CategoryChecker checkBoxText={category} key={category} handler={handleSelection} />
                        ))}
                    </div>
                    <Button buttonTitle="Create" eventHandler={handleButtonClick} />


                </div>
            )}
        </>
    );
}

export default CreateNewGame;
