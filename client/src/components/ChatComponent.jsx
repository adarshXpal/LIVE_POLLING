import { Outlet } from "react-router-dom";
import "./chat.css";
import { BsChatRight } from "react-icons/bs";
import { useEffect, useState } from "react";
import { IoSend } from "react-icons/io5";
import { useSocket } from "./SocketComponent";

const ChatComponent = () => {
    const [open, setOpen] = useState(false);
    const { role, id, name } =
        JSON.parse(sessionStorage.getItem("user_data") || "{}") || {};
    const [select, setSelect] = useState(0);
    const [participants, setParticipants] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const socket = useSocket();
    console.log(participants);

    useEffect(() => {
        if (socket) {
            socket.emit("show_participants");
            socket.on("participants", (students) => {
                setParticipants(students);
            });

            socket.emit("get_message");
            socket.on("message", (message) => {
                setMessages(message);
            });
        }
    }, [socket]);

    return (
        <>
            <Outlet />
            <div className="chat">
                <div className="icon" onClick={() => setOpen((t) => !t)}>
                    <BsChatRight size={"30px"} />
                </div>
                {open && (
                    <div className="chat-content">
                        <header>
                            <div
                                style={{
                                    borderBottom:
                                        select == 0
                                            ? "4px solid #8F64E1"
                                            : "none",
                                }}
                                onClick={() => setSelect(0)}
                            >
                                Chat
                            </div>
                            <div
                                style={{
                                    borderBottom:
                                        select == 1
                                            ? "4px solid #8F64E1"
                                            : "none",
                                }}
                                onClick={() => setSelect(1)}
                            >
                                Participants
                            </div>
                        </header>
                        <section>
                            <div className="overflow">
                                {select == 0 ? (
                                    messages.map(
                                        ({ name: n, id: i, message }) => (
                                            <div
                                                className={
                                                    i == id
                                                        ? "chat-user"
                                                        : "chat-other"
                                                }
                                            >
                                                <div className="chat-author">
                                                    {n}
                                                </div>
                                                <div className="chat-chat">
                                                    {message}
                                                </div>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <>
                                        <header>
                                            <div>Name</div>
                                            {role === "Teacher" && (
                                                <div>Action</div>
                                            )}
                                        </header>
                                        {participants.map((name, i) => (
                                            <div className="participants">
                                                <div>{name}</div>
                                                {role === "Teacher" && (
                                                    <div
                                                        className="button"
                                                        onClick={() => {
                                                            if (socket)
                                                                socket.emit(
                                                                    "kick_student",
                                                                    i
                                                                );
                                                        }}
                                                    >
                                                        Kick out
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        </section>
                        {select === 0 && (
                            <form>
                                <input
                                    type="text"
                                    placeholder="Type your message here"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <div className="button">
                                    <IoSend
                                        size={"25px"}
                                        onClick={() => {
                                            if (socket && input != "") {
                                                socket.emit("send_message", {
                                                    id,
                                                    name,
                                                    message: input,
                                                });
                                                setInput("");
                                            }
                                        }}
                                    />
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ChatComponent;
