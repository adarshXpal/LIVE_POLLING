import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import Name from "./pages/Name";
import CreateQuestion from "./pages/createQuestion";
import Kicked from "./pages/Kicked";
import Loading from "./pages/Loading";
import Question from "./pages/Question";
import ChatComponent from "./components/ChatComponent";
import SocketComponent from "./components/SocketComponent";

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/name", element: <Name /> },
    {
        path: "/",
        element: <ChatComponent />,
        children: [
            { path: "/setQuestion", element: <CreateQuestion /> },
            { path: "/Question", element: <Question /> },
        ],
    },
    { path: "/Kicked", element: <Kicked /> },
    { path: "/Loading", element: <Loading /> },
    { path: "/History", element: <></> },
]);

function App() {
    return (
        <SocketComponent>
            <RouterProvider router={router} />
        </SocketComponent>
    );
}

export default App;
