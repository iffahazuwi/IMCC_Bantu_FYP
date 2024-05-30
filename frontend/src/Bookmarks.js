import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from './axios';

const MyBookmarks = (props) => {

    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-bookmarks', { withCredentials: true });
                const sortedBookmarks = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setBookmarks(sortedBookmarks);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            }
        };
    
        fetchBookmarks();
    }, []);    

    const bookmarkPost = async (postId) => {
        try {
            const response = await axios.post('http://localhost:5000/bookmark-post', { post_id: postId }, { withCredentials: true });
            const updatedBookmarks = await axios.get('http://localhost:5000/get-bookmarks', { withCredentials: true });
            setBookmarks(updatedBookmarks.data);
            alert(response.data.message);
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };    

    return (
        <div className="feedback-form-container">
            <h1 className="mb-2" align="left" >My Bookmark List</h1>
            <div className='posts pt-1'>
                {bookmarks.map((bookmark) => (
                    <div key={bookmark.post_id} className='post mb-3 pt-3 ps-3 pe-3 border border-dark rounded'>
                        <div className='row'>
                            <div className='col-md-11'>
                                <h2>{bookmark.title}</h2>
                                <p>{bookmark.description}</p>
                            </div>
                            <div className='col-md-1 d-flex flex-column align-items-end'>
                                <div className="mb-1" align="right">
                                    <button className="btn btn-warning btn-sm" onClick={() => bookmarkPost(bookmark.post_id)}>
                                        {bookmarks.some(b => b.post_id === bookmark.post_id) ? 'Unsave' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'><p><strong>Posted by:</strong> {bookmark.name}</p></div>
                            <div className='col' align="right"><small>{bookmark.date}</small></div>
                        </div>
                    </div>
                ))}
            </div>
            <div></div>
            <Link to="/community-page">
                <button
                    className='btn btn-primary mb-3 ms-3 fixed-bottom'
                >Back</button>
            </Link>
        </div>
    )
}

export default MyBookmarks