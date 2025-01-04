import "../styles/main.css"
import  { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/auth/authSlice"
import Chatbox from "../components/Chatbox"

function Main() {
    const [username, setUsername] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [token, setToken] = useState(JSON.parse(localStorage.getItem("user")).token)
    const [room, setRoom] = useState("")
    const [roomPassword, setRoomPassword] = useState("")
    const [userFromDb, setUserFromDb] = useState(null)
    const [disabledRoom, setDisabledRoom] = useState(true)
    const [disabledMessage, setDisabledMessage] = useState(true)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")

    const { user } = useSelector(state => state.auth)

    let socket = useRef(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (socket.current) {
            socket.current.emit("unsubscribe")
        }

        socket.current = io("http://localhost:8000", {
            auth: {
                token
            }
        })

        function handleConnection(message) {
            console.log(message)
            setDisabledRoom(false)
            setMessages([{
                type: "announcement",
                text: message
            }])
        }

        socket.current.on("authenticated", handleConnection)

        socket.current.on("connect_error", (error) => {
            console.log(error)
            setDisabledRoom(true)
        })

    }, [])

    useEffect(() => {
         if (socket.current) {
            function handleReceiveMessage(message) {
                setMessages(prevMessages => [...prevMessages, message])
            }
            
            socket.current.on("receive-message", handleReceiveMessage)


            return () => {
                socket.current.off("receive-message", handleReceiveMessage)
            }
        }

    }, [socket.current])


    useEffect(() => {
        console.log({socket: socket.current})
        if (socket.current) {
            function handleResponseOnJoin(message) {
                console.log(message)
                setMessages(prevMessages => [...prevMessages, message])
                if (message.type === "announcement") {
                    setDisabledMessage(false)
                }
            }

            socket.current.on("response_on_join", handleResponseOnJoin)
            
            return () => {
                socket.current.off("response_on_join", handleResponseOnJoin)
            }
        }
    }, [socket.current])

    // async function handleUserJoin() {
    //     try {
    //         if (!username || !userPassword) {
    //             console.log("Provide credentials")
    //             return
    //         }

    //         const response = await fetch("http://localhost:8000/api/v1/login", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 username,
    //                 password: userPassword
    //             })
    //         })

    //         const data = await response.json()
    //         if (!response.ok) {
    //             throw new Error(data.message)
    //         }

    //         if (socket.current) {
    //             socket.current.emit("unsubscribe")
    //         }

    //         setToken(data.token)
    //         socket.current = io("http://localhost:8000", {
    //             // autoConnect: false,
    //             auth: {
    //                 token: data.token
    //             }
    //         })

    //         // Handle auth success
    //         if (socket.current) {
    //             function handleConnection(message) {
    //                 console.log(message)
    //                 setDisabledRoom(false)
    //                 setMessages([{
    //                     type: "announcement",
    //                     text: message
    //                 }])
    //             }
    
    //             socket.current.on("authenticated", handleConnection)
            
    //         }

    //         // Handle auth error
    //         if (socket.current) {
    //             socket.current.on("connect_error", (error) => {
    //                 console.log(error)
    //                 setDisabledRoom(true)
    //             })
    //         }
            
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    async function handleRoomJoin() {
        try {
            socket.current.emit("join-room", {room,username: user.username, password: roomPassword})
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSendMessage() {
        if (newMessage) {
            setMessages(prevMessages => [...prevMessages, {
                type: "message",
                text: newMessage 
            }])
            socket.current.emit("send-message", {username, room, message: newMessage})
            setNewMessage("")
        }
    }

    function handleLogout() {
        dispatch(logout())
    }

    return (<>
        <Chatbox messages={messages}/>
        {/* <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="username">Username: </label>
                <input type="text" className="form-input" id="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
        </div>
        <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="user-password">Password: </label>
                <input type="text" className="form-input" id="user-password" value={userPassword} onChange={(e) => setUserPassword(e.target.value)}/>
                <button onClick={handleUserJoin}>Join</button>
            </div>
        </div> */}
        <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="room">room: </label>
                <input type="text" className="form-input" id="room" onChange={(e) => setRoom(e.target.value)}/>
            </div>
        </div>
        <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="room">R pass: </label>
                <input type="text" className="form-input" id="room" value={roomPassword} onChange={(e) => setRoomPassword(e.target.value)}/>
                <button onClick={handleRoomJoin} >Join</button>
            </div>
        </div>
        <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea name="message" id="message" className="message-box" disabled={disabledMessage} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}></textarea>
                <button disabled={disabledMessage} onClick={handleSendMessage}>Send</button>
            </div>
        </div>
        <button onClick={handleLogout}>Logout</button>
    </>)
}

export default Main