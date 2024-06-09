import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from './axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { Button, ButtonGroup } from 'react-bootstrap';

const MyBookmarks = (props) => {
    const [bookmarks, setBookmarks] = useState([]);
    const [showReplies, setShowReplies] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

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
            [postId]: !prevState[postId],
        }));
    };

    // Calculate the indices of the first and last mentors on the current page
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = bookmarks.slice(indexOfFirstPost, indexOfLastPost);

    // Calculate the total number of pages
    const totalPages = Math.ceil(bookmarks.length / postsPerPage);

    return (
        <div className="App">
            <div className="text-center mb-5">
                <h1>My Bookmark List</h1>
            </div>
            <ButtonGroup className="mb-3">
                <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                    Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index + 1}
                        variant={currentPage === index + 1 ? 'primary' : 'outline-primary'}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
                    Next
                </Button>
            </ButtonGroup>
            <div className="row">
                {currentPosts.map((bookmark) => (
                    <div key={bookmark.post_id} className="col-md-6 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h5 className="card-title">{bookmark.title}</h5>
                                    <button className="btn btn-warning btn-sm" onClick={() => bookmarkPost(bookmark.post_id)}>
                                        {bookmarks.some(b => b.post_id === bookmark.post_id) ? <FontAwesomeIcon icon={faStarFilled} /> : <FontAwesomeIcon icon={faStarEmpty} />}
                                    </button>
                                </div>
                                <p className="card-text">{bookmark.description}</p>
                                <div className="d-flex justify-content-between">
                                    <p className="card-text"><small className="text-muted">Posted by: {bookmark.name}</small></p>
                                    <p className="card-text"><small className="text-muted">{bookmark.date}</small></p>
                                </div>
                                <hr />
                                <div>
                                    <h6>Replies:</h6>
                                    {bookmark.replies.length > 0 && (
                                        <button className="btn btn-link btn-sm" onClick={() => toggleReplies(bookmark.post_id)}>
                                            {showReplies[bookmark.post_id] ? 'Hide Replies' : 'View Replies'}
                                        </button>
                                    )}
                                    {showReplies[bookmark.post_id] && bookmark.replies.map(reply => (
                                        <div key={reply.reply_id} className="card mb-2">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between">
                                                    <div><strong>{reply.reply_name}:</strong> {reply.reply_content}</div>
                                                    <small>{reply.reply_date}</small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Link to="/community-page">
                <button className="btn btn-secondary mb-3 ms-3 fixed-bottom">Back</button>
            </Link>
        </div>
    );
}

export default MyBookmarks;