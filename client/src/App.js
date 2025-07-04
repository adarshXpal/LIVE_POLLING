import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import "./index.css";
import Name from "./pages/Name";
import CreateQuestion from "./pages/createQuestion";
import Kicked from "./pages/Kicked";
import Loading from "./pages/Loading";
import Question from "./pages/Question";
import ChatComponent from "./components/ChatComponent";
import SocketComponent from "./components/SocketComponent";
import History from "./pages/History";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <SocketComponent>
                <Outlet />
            </SocketComponent>
        ),
        children: [
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
            { path: "/History", element: <History /> },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
