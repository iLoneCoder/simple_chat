import "../styles/main.css"
import  { useState, useEffect, useRef, use } from "react"
import { useNavigate } from "react-router"
import { io } from "socket.io-client"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../features/auth/authSlice"
import Chatbox from "../components/Chatbox"
import { 
    generateKeyPair,
    handleFileRead,
    encryptMessage,
    decryptMessage
    } from "../utils/helpers"

function Main() {
    const [username, setUsername] = useState("")
    const [userPassword, setUserPassword] = useState("")
    const [token, setToken] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : "")
    const [room, setRoom] = useState("")
    const [roomPassword, setRoomPassword] = useState("")
    const [userFromDb, setUserFromDb] = useState(null)
    const [disabledRoom, setDisabledRoom] = useState(true)
    const [disabledMessage, setDisabledMessage] = useState(true)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [publicKeyArmored, setPublicKeyAromored] = useState("")
    const [privateKeyArmored, setPrivateKeyArmored] = useState("")

    const { user, isSuccess } = useSelector(state => state.auth)

    let socket = useRef(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

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
                text: `${user.username} ${message}`
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
            async function handleReceiveMessage(message) {
                console.log({publicKeyArmored})
                console.log({privateKeyArmored})
                if (message.type === "message") {
                    if (!privateKeyArmored) {
                        // setMessages(prevMessages => [...prevMessages, {
                        //     type: "message",
                        //     text: "Private key is empty, and can't decrypt message123"
                        // }])
                    } else {
                        const decryptedMessage = await decryptMessage(message.text, privateKeyArmored)
                        setMessages(prevMessages => [...prevMessages, {
                            type: "message",
                            text: decryptedMessage
                        }])
                    }
                    
                } else {
                    setMessages(prevMessages => [...prevMessages, message])
                }
            }
            
            socket.current.on("receive-message", handleReceiveMessage)


            return () => {
                socket.current.off("receive-message", handleReceiveMessage)
            }
        }

    }, [socket.current, publicKeyArmored, privateKeyArmored])


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

    useEffect(() => {
        if (user === null) {
            navigate("/login")
        }
    }, [user])

    async function handleRoomJoin() {
        try {
            socket.current.emit("join-room", {room,username: user.username, password: roomPassword})
        } catch (error) {
            console.log(error)
        }
    }

    async function handleSendMessage() {
        if (newMessage) {
            if (!publicKeyArmored) {
                console.log("public key is empty")
                return
            }

            setMessages(prevMessages => [...prevMessages, {
                type: "message",
                text: newMessage 
            }])


            const encryptedMessage = await encryptMessage(newMessage, publicKeyArmored)
            
            socket.current.emit("send-message", {username, room, message: encryptedMessage})
            setNewMessage("")
        }
    }

    function handleLogout() {
        dispatch(logout())
    }

    async function handleGenerateKeyPair() {
        await generateKeyPair(user)
    }
 
    return (<>
        <Chatbox messages={messages}/>
        <div className="form-wrapper">
            <div className="form">
                <label htmlFor="publicKey">Public key: </label>
                <input type="file" name="publicKey" id="publicKey" onChange={e => handleFileRead(e, setPublicKeyAromored)}/>
            </div>
        </div>
        <div className="form-wrapper">
            <div className="form">
                <label htmlFor="privateKey">Private key: </label>
                <input type="file" name="privateKey" id="privateKey" onChange={e => handleFileRead(e, setPrivateKeyArmored)}/>
            </div>
        </div>
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
        <button onClick={handleGenerateKeyPair}>Generate keypair</button>
        <button onClick={handleLogout}>Logout</button>
    </>)
}

export default Main