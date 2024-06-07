import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

export default function EditPostModal({ post, onSave, onHide }) {
    const [editedPost, setEditedPost] = useState(post || { title: '', description: '' });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleSave = () => {
        onSave(editedPost);
    };

    return (
        <Modal show={true} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={editedPost.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={editedPost.description}
                        onChange={handleInputChange}
                        required
                    ></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
                <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}