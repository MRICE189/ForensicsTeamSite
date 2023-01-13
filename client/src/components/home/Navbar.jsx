import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';

const Navbar = () => {
    const [username, setUsername] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        const username = sessionStorage.getItem("username");
        setUsername(username);
    }, [])

    const logout = (e) => {
        sessionStorage.clear();
        navigate("/");
    }

    return <div className="d-flex justify-content-around align-items-center p-2">
        <div>
            <h2 className="ms-5 text-secondary">Welcome, {username}</h2>
        </div>

            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown">
                    Menu Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item className="text-center" href="/home">Home</Dropdown.Item>
                    <Dropdown.Item className="text-center" href="/account">Account</Dropdown.Item>
                    <Dropdown.Item className="text-center" onClick={logout}>Logout</Dropdown.Item>
                    {/* <button onClick={logout} className="btn btn-secondary">Logout</button> */}
                </Dropdown.Menu>
            </Dropdown>
            
    </div>;
};

export default Navbar;
