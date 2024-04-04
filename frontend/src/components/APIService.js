

export default class APIService {
    static UpdateArticle(id, body) {
        return fetch(`http://127.0.0.1:5000/community-page/update/${id}/`, {
            'method': 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(resp => resp.json())
    }

    static InsertArticle(body) {
        return fetch(`http://127.0.0.1:5000/community-page/add`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(resp => resp.json())
    }

    static DeleteArticle(id) {
        return fetch(`http://127.0.0.1:5000/community-page/delete/${id}/`, {
            'method': 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    }

    static SubmitFeedback(comment) {
        return fetch(`http://127.0.0.1:5000/matching-page/add`, {
            'method': 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            comment: JSON.stringify(comment)
        })
            .then(resp => resp.json())
    }
}