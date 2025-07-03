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

    if (socket) {
        socket.on("error", (msg) => {
            alert(msg);
        });

        socket.on("show_question", (id) => {
            const user = sessionStorage.getItem("user_data");
            if (user) {
                redirect(`/Question?id=${id}`);
            }
        });
    }
    useEffect(() => {
        const newSocket = io({
            path: "/api",
        });
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    return <S.Provider value={socket}>{children}</S.Provider>;
};

export default SocketComponent;
