import { useEffect } from "react"

function Chatbox({messages}) {
    // const messages = [
    //     {
    //         type: "announcement",
    //         text: "You have joined {{ROOMNAME}}"
    //     },
    //     {
    //         type: "message",
    //         text: "what's up"
    //     },
    //     {
    //         type: "message",
    //         text: "what's up"
    //     }
    // ]
    useEffect(() => {
        console.log(messages)
    }, [messages])
    
    return (
        <div className="chatbox">
            <ul>
                {messages.map((message, index) => (
                    <li 
                        key={index} 
                        className={message.type === "announcement" ? "announcement": message.type === "error" ? "error" : "message"}
                        style={
                            index % 2 === 0 && message.type === "message"
                              ? { backgroundColor: "grey", color: "#fff" }
                              : undefined
                          }
                    >
                        {message.text}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Chatbox