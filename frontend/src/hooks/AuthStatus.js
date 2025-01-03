import { useState, useEffect } from "react"
import { useSelector } from "react-redux"

function AuthStatus() {
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isLoggedin, setIsLoggedIn ] = useState(false)
    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }

        setIsLoading(false)
    }, [user])

    return { isLoading, isLoggedin}
}

export default AuthStatus