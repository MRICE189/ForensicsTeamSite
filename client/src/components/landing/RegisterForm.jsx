import React from "react";
import { useState } from "react";
import axios from 'axios';
import InlineErrors from "./InlineErrors";
import {useNavigate} from 'react-router-dom';

const RegisterForm = () => {
    const [user, setUser] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser(user => ({
            ...user,
            [e.target.name]: e.target.value
        }))
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        axios({
            url: "http://localhost:5000/api/users/create",
            method: "post",
            data: user,
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
                <h2>New User</h2>
            </div>
            <div class="card-body">
                <form onSubmit={onSubmitHandler}>
                    <div className="p-3">
                    <div className="mb-3">
                        <div className="d-flex gap-3">
                            <span className="input-group-text col-4">First Name</span>
                            <input type="text" name="FirstName" className="form-control" 
                                onChange={handleChange} value={user.FirstName} />
                        </div>
                        <InlineErrors field="FirstName" errors={errors} />
                    </div>
                    <div className="mb-3">
                        <div className="d-flex gap-3">
                            <span className="input-group-text col-4">Last Name</span>
                            <input type="text" name="LastName" className="form-control" 
                                onChange={handleChange} value={user.LastName} />
                        </div>
                        <InlineErrors field="LastName" errors={errors} />
                    </div>
                    <div className="mb-3">
                        <div className="d-flex gap-3">
                            <span className="input-group-text col-4">Email</span>
                            <input type="text" name="Email" className="form-control" 
                                onChange={handleChange} value={user.Email} />
                        </div>
                        <InlineErrors field="Email" errors={errors} />
                    </div>
                    <div className="mb-3">
                        <div className="d-flex gap-3">
                            <span className="input-group-text col-4">Password</span>
                            <input type="password" name="Password" className="form-control" 
                                onChange={handleChange} value={user.Password} />
                        </div>
                        <InlineErrors field="Password" errors={errors} />
                    </div>
                    <div className="mb-3">
                        <div className="d-flex gap-3">
                            <span className="input-group-text col-4">Confirm Password</span>
                            <input type="password" name="ConfirmPw" className="form-control" 
                                onChange={handleChange} value={user.ConfirmPw} />
                        </div>
                        <InlineErrors field="ConfirmPw" errors={errors} />
                    </div>
                    <div className="text-end">
                        <input type="submit" value="Register" className="btn btn-danger" />
                    </div>
                    </div>

                </form>
            </div>
        </div>
    </div>
};

export default RegisterForm;
