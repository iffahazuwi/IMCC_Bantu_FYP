import './App.css';
import Navigation from './Navigation';
import Home from './pages/Home';
import MatchingPage from './pages/MatchingPage';
import CommunityPage from './pages/CommunityPage';
import UserPage from './pages/UserPage'
import {Route, Routes} from "react-router-dom"

function App() {
    // let Component
    // switch (window.location.pathname) {
    //     case "/":
    //         Component = <Home />
    //         break
    //     case "/matching-page":
    //         Component = <MatchingPage />
    //         break
    //     case "/community-page":
    //         Component = <CommunityPage />
    //         break
    //     case "/user-page":
    //         Component = <UserPage />
    //         break
    // }
    return (
        <>
            <Navigation />
            <div className='container'>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/matching-page" element={<MatchingPage />} />
                    <Route path="/community-page" element={<CommunityPage />} />
                    <Route path="/user-page" element={<UserPage />} />
                </Routes>
            </div>
        </>
    )
}

export default App;
