import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import axios from './axios';

export default function CommunityPage() {

    const [posts, setPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [userType, setUserType] = useState('');
    const [isMentor, setIsMentor] = useState(false);
    const [replyContents, setReplyContents] = useState({});
    const [showReplies, setShowReplies] = useState({});

    useEffect(() => {
        const fetchUserRole = async () => {
            try{
                const response = await axios.get('http://localhost:5000/getUserRole', {withCredentials: true});
                setUserType(response.data.type);
                setIsMentor(response.data.is_mentor);
            } catch (error){
                console.error('Error fetching user role:', error);
            }
        };
    
        const fetchPosts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/get-posts');
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
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
    }, []);

    const handleReplyChange = (event, postId) => {
        const { value } = event.target;
        setReplyContents(prevState => ({
            ...prevState,
            [postId]: value, // Store reply content for the specific post
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
                reply_content: replyContents[postId], // Get reply content for the specific post
            }, { withCredentials: true });

            // Refresh posts to show the new reply
            const postsResponse = await axios.get('http://127.0.0.1:5000/get-posts');
            setPosts(postsResponse.data);
            setReplyContents(prevState => ({
                ...prevState,
                [postId]: '', // Clear reply content for the specific post after submission
            }));
            alert(response.data.message);
        } catch (error) {
            console.error('Error adding reply:', error);
        }
    };

    const toggleReplies = (postId) => {
        setShowReplies(prevState => ({
            ...prevState,
            [postId]: !prevState[postId], // Toggle the show/hide state
        }));
    };

    if (userType === 'student' && !isMentor) {
        return (
            <div className="App">
                <div className='col mb-6' align='center'>
                    <h1>Community Page</h1>
                </div>
                <div className='pt-4'>
                    <h4>
                        Sorry, you have no access to this content.
                        <br/>Only mentors can have full access to this page.
                    </h4>
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

    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>Community Page</h1>
            </div>
            {userType === 'student' && (<div>
                <div className='row mb-4'>
                <div className='col' align='left'>
                    <Link to="/community-page/bookmarks">
                        <button
                            className='btn btn-success'
                        >My Bookmarks</button>
                    </Link>
                </div>
                <div className='col' align='right'>
                    <Link to="/community-page/create-post">
                        <button
                            className='btn btn-primary'
                        >Create Post</button>
                    </Link>
                </div>
            </div></div>)}
            
            <div className='posts'>
                {posts.map((post) => (
                    <div key={post.post_id} className='post mb-3 pt-3 ps-3 pe-3 border border-dark rounded'>
                        <div className='row'>
                            <div className='col-md-11'>
                                <h2>{post.title}</h2>
                                <p>{post.description}</p>
                            </div>
                            <div className='col-md-1 d-flex flex-column align-items-end'>
                                {userType === 'student' && (<div>
                                <div className=" mb-1" align="right">
                                <button className="btn btn-warning btn-sm" onClick={() => bookmarkPost(post.post_id)}>
                                    {bookmarkedPosts.some(b => b.post_id === post.post_id) ? 'Unsave' : 'Save'}
                                </button>
                                </div></div>)}
                                <div className=" mb-1" align="right">
                                    <button className="btn btn-danger btn-sm"
                                    onClick={() => deletePost(post.post_id)}>Del</button>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col'><p><strong>Posted by:</strong> {post.name}</p></div>
                            <div className='col' align="right"><small>{post.date}</small></div>
                        </div>
                        <hr/>
                        <div className='row mb-2'>
                            <div className='col'>
                                <h6>Replies:
                                {post.replies.length > 0 &&
                                    <button className='btn btn-link btn-sm' onClick={() => toggleReplies(post.post_id)}>
                                        {showReplies[post.post_id] ? 'Hide Replies' : 'View Replies'}
                                    </button>
                                }</h6>
                                {showReplies[post.post_id] && post.replies.map(reply => (
                                    <div key={reply.reply_id} className='reply row'>
                                    <div className='col-md-9'><strong>{reply.reply_name}:</strong>  {reply.reply_content}</div>
                                    <div className='col-md-3' align='right'><small>{reply.reply_date}</small></div>
                                </div>
                                ))}
                            </div>
                        </div>
                        {userType === 'student' && (<div>
                            <div className='row'>
                            <div className='col mt-1'>
                                <input
                                    type='text'
                                    className="form-control"
                                    placeholder="Add a reply"
                                    value={replyContents[post.post_id] || ''} // Modified value to use specific reply content for each post
                                    onChange={(event) => handleReplyChange(event, post.post_id)} // Modified onChange handler to include postId parameter
                                />
                                <button className="btn btn-primary btn-sm mt-2 mb-2" onClick={() => submitReply(post.post_id)}>Reply</button>
                            </div>
                        </div>
                        </div>)}
                        
                    </div>
                ))}
            </div>
        </div>
    );
}