import './App.css';
import { useState, useEffect } from 'react';
import ArticleList from './components/ArticleList';
import Form from './components/Form';

export default function CommunityPage(){

    const [articles, setArticles] = useState([])
    const [editedArticle, setEditedArticle] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:5000/community-page/get', {
            'method': 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(resp => resp.json())
            .then(resp => setArticles(resp))
            .catch(error => console.log(error))
    }, [])

    const editArticle = (article) => {
        setEditedArticle(article)
    }

    const updatedData = (article) => {
        const new_article = articles.map(my_article => {
            if (my_article.id == article.id) {
                return article
            } else {
                return my_article
            }
        })
        setArticles(new_article)
    }

    const openForm = () => {
        setEditedArticle({ title: '', body: '' })
    }

    const insertedArticle = (article) => {
        const new_articles = [...articles, article]
        setArticles(new_articles)
    }

    const deleteArticle = (article) => {
        const new_articles = articles.filter(myarticle => {
            if (myarticle.id === article.id) {
                return false;
            }
            return true
        })
        setArticles(new_articles)
    }

    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>Community Page</h1>
            </div>
            <div className='row'>
                <div className='col' align='right'>
                    <button
                        className='btn btn-success'
                        onClick={openForm}
                    >Create Post</button>
                </div>
            </div>


            <ArticleList articles={articles} editArticle={editArticle} deleteArticle={deleteArticle} />

            {editedArticle ? <Form article={editedArticle} updatedData={updatedData} insertedArticle={insertedArticle} /> : null}
        </div>
    );
}