import React from "react";
import { useState } from "react";
import AdminActions from "./AdminActions";
import EditModal from "./EditModal";
import UserActions from "./UserActions";

const ShowPrompt = (props) => {
    const [showEdit, setShowEdit] = useState(false);

    const reloadMain = () => {
        props.reloadMain();
    }

    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    return <div className="border border-dark p-1 mb-2 d-flex justify-content-between">
        <div className="col-5 p-2 border">
            <p><strong>{props.prompt.Title}</strong> by {props.prompt.CreatorName}</p>
            <p>{props.prompt.PromptDescription}</p>
        </div>
        <div className="col-4 p-2 border">
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
        <div className="col-2 p-2 border">
            <p><strong>Who's doing it?</strong></p>
            {props.prompt?.PromptAssociations.map((user) => {
                return (
                    <div key={user.UserId} className="ms-2">
                        <p>{user.User.FirstName} {user.User.LastName[0]}</p>
                    </div>
                    )
            })}
        </div>
        <div className="col-1 p-2 border text-center">
            <p className="text-start"><strong>Actions</strong></p>
            {(sessionStorage.getItem("isAdmin") === "true")
            ?(<AdminActions 
                prompt={props.prompt} 
                editPrompt={handleShowEdit}
                reloadMain={reloadMain}
            />)
            :(<UserActions 
                prompt={props.prompt} 
                changeAssoc={reloadMain}
            />)
            }
        </div>

        <EditModal
                showEdit={showEdit} 
                handleShowEdit={handleShowEdit}
                handleCloseEdit={handleCloseEdit} 
                categories={props.categories}
                prompt={props.prompt}
                reloadMain={reloadMain}
            />
    </div>;
};

export default ShowPrompt;
