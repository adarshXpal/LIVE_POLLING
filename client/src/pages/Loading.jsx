import { BsStars } from "react-icons/bs";
const Loading = () => {
    return (
        <div className="kicked">
            <div className="Logo" style={{ marginLeft: "1rem" }}>
                <BsStars />
                Intervue Poll
            </div>
            <div className="spinner"></div>
            <div
                className="Heading"
                style={{
                    marginLeft: "1rem",
                    maxWidth: "737px",
                }}
            >
                <div
                    className="Heading1"
                    style={{ marginBottom: ".5rem", fontWeight: "400" }}
                >
                    <span>Wait for the teacher to ask questions..</span>
                </div>
            </div>
        </div>
    );
};

export default Loading;
