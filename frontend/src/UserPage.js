import './App.css';
import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function UserPage() {
    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>User Page</h1>
            </div>
            <div className='col'>
                <div className="mb-4" align='right'>
                    <Link to="/user-page/notifications">
                        <button
                            className='btn btn-primary'
                            // onClick={openForm}
                        >Notification</button>
                    </Link>   
                </div>
                <div className='mb-4' align='center'>
                    <img className='border mb-4' src="./user-128.png" alt="" width={120} height={120} />
                    <h3>Name: </h3>
                    <h3>Matric Number: </h3>
                    <h3>Contact Number: </h3>
                    <h3>Email Address: </h3>
                    <h3>School: </h3>
                    <h3>Mentor Status: </h3>
                </div>
                <hr />
                <div className="mb-2" align='center'>
                    <Link to="/user-page/application-form">
                        <button
                            className='btn btn-success'
                            // onClick={openForm}
                        >Mentor Application Form</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}