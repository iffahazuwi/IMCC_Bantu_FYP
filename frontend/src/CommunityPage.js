import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Table, Button, ButtonGroup } from 'react-bootstrap';
import './App.css';
import axios from './axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import EditPostModal from './EditPost';

export default function CommunityPage() {
    const [posts, setPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [userType, setUserType] = useState('');
    const [userId, setUserId] = useState(null);
    const [isMentor, setIsMentor] = useState(false);
    const [replyContents, setReplyContents] = useState({});
    const [showReplies, setShowReplies] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 8;

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:5000/getUserRole', { withCredentials: true });
                setUserType(response.data.type);
                setIsMentor(response.data.is_mentor);
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:5000/@me', { withCredentials: true });
                setUserId(response.data.id);
                console.log("User Id", userId)
            } catch (error) {
                console.error('Error fetching user id:', error);
            }
        }; 

        const fetchBookmarks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/get-bookmarks', { withCredentials: true });
                setBookmarkedPosts(response.data);
            } catch (error) {
                console.error('Error fetching bookmarks:', error);
            }
        };

        fetchUserRole();
        fetchPosts();
        fetchBookmarks();
        fetchUserId();
    }, []);

    // Calculate the indices of the first and last mentors on the current page
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Calculate the total number of pages
    const totalPages = Math.ceil(posts.length / postsPerPage);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/get-posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleEditPost = (post) => {
        setSelectedPost(post);
        setShowEditModal(true);
    };

    const handleSaveChanges = async (updatedPost) => {
        // Validate title and description
        if (!updatedPost.title || !updatedPost.description) {
            alert("Title and description cannot be empty.");
            return;
        }
        try {
            console.log('Updating post:', updatedPost); // Check if the function is being called and the updatedPost is correct

            const response = await axios.put(`http://localhost:5000/update-post/${updatedPost.post_id}`, updatedPost, {withCredentials: true});
            setShowEditModal(false);
            alert('Post successfully updated!');
            fetchPosts();
            // window.location.reload();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleReplyChange = (event, postId) => {
        const { value } = event.target;
        setReplyContents(prevState => ({
            ...prevState,
            [postId]: value,
        }));
    };

    const submitReply = async (postId) => {
        if (!replyContents[postId] || replyContents[postId].trim() === '') {
            alert('Reply content cannot be empty!');
            return;
        }
        try {
            const response = await axios.post('http://localhost:5000/add-reply', {
                post_id: postId,
                reply_content: replyContents[postId],
            }, { withCredentials: true });

            const postsResponse = await axios.get('http://127.0.0.1:5000/get-posts');
            setPosts(postsResponse.data);
            setReplyContents(prevState => ({
                ...prevState,
                [postId]: '',
            }));
            alert(response.data.message);
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const toggleReplies = (postId) => {
        setShowReplies(prevState => ({
            ...prevState,
            [postId]: !prevState[postId],
        }));
    };

    if (userType === 'student' && !isMentor) {
        return (
            <div className="App">
                <div className='container text-center mt-5'>
                    <h1>Community Page</h1>
                    <div className='alert alert-warning mt-4'>
                        Sorry, you have no access to this content. Only mentors can have full access to this page.
                    </div>
                </div>
            </div>
        );
    }

    const deletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/delete-post/${postId}`);
            setPosts(posts.filter(post => post.post_id !== postId));
            alert('Post deleted');
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const bookmarkPost = async (postId) => {
        try {
            const response = await axios.post('http://localhost:5000/bookmark-post', { post_id: postId }, { withCredentials: true });
            const updatedBookmarks = await axios.get('http://localhost:5000/get-bookmarks', { withCredentials: true });
            setBookmarkedPosts(updatedBookmarks.data);
            alert(response.data.message);
        } catch (error) {
            console.error('Error bookmarking post:', error);
        }
    };

    const deleteReply = async (replyId) => {
        if (!window.confirm('Are you sure you want to delete this reply?')) {
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/delete-reply/${replyId}`);
            const postsResponse = await axios.get('http://127.0.0.1:5000/get-posts');
            setPosts(postsResponse.data);
            alert('Reply deleted');
        } catch (error) {
            console.error('Error deleting reply:', error);
        }
    };

    return (
        <div className="App">
            <div className='text-center mb-5'>
                <h1><strong>Community Platform</strong></h1>
            </div>
            {userType === 'student' && (
                <div className='d-flex justify-content-between mb-4'>
                    <Link to="/community-page/bookmarks">
                        <button className='btn btn-success'>My Bookmarks</button>
                    </Link>
                    <Link to="/community-page/create-post">
                        <button className='btn btn-primary'>Create Post</button>
                    </Link>
                </div>
            )}
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
            <div className='row'>
            {selectedPost && showEditModal && (
    <EditPostModal
        post={selectedPost}
        onSave={handleSaveChanges}
        onHide={() => setShowEditModal(false)}
    />
)}
                {currentPosts.map((post) => (
                    <div key={post.post_id} className='col-md-6 mb-4'>
                        <div className='card'>
                            <div className='card-body'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h4 className='card-title'>{post.title}</h4>
                                    {userType === 'student' && (
                                        <button className="btn btn-warning btn-sm" onClick={() => bookmarkPost(post.post_id)}>
                                            {bookmarkedPosts.some(b => b.post_id === post.post_id) ? <FontAwesomeIcon icon={faStarFilled} /> : <FontAwesomeIcon icon={faStarEmpty} />}
                                        </button>
                                    )}
                                </div>
                                <p className='card-text'>{post.description}</p>
                                <div className='d-flex justify-content-between'>
                                    <p className='card-text'><small className='text-muted'>Posted by: {post.name}</small></p>
                                    <p className='card-text'><small className='text-muted'>{post.date}</small></p>
                                </div>
                                <hr />
                                <div>
                                    <div className='d-flex'>
                                        <div><h6>Replies:</h6></div>
                                        <div>
                                            {post.replies.length > 0 && (
                                            <button className='btn btn-link btn-sm' onClick={() => toggleReplies(post.post_id)}>
                                                {showReplies[post.post_id] ? 'Hide Replies' : 'View Replies'}
                                            </button>
                                            )} 
                                        </div>
                                    </div>
                                    {showReplies[post.post_id] && post.replies.map(reply => (
                                        <div key={reply.reply_id} className='card mb-2'>
                                            <div className='card-body'>
                                                <div>
                                                    <div><strong>{reply.reply_name}:</strong> {reply.reply_content}</div>
                                                    <div align='right'>
                                                        <small>{reply.reply_date}</small>
                                                        {(userType === 'admin' || (userType === 'student' && reply.user_id === userId)) && (
                                                            <button className="btn btn-outline-danger btn-sm ms-2" onClick={() => deleteReply(reply.reply_id)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {userType === 'student' && (
                                    <div className='mt-3 d-flex'>
                                        <input
                                            type='text'
                                            className="form-control"
                                            placeholder="Add a reply"
                                            value={replyContents[post.post_id] || ''}
                                            onChange={(event) => handleReplyChange(event, post.post_id)}
                                        />
                                        <button className="btn btn-outline-primary btn-sm mt-2 ms-2" onClick={() => submitReply(post.post_id)}>Reply</button>
                                    </div>
                                )}
                                <div className='d-flex justify-content-end'>
                                    {(userType === 'student' && post.user_id === userId) && (
                                        <button className="btn btn-primary btn-sm mt-2 me-1" onClick={() => handleEditPost(post)}>
                                            <FontAwesomeIcon icon={faEdit} className="me-1" />Edit Post
                                        </button>
                                    )}
                                    {(userType === 'admin' || (userType === 'student' && post.user_id === userId)) && (
                                        <button className="btn btn-danger btn-sm mt-2" onClick={() => deletePost(post.post_id)}>
                                            <FontAwesomeIcon icon={faTrash} /> Delete Post
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}