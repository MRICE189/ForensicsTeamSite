import React from "react";
import axios from "axios";

const UserPrompt = (props) => {
    const remove = (e) => {
        e.preventDefault();
        //call db to remove association
        axios.post(`http://localhost:5000/api/associations/${props.prompt.PromptId}/${sessionStorage.getItem("uuid")}/destroy`)
        .then(res => {
            console.log(res)
            props.reloadAccount();
        })
        .catch(err => {
            console.log(err)
        });
    }

    return  <div className="border border-dark p-1 mb-2 d-flex justify-content-between">
        <div className="col-6 p-2 border">
            <p><strong>{props.prompt.Title}</strong> by {props.prompt.CreatorName}</p>
            <p>{props.prompt.PromptDescription}</p>
        </div>
        <div className="col-5 p-2 border">
            <p><strong>Articles</strong></p>
            {props.prompt?.PromptArticles.map((art, i) => {
                return (art.ArticleDescription)
                ?(
                    <div key={i} className="mb-2">
                        <span>
                            {art.ArticleDescription}
                            <br/>
                            <a href={art.Link} target="_blank">{art.Link}</a>
                            <br/>
                        </span>
                    </div>
                )
                :(
                    <div key={i} className="mb-2">
                        <span>
                            <a href={art.Link} target="_blank">{art.Link}</a>
                            <br/>
                        </span>
                    </div>
                )
            })}
        </div>
        <div className="col-1 p-2 border">
            <button onClick={remove} className="btn btn-danger w-100">Unassign</button>
        </div>
    </div>
};

export default UserPrompt;
