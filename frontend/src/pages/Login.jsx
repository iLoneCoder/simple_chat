import { useState, useEffect, use } from "react"
import { useNavigate } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { login, reset } from "../features/auth/authSlice"
import styles from "../styles/login.module.css"

function Login() {
    const [formData, setFormData] = useState({username: "", password: ""})
    const { user, isSuccess, isError, message, isLoading } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isError) {
            console.log(message)
        }

        if (user || isSuccess) {
            navigate("/")
        }

        dispatch(reset())
    }, [isSuccess, isError, message, user])

    function handleChange(e) {
        setFormData(prevState => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        if (formData.username && formData.password) {
            dispatch(login(formData))
        }
        
    }

    if(user && isLoading) {
        return <div>LOADING...</div>
    }
    
    return <>
        <div className={styles.formContainer}>
            <h1>Login user</h1>
            <form onSubmit={handleSubmit}>
                <div className="formGroup">
                    <label htmlFor="username" className={styles.formLabel}>Username:</label>
                    <input type="text" name="username" id="username" value={formData.username} onChange={handleChange}/>
                </div>

                <div className="formGroup">
                    <label htmlFor="password" className={styles.formLabel}>Password:</label>
                    <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} autoComplete="false"/>
                </div>

                <div>
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    </>
}

export default Login