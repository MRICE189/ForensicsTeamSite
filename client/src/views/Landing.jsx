import React from "react";
import LoginForm from "../components/landing/LoginForm";
import Logo from "../components/landing/Logo";
import RegisterForm from "../components/landing/RegisterForm";

const Landing = () => {
    return <div>
        
        <div className="shadow mb-5">
            <Logo />
        </div>

        <div className="d-flex justify-content-evenly">
            <div className="col-4">
                <RegisterForm />
            </div>
            <div className="col-4">
                <LoginForm />
            </div>
        </div>

    </div>;
};

export default Landing;
