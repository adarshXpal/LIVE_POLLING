import { useState } from "react";
import "./Home.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { useSocket } from "../components/SocketComponent";

const Name = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const [name, setName] = useState("");
    const redirect = useNavigate();
    const socket = useSocket();

    const submitHandler = () => {
        if (socket) {
            sessionStorage.setItem(
                "user_data",
                JSON.stringify({ name, id: socket.id, role: type })
            );
            socket.emit("register", { name, role: type });
        }
        socket.on("registered", () => {
            if (type === "Student") redirect("/loading");
            else redirect("/setQuestion");
        });
    };

    return (
        <div className="Home">
            <div className="Logo">
                <BsStars />
                Intervue Poll
            </div>
            <div className="Heading">
                <div className="Heading1">
                    Let's
                    <span> Get Started</span>
                </div>
                <div className="Heading2">
                    If you’re a student, you’ll be able to submit your answers,
                    participate in live polls, and see how your responses
                    compare with your classmates
                </div>
            </div>

            <div className="form_input">
                <label>Enter your Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Rahul Bajaj"
                />
            </div>

            <div className="submit" onClick={submitHandler}>
                Continue
            </div>
        </div>
    );
};

export default Name;
