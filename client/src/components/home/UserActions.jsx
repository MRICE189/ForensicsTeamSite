import axios from "axios";
import React from "react";
import { useEffect } from "react";

const UserActions = (props) => {
    const add = (e) => {
        e.preventDefault();
        //call db to add association
        axios.post(`http://localhost:5000/api/associations/${props.prompt.PromptId}/${sessionStorage.getItem("uuid")}/create`)
        .then(res => {
            console.log(res);
            props.changeAssoc();
        })
        .catch(err => {
            console.log(err)
        });
    }
    const remove = (e) => {
        e.preventDefault();
        //call db to remove association
        axios.post(`http://localhost:5000/api/associations/${props.prompt.PromptId}/${sessionStorage.getItem("uuid")}/destroy`)
        .then(res => {
            console.log(res)
            props.changeAssoc();
        })
        .catch(err => {
            console.log(err)
        });
    }

    return <div>
        {
            ((props.prompt.CategoryId == 1 && props.prompt?.PromptAssociations.length < 2 && props.prompt?.PromptAssociations[0]?.User.UserId != sessionStorage.getItem("uuid")) ||
            (props.prompt.CategoryId != 1 && props.prompt?.PromptAssociations.length < 1)) &&
            <button onClick={add} className="btn btn-success w-100">Add</button>
        }
        {
            (props.prompt?.PromptAssociations[0]?.User.UserId == sessionStorage.getItem("uuid") || props.prompt?.PromptAssociations[1]?.User.UserId == sessionStorage.getItem("uuid")) &&
            <button onClick={remove} className="btn btn-danger w-100">Remove</button>
        }
    </div>;
};

export default UserActions;
