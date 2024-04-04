import React, { useState, useEffect } from 'react'
import APIService from './components/APIService'

function FeedbackForm(props){

    const [comment, setComment] = useState('')

    useEffect(() => {
        setComment(props.feedback.comment)
    }, [props.feedback])

    const submitFeedback = () => {
        APIService.SubmitFeedback({ comment })
            .then(resp => props.submitFeedback(resp))
            .catch(error => console.log(error))
    }

    return (
        <div>
            {props.feedback ? (
                <div className="mb-3">

                    <label htmlFor="comment" className="form-label mt-2">Overall Comment</label>
                    <textarea
                        rows="5"
                        value={comment}
                        className="form-control"
                        placeholder="Please Enter Comment for This Mentor"
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div align='center'>
                        <button
                            className="btn btn-success mt-3"
                            onClick={submitFeedback}
                        >Submit</button>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default FeedbackForm