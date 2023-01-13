import axios from "axios";
import React from "react";

const AdminActions = (props) => {
    const editPrompt = () => {
        props.editPrompt();
    }

    const removeAll = () => {
        //axios call to remove all associations
        axios.post(`http://localhost:5000/api/associations/${props.prompt.PromptId}/destroy`)
        .then(res => {
            console.log(res);
            props.reloadMain();
        })
        .catch(err => {
            console.log(err);
        });
    }

    const deletePrompt = (e) => {
        e.preventDefault();
        //axios call to remove if alert works
        if (window.confirm("Delete this prompt?")) {
            axios.post(`http://localhost:5000/api/prompts/${props.prompt.PromptId}/destroy`)
            .then(res => {
                console.log(res);
                props.reloadMain();
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    return <div>
        <button onClick={editPrompt} className="btn btn-warning w-100 mb-3">Edit</button>
        {(props.prompt?.PromptAssociations[0]) &&
            <button onClick={removeAll} className="btn btn-danger w-100 mb-3">Remove All</button>
        }
        <button onClick={deletePrompt} className='btn btn-dark w-100'>Delete</button>
    </div>;
};

export default AdminActions;
