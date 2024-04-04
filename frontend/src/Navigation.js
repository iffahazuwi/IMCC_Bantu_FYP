import { Link, useMatch, useResolvedPath } from "react-router-dom"
export default function Navigation() {

    return (
        <nav className="nav">
            <Link to="/home" className="site-title">
                <img src="./USM_Logo.png" alt="" width={36} height={36}/>
                <img src="./Latest_IMCC-Logo-2017.png" alt="" width={36} height={36}/>
                IMCC Bantu
            </Link>
            <ul>
                <CustomLink to="/matching-page">Matching Page</CustomLink>
                <CustomLink to="/community-page">Community Page</CustomLink>
                <CustomLink to="/user-page">User Page</CustomLink>
            </ul>
        </nav>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to}{...props}>
                {children}
            </Link>
        </li>
    )
}