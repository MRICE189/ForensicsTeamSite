import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/landing/Logo";
import Navbar from "../components/home/Navbar";
import UserPrompt from "../components/account/UserPrompt";

const Account = () => {
    const navigate = useNavigate();
    const [prompts, setPrompts] = useState([]);
    const [reload, setReload] = useState(false);
    const reloadAccount = () => {
        setReload(!reload)
    }

    useEffect(() => {
        //check for logged in user
        const userId = sessionStorage.getItem("uuid");
        if (!userId) {
            navigate("/");
        }
        //get all prompts assigned to the logged in user
        axios
            .get(`http://localhost:5000/api/prompts/${userId}`)
            .then((res) => {
                const data = JSON.parse(res.data);
                console.log(data.AllPrompts)
                setPrompts(data.AllPrompts);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [reload]);


    return <div>
        <div className="mb-5 shadow">
                <Logo />
                <Navbar />
        </div>

        <div className="d-flex justify-content-center">
            <div className="col-10">
                {(sessionStorage.getItem("isAdmin") === "true")
                ?(
                    <h1 className="text-center">Eventual Admin Actions Will Go Here</h1>
                )
                :(
                    <div>
                        <h1 className="text-center">My Prompts</h1>
                        {prompts?.map((prompt, idx) => {
                        return (
                                <div key={idx}>
                                    <UserPrompt 
                                        prompt={prompt}
                                        reloadAccount={reloadAccount}
                                    />
                                </div>
                            )
                    })}
                    </div>
                )}
            </div>
        </div>
    </div>;
};

export default Account;
