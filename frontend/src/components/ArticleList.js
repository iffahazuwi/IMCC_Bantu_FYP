

import React from 'react'
import APIService from '../components/APIService'

function ArticleList(props) {

    // const editArticle = (article) => {
    //     props.editArticle(article)
    // }

    // const deleteArticle = (article) => {
    //     APIService.DeleteArticle(article.id)
    //     .then(() => props.deleteArticle(article))
    // }

    <div key={index} className='post mb-3 p-3 border rounded'>

        {/* one way of displaying posts */}
        <div className='row'>
            <div className='col-md-9'>
                <h2>{post.title}</h2>
                <p>{post.description}</p>
                <small>{new Date(post.date).toLocaleString()}</small>
            </div>
            <div className='col-md-3 d-flex flex-column align-items-end'>
                <div className=" mb-1" align="right">
                    <button className="btn btn-warning"
                        // onClick={() => editArticle(article)}
                    >Fav</button>
                </div>
                <div className=" mb-1" align="right">
                    <button className="btn btn-danger"
                        // onClick={() => editArticle(article)}
                    >Del</button>
                </div>
            </div>
            <hr />
        </div>

        {/* this is another way of displaying posts */}
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <small>{new Date(post.date).toLocaleString()}</small>

        <div className="mt-1">
            <button className="btn btn-warning"
                // onClick={() => editArticle(article)}
            >Fav</button>
        </div>
        <div className="mt-1">
            <button className="btn btn-danger"
                // onClick={() => editArticle(article)}
            >Del</button>
        </div>

        <hr />
    
    </div>

    return (
        <div>
            {props.posts && props.posts.map(post => {
                return (
                    <div key={post.post_id}>
                        <h2>{post.post_title}</h2>
                        <p>{post.post_desc}</p>
                        <p>{post.post_date}</p>

                        <div className="col-md-1">
                            <button className="btn btn-success"
                                // onClick={() => editArticle(article)}
                            >Save</button>
                        </div>

                        <hr />
                    </div>
                )
            })}
        </div>
    )
}

export default ArticleList