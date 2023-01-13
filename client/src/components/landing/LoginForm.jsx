import React, { useState } from "react";
import axios from "axios";
import InlineErrors from "./InlineErrors";
import {useNavigate} from 'react-router-dom';


const LoginForm = () => {
    const [loginUser, setLoginUser] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginUser(loginUser => ({
            ...loginUser,
            [e.target.name]: e.target.value
        }))
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        axios({
            url: "http://localhost:5000/api/users/login",
            method: "post",
            data: loginUser,
            contentType: "application/json"
        })
        .then(res => {
            const userId = sessionStorage.setItem("uuid", res.data.userId);
            const username = sessionStorage.setItem("username", res.data.firstName);
            const isAdmin = sessionStorage.setItem("isAdmin", res.data.isAdmin);
        })
        .then(res => {
            navigate("/home");
        })
        .catch(err => {
            setErrors(err.response.data)
        });
    };

    return <div>
        <div class="card shadow">
            <div class="card-header">
                <h2>Returning User</h2>
            </div>
            <div class="card-body">
                <form onSubmit={onSubmitHandler}>
                    <div className="p-3">
                    
                    <div className="mb-3">
                        <div className="d-flex gap-3">
                            <span className="input-group-text col-4">Email</span>
                            <input type="text" name="LoginEmail" className="form-control" 
                                onChange={handleChange} value={loginUser.LoginEmail} />
                        </div>
                        <InlineErrors field="LoginEmail" errors={errors} />
                    </div>
                    <div className="mb-3">
                        <div className="d-flex gap-3">
                            <span className="input-group-text col-4">Password</span>
                            <input type="password" name="LoginPassword" className="form-control" 
                                onChange={handleChange} value={loginUser.LoginPassword} />
                        </div>
                        <InlineErrors field="LoginPassword" errors={errors} />
                    </div>
                    
                    <div className="text-end">
                        <input type="submit" value="Login" className="btn btn-danger" />
                    </div>
                    </div>

                </form>
            </div>
        </div>
    </div>
};

export default LoginForm;
