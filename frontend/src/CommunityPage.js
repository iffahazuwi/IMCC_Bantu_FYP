import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import './App.css';
import axios from './axios';

export default function CommunityPage() {

    const [posts, setPosts] = useState([]);
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [userType, setUserType] = useState('');
    const [isMentor, setIsMentor] = useState(false);

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
                                    {bookmarkedPosts.some(b => b.post_id === post.post_id) ? 'Unfav' : 'Fav'}
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
                    </div>
                ))}
            </div>
        </div>
    );
}