import React from "react";
import Logo from "../components/landing/Logo";
import Navbar from "../components/home/Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import DropdownCategories from "../components/home/DropdownCategories";
import PromptModal from "../components/home/PromptModal";
import ShowPrompt from "../components/home/ShowPrompt";

const Main = () => {
    const [chosenCat, setChosenCat] = useState(1);
    const [categories, setCategories] = useState([]);
    const [prompts, setPrompts] = useState([]);
    const [show, setShow] = useState(false);
    const [reload, setReload] = useState(false);
    const [available, setAvailable] = useState(false);
    const navigate = useNavigate();

    const handleClose = () => {
        setShow(false);
        reloadMain();
    }
    const handleShow = () => setShow(true);

    const onCatChange = (n, v) => {
        setChosenCat(v);
    };

    const reloadMain = () => {
        setReload(!reload);
    }

    const toggleAvailable = (e) => {
        if (e.target.checked) {
            setAvailable(true);
        } else {
            setAvailable(false);
        }
        reloadMain();
    }

    const filter = (data) => {
        let filtered;
        if (available) {
            filtered = data.AllPrompts.filter(p => p.CategoryId == chosenCat).filter(p => (!p?.PromptAssociations[0] && p.CategoryId != 1) || (p.CategoryId == 1 && !p?.PromptAssociations[1]))
        } else {
            filtered = data.AllPrompts.filter(p => p.CategoryId == chosenCat);
        }
        return filtered;
    }


    useEffect(() => {
        //check for logged in user
        const userId = sessionStorage.getItem("uuid");
        if (!userId) {
            navigate("/");
        }
        //get all categories and prompts to pass to child components
        axios
            .get("http://localhost:5000/api/prompts")
            .then((res) => {
                const data = JSON.parse(res.data);
                setCategories(data.AllCategories);
                let filtered = filter(data);
                setPrompts(filtered);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [chosenCat, reload]);

    return (
        <div>
            <div className="mb-5 shadow">
                <Logo />
                <Navbar />
            </div>

            <div className="d-flex justify-content-center">
                <div className="col-10">
                    {(sessionStorage.getItem("isAdmin") === "true") && (
                        <button className="btn btn-danger" onClick={handleShow}>
                        Add a New Prompt
                        </button>
                    )}

                    <div className="d-flex justify-content-center mb-3 align-items-center">
                        <div className="w-25">
                            <DropdownCategories
                                categories={categories}
                                onCatChange={onCatChange}
                                chosenCat={chosenCat}
                            />
                        </div>
                        <form>
                            <div className="form-check ms-3">
                                <input onClick={toggleAvailable} type="checkbox" className="form-check-input" id="filterCheck" value={available}/>
                                <label className="form-check-label" htmlFor="filterCheck">Show only Available?</label>
                            </div>
                        </form>
                    </div>
                    <div className="text-center">
                        {categories
                            ?.filter((c) => c.CategoryId == chosenCat)
                            .map((c, idx) => {
                                return <h1 className="my-3" key={idx}>{c.CategoryName} Prompts</h1>;
                            })}
                    </div>

                    {prompts?.map((prompt, idx) => {
                        return (
                                <div key={idx}>
                                    <ShowPrompt 
                                        categories={categories}
                                        prompt={prompt}
                                        reloadMain={reloadMain}
                                    />
                                </div>
                            )
                    })}
                </div>
            </div>

            <PromptModal 
                show={show} 
                handleClose={handleClose} 
                categories={categories}
            />

        </div>
    );
};

export default Main;
