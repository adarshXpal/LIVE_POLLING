import { Outlet } from "react-router-dom";
import "./chat.css";
import { BsChatRight } from "react-icons/bs";
import { useState } from "react";
import { IoSend } from "react-icons/io5";

const ChatComponent = () => {
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState("Student");
    const [select, setSelect] = useState(0);
    const [participants] = useState([
        { name: "Pushpender Rautela" },
        { name: "Rijul Zalpuri" },
        { name: "Nadeem N" },
        { name: "Ashwin Sharma" },
    ]);
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
                                    <>
                                        <div className="chat-other">
                                            <div className="chat-author">
                                                User 1
                                            </div>
                                            <div className="chat-chat">
                                                Hey there, how can I help?
                                            </div>
                                        </div>
                                        <div className="chat-user">
                                            <div className="chat-author">
                                                User 2
                                            </div>
                                            <div className="chat-chat">
                                                Nothing bro..just chill!!
                                            </div>
                                        </div>
                                        <div className="chat-other">
                                            <div className="chat-author">
                                                User 3
                                            </div>
                                            <div className="chat-chat">
                                                Okay
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <header>
                                            <div>Name</div>
                                            {role === "Teacher" && (
                                                <div>Action</div>
                                            )}
                                        </header>
                                        {participants.map(({ name }) => (
                                            <div className="participants">
                                                <div>{name}</div>
                                                {role === "Teacher" && (
                                                    <div className="button">
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
                                />
                                <div className="button">
                                    <IoSend size={"25px"} />
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
