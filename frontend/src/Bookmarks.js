import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from './axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';

const MyBookmarks = (props) => {

    const [bookmarks, setBookmarks] = useState([]);
    const [showReplies, setShowReplies] = useState({});

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

    const toggleReplies = (postId) => {
        setShowReplies(prevState => ({
            ...prevState,
            [postId]: !prevState[postId], // Toggle the show/hide state
        }));
    };

    return (
        <div className="App">
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
                                        {bookmarks.some(b => b.post_id === bookmark.post_id) ? <FontAwesomeIcon icon={faStarFilled}/> : <FontAwesomeIcon icon={faStarEmpty}/>}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'><p><strong>Posted by:</strong> {bookmark.name}</p></div>
                            <div className='col' align="right"><small>{bookmark.date}</small></div>
                        </div>
                        <hr/>
                        <div className='row mb-3'>
                            <div className='col'>
                                <h6>Replies:</h6>
                                {/* {bookmark.replies.map(bookmark => (
                                    <div key={bookmark.reply_id} className='reply row'>
                                        <div className='col-md-9'><strong>{bookmark.reply_name}</strong>  {bookmark.reply_content}</div>
                                        <div className='col-md-3' align='right'><small>{bookmark.reply_date}</small></div>
                                    </div>
                                ))} */}
                                {bookmark.replies.length > 0 &&
                                    <button className='btn btn-link btn-sm' onClick={() => toggleReplies(bookmark.post_id)}>
                                        {showReplies[bookmark.post_id] ? 'Hide Replies' : 'View Replies'}
                                    </button>
                                }
                                {showReplies[bookmark.post_id] && bookmark.replies.map(bookmark => (
                                    <div key={bookmark.reply_id} className='reply row'>
                                    <div className='col-md-9'><strong>{bookmark.reply_name}:</strong>  {bookmark.reply_content}</div>
                                    <div className='col-md-3' align='right'><small>{bookmark.reply_date}</small></div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div></div>
            <Link to="/community-page">
                <button
                    className='btn btn-secondary mb-3 ms-3 fixed-bottom'
                >Back</button>
            </Link>
        </div>
        </div>
    )
}

export default MyBookmarks