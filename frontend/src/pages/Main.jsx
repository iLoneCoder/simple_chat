import "../styles/main.css"
import  { useState, useEffect, useRef } from "react"
import { io } from "socket.io-client"
import Chatbox from "../components/Chatbox"

function Main() {
    const [username, setUsername] = useState("")
    const [room, setRoom] = useState("")
    const [userFromDb, setUserFromDb] = useState(null)
    const [disabledRoom, setDisabledRoom] = useState(true)
    const [disabledMessage, setDisabledMessage] = useState(true)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")

    let socket = useRef(null)
    useEffect(() => {
        socket.current = io("http://localhost:8000", {
            autoConnect: false
        })

        return () => {
            if (socket.current) {
                socket.current.disconnect()
            }
        }
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

    }, [])


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
    }, [])

    async function handleUserJoin() {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/user/${username}`)
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message)
            }
            
            setUserFromDb({...data.data})
            setDisabledRoom(false)
            
            if (socket.current) {
                socket.current.emit("unsubscribe")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function handleRoomJoin() {
        try {
            socket.current.connect()
            socket.current.emit("join-room", {room, username})
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

    return (<>
        <Chatbox messages={messages}/>
        <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="username">Username: </label>
                <input type="text" className="form-input" id="username" onChange={(e) => setUsername(e.target.value)}/>
                <button onClick={handleUserJoin}>Join</button>
            </div>
        </div>
        <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="room">room: </label>
                <input type="text" className="form-input" id="room" onChange={(e) => setRoom(e.target.value)} disabled={disabledRoom}/>
                <button onClick={handleRoomJoin} disabled={disabledRoom}>Join</button>
            </div>
        </div>
        <div className="form-wrapper">
            <div className="form">
                <label className="form-label" htmlFor="message">Message</label>
                <textarea name="message" id="message" className="message-box" disabled={disabledMessage} value={newMessage} onChange={(e) => setNewMessage(e.target.value)}></textarea>
                <button disabled={disabledMessage} onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    </>)
}

export default Main