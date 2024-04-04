import './App.css';

export default function UserPage(){
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