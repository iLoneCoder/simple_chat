import { Navigate, Outlet } from "react-router"
import AuthStatus from "../hooks/AuthStatus"


function ProtectedRoute() {
    const { isLoading, isLoggedin } = AuthStatus()
    
    if(isLoading) {
        return <div>LOADING...</div>
    }

    return isLoggedin ? <Outlet /> : <Navigate to={"/login"} />
}

export default ProtectedRoute