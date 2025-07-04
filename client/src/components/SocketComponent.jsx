import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket as S } from "./socket";
import { useNavigate } from "react-router-dom";

export const useSocket = () => {
    return useContext(S);
};

const SocketComponent = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const redirect = useNavigate();
    console.log("socket: ", socket);

    useEffect(() => {
        const newSocket = io({
            path: "/api",
        });
        setSocket(newSocket);
        newSocket.on("error", (msg) => {
            alert(msg);
        });

        newSocket.on("show_question", (id) => {
            const user = sessionStorage.getItem("user_data");
            if (user) {
                redirect(`/Question?id=${id}`);
            }
        });
        newSocket.on("student_kicked", (i) => {
            const user = sessionStorage.getItem("user_data");
            if (user) {
                const { id } = JSON.parse(user);
                sessionStorage.clear();
                if (id == i) redirect(`/Kicked`);
            }
        });
        return () => newSocket.close();
    }, []);

    return <S.Provider value={socket}>{children}</S.Provider>;
};

export default SocketComponent;
