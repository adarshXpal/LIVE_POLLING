import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket as S } from "./socket";

export const useSocket = () => {
    return useContext(S);
};

const SocketComponent = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(
            io("http://localhost:5000", {
                transports: ["websocket"], // or ['polling', 'websocket']
                autoConnect: false,
            })
        );
    }, []);

    return <S.Provider value={socket}>{children}</S.Provider>;
};

export default SocketComponent;
