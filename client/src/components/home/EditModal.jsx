import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InlineErrors from "../landing/InlineErrors";
import DropdownCategories from "./DropdownCategories";

const EditModal = (props) => {
    const [errors, setErrors] = useState({});
    const [prompt, setPrompt] = useState({});
    const [article, setArticle] = useState({
        Link: "",
        ArticleDescription: ""
    });
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        setPrompt(props.prompt);
        setArticles(props.prompt.PromptArticles);
        console.log('firing')
    }, [props.showEdit])

    const handleCloseEdit = () => {
        setArticle({
            Link: "",
            ArticleDescription: ""
        });
        setArticles([]);
        setPrompt({
            Title: "",
            PromptDescription: "",
            CategoryId: 1,
            CreatorName: sessionStorage.getItem("username")
        });
        props.reloadMain();
        props.handleCloseEdit();
    };

    const handlePromptChangeEdit = (e) => {
        setPrompt(prompt => ({
            ...prompt,
            [e.target.name]: e.target.value
        }));
    };

    const handlePromptCatEdit = (n, v) => {
        setPrompt(prompt => ({
            ...prompt,
            [n]: v
        }));
    };

    const handleArticleChangeEdit = (e) => {
        setArticle(article => ({
            ...article,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddArticleEdit = (e) => {
        e.preventDefault();
        //add article to articles list
        if (article.Link) {
            setArticles(articles => ([
                ...articles, article
            ]));
            setArticle({
                Link: "",
                ArticleDescription: ""
            });
        }
    };

    const handlePromptSubmitEdit = async (e) => {
        e.preventDefault();
        //axios call to add prompt to db and then add all articles with prompt id
        try {
            const promptToEdit = await axios({
                url: `http://localhost:5000/api/prompts/${prompt.PromptId}/edit`,
                method: "post",
                data: {
                    PromptId: prompt.PromptId,
                    Title: prompt.Title,
                    PromptDescription: prompt.PromptDescription,
                    CategoryId: prompt.CategoryId,
                    CreatorName: prompt.CreatorName
                },
                contentType: "application/json"
            })
            const addArticles = await axios({
                url: `http://localhost:5000/api/articles/${prompt.PromptId}/edit`,
                method: "post",
                data: articles,
                contentType: "application/json"
            })
            handleCloseEdit();
        } catch (err) {
            setErrors(err.response.data);
        }
    }

    const removeAllArticles = (e) => {
        e.preventDefault();
        setArticles([]);
        //axios call to remove all articles associated with the current prompt
        axios({
            url: `http://localhost:5000/api/articles/${prompt.PromptId}/destroy`,
            method: "post",
        })
        .then(res => {
            console.log(res)
            props.reloadMain();
        })
        .catch(err => {
            console.log(err)
        });
        props.reloadMain();
    }

    return (
        <div>
            <Modal 
                show={props.showEdit} 
                onHide={handleCloseEdit}
                backdrop="static"    
                keyboard={false}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 className="p-1 ms-5">Edit Prompt</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-around">
                        <div className="col-5 shadow">
                            <h3 className="text-center text-secondary mt-3">Prompt Info</h3>
                            <form>
                                <div className="p-3">
                                    <label 
                                        className="text-secondary">
                                        Category:
                                    </label>
                                    <DropdownCategories 
                                        categories={props.categories} 
                                        onCatChange={handlePromptCatEdit}
                                        prompt={prompt}
                                    />
                                    <div className="mb-3 mt-3">
                                        <label 
                                            htmlFor="Title" 
                                            className="text-secondary">
                                                Title:
                                        </label>
                                        <input 
                                            type="text" 
                                            name="Title"
                                            className="form-control"
                                            onChange={handlePromptChangeEdit}
                                            value={prompt.Title}
                                            />
                                        <InlineErrors field="Title" errors={errors} />
                                    </div>
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="Title" 
                                            className="text-secondary">
                                                Description:
                                        </label>
                                        <textarea 
                                            type="text" 
                                            name="PromptDescription"
                                            className="form-control"
                                            rows="3"
                                            onChange={handlePromptChangeEdit}
                                            value={prompt.PromptDescription}
                                            />
                                        <InlineErrors field="PromptDescription" errors={errors} />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="col-5 shadow">
                        <h3 className="text-center text-secondary mt-3">Prompt Articles</h3>
                            <form onSubmit={handleAddArticleEdit}>
                                <div className="p-3">
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="Link" 
                                            className="text-secondary">
                                                Link:
                                        </label>
                                        <input 
                                            type="text" 
                                            name="Link"
                                            className="form-control"
                                            onChange={handleArticleChangeEdit}
                                            value={article.Link}
                                            />
                                    </div>
                                    <div className="mb-3">
                                        <label 
                                            htmlFor="ArticleDescription" 
                                            className="text-secondary">
                                                Article Description (optional):
                                        </label>
                                        <textarea 
                                            type="text" 
                                            name="ArticleDescription"
                                            className="form-control"
                                            rows="2"
                                            onChange={handleArticleChangeEdit}
                                            value={article.ArticleDescription}
                                            />
                                    </div>
                                    <div className="d-flex justify-content-end gap-3">
                                        <button 
                                            onClick={removeAllArticles}
                                            className="btn btn-dark"
                                        >Remove All</button>

                                        <input 
                                            type="submit" 
                                            value="Add Article"
                                            className="btn btn-danger"
                                        />
                                    </div>
                                </div>
                            </form>
                            {articles?.map((art, idx) => {
                                return (art.ArticleDescription)
                                ? (
                                    <div key={idx} className="p-1 m-3 border">
                                        <span>{art.ArticleDescription}</span>
                                        <br />
                                        <span>{art.Link}</span>
                                    </div>
                                )
                                : (
                                    <div key={idx} className="p-1 m-3 border">
                                        <span>{art.Link}</span>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEdit} className="mx-3">
                        Close Window
                    </Button>
                    <Button variant="danger" onClick={handlePromptSubmitEdit} className="me-5">
                        Edit Prompt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EditModal;
