import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from './axios';

const CreatePost = (props) => {

    const navigate = useNavigate();

    const [post_title, setPostTitle] = useState('')
    const [post_desc, setPostDesc] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/insert-post",
                { post_title, post_desc });
            alert("Post created successfully!")

            navigate("/community-page");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                alert('Detais you entered are invalid! Please try again.');
            }
        }
    }

    return (
        <div className="feedback-form-container">
            <h1 className="mb-2" align="left" >Create New Post</h1>
            <label htmlFor="post_title" className="form-label mt-2">Title</label>
                <input type="text"
                    value={post_title}
                    className="form-control"
                    placeholder="Please enter title..."
                    onChange={(e) => setPostTitle(e.target.value)}
                />

            <label htmlFor="post_desc" className="form-label mt-2">Description</label>
                <textarea
                    rows="5"
                    value={post_desc}
                    className="form-control"
                    placeholder="Please enter description..."
                    onChange={(e) => setPostDesc(e.target.value)}
                />
            <div className="row">
                <div className='col' align="left">
                    {/* <button className="btn btn-primary mt-3" onClick={(e) => handleSubmit(e)} >Cancel</button> */}
                    <Link to="/community-page">
                        <button
                            className='btn btn-primary mt-3'
                            //onClick={openFeedbackForm}
                        >Cancel</button>
                    </Link>
                </div>
                <div className='col' align="right">
                    <button className="btn btn-success mt-3" onClick={(e) => handleSubmit(e)} >Create</button>
                </div>
            </div>
        </div>
    )
}

export default CreatePost