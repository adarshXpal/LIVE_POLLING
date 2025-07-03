import { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { BsStars } from "react-icons/bs";
import { useSocket } from "../components/SocketComponent";

const Home = () => {
    const [active, setActive] = useState(0);
    const redirect = useNavigate();
    const [teacher, setTeacher] = useState(null);
    const socket = useSocket();
    console.log(teacher);
    useEffect(() => {
        if (socket) {
            socket.emit("get_teacher");
            socket.on("send_teacher", (t) => setTeacher(t));
        }
    }, [socket]);

    const submitHandler = () => {
        redirect(`/name?type=${active ? "Teacher" : "Student"}`);
    };
    return (
        <div className="Home">
            <div className="Logo">
                <BsStars />
                Intervue Poll
            </div>
            <div className="Heading">
                <div className="Heading1">
                    Welcome to
                    <span> Live Polling System</span>
                </div>
                <div className="Heading2">
                    Please select the role that best describes you to begin
                    using the live polling system
                </div>
            </div>

            <div className="Choices">
                <div
                    className={`button ${active === 0 && "Active"}`}
                    onClick={() => setActive(0)}
                >
                    <div className="heading">I’m a Student</div>
                    <div className="Content">
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry
                    </div>
                </div>
                <div
                    className={`button ${
                        active === 1 && teacher == null && "Active"
                    }`}
                    style={{ cursor: !teacher ? "pointer" : "not-allowed" }}
                    onClick={() => {
                        if (!teacher) {
                            setActive(1);
                        }
                    }}
                >
                    <div className="heading">I’m a Teacher</div>
                    <div className="Content">
                        Submit answers and view live poll results in real-time.
                    </div>
                </div>
            </div>

            <div className="submit" onClick={submitHandler}>
                Continue
            </div>
        </div>
    );
};

export default Home;
