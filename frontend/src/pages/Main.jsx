import "../styles/main.css"
import  { useState, useEffect } from "react"
import { io } from "socket.io-client"

function Main() {
    const [username, setUsername] = useState("")
    const [room, setRoom] = useState("")
    const [userFromDb, setUserFromDb] = useState(null)
    const [disabledRoom, setDisabledRoom] = useState(true)
    const [disabledMessage, setDisabledMessage] = useState(true)

    let socket
    useEffect(() => {
        socket = io("http://localhost:8000", {
            autoConnect: false
        })
    }, [])

    async function handleUserJoin() {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/user/${username}`)
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message)
            }
            console.log(data)
            setUserFromDb({...data.data})
            setDisabledRoom(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleRoomJoin() {
        try {
            // const response = await fetch()
        } catch (error) {
            console.log(error)
        }
    }

    return (<>
        <div className="chatbox">
            Main page
        </div>
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
                <textarea name="message" id="message" className="message-box" disabled={disabledMessage}></textarea>
                <button disabled={disabledMessage}>Send</button>
            </div>
        </div>
    </>)
}

export default Main