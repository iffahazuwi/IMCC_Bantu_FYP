import './App.css';

export default function UserPage() {
    return (
        <div className="App">
            <div className='col mb-3' align='center'>
                <h1>User Page</h1>
            </div>
            <div className='col'>
                <div className="mb-4" align='right'>
                    <button
                        className='btn btn-primary'
                    // onClick={openForm}
                    >Notification</button>
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
                    <button
                        className='btn btn-success'
                    // onClick={openForm}
                    >Mentor Application Form</button>
                </div>
            </div>
        </div>
    );
}