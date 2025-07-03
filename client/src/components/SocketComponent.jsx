import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket as S } from "./socket";

export const useSocket = () => {
    return useContext(S);
};

const SocketComponent = ({ children }) => {
    const [socket, setSocket] = useState(null);
    console.log("socket: ", socket);
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
