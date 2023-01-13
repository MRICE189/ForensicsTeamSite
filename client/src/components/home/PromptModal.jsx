import axios from "axios";
import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InlineErrors from "../landing/InlineErrors";
import DropdownCategories from "./DropdownCategories";

const PromptModal = (props) => {
    const [errors, setErrors] = useState({});
    const [prompt, setPrompt] = useState({
        Title: "",
        PromptDescription: "",
        CategoryId: 1,
        CreatorName: sessionStorage.getItem("username")
    });
    const [article, setArticle] = useState({
        Link: "",
        ArticleDescription: ""
    });
    const [articles, setArticles] = useState([]);

    const handleClose = () => {
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
        props.handleClose();
    };

    const handlePromptChange = (e) => {
        setPrompt(prompt => ({
            ...prompt,
            [e.target.name]: e.target.value
        }));
    };

    const handlePromptCat = (n, v) => {
        setPrompt(prompt => ({
            ...prompt,
            [n]: v
        }));
    };

    const handleArticleChange = (e) => {
        setArticle(article => ({
            ...article,
            [e.target.name]: e.target.value
        }));
    };

    const handleAddArticle = (e) => {
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

    const handlePromptSubmit = async (e) => {
        e.preventDefault();
        //axios call to add prompt to db and then add all articles with prompt id
        try {
            const promptId = await axios({
                url: "http://localhost:5000/api/prompts/create",
                method: "post",
                data: prompt,
                contentType: "application/json"
            })
            const addArticles = await axios({
                url: `http://localhost:5000/api/articles/${promptId.data}/create`,
                method: "post",
                data: articles,
                contentType: "application/json"
            })
            handleClose();
        } catch (err) {
            setErrors(err.response.data);
        }
    }

    const removeArticles = (e) => {
        e.preventDefault();
        setArticles([]);
        props.reloadMain();
    }

    return (
        <div>
            <Modal 
                show={props.show} 
                onHide={handleClose}
                backdrop="static"    
                keyboard={false}
                size="xl"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2 className="p-1 ms-5">Add a New Prompt</h2>
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
                                        onCatChange={handlePromptCat}
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
                                            onChange={handlePromptChange}
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
                                            onChange={handlePromptChange}
                                            value={prompt.PromptDescription}
                                            />
                                        <InlineErrors field="PromptDescription" errors={errors} />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="col-5 shadow">
                        <h3 className="text-center text-secondary mt-3">Prompt Articles</h3>
                            <form onSubmit={handleAddArticle}>
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
                                            onChange={handleArticleChange}
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
                                            onChange={handleArticleChange}
                                            value={article.ArticleDescription}
                                            />
                                    </div>
                                    <div className="d-flex justify-content-end gap-3">
                                        <button 
                                            onClick={removeArticles}
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
                    <Button variant="secondary" onClick={handleClose} className="mx-3">
                        Close Window
                    </Button>
                    <Button variant="danger" onClick={handlePromptSubmit} className="me-5">
                        Add Prompt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PromptModal;
