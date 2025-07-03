import { BsStars } from "react-icons/bs";
const Kicked = () => {
    return (
        <div className="kicked">
            <div className="Logo" style={{ marginLeft: "1rem" }}>
                <BsStars />
                Intervue Poll
            </div>
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
                    You have been Kicked out !
                </div>
                <div className="Heading2" style={{ fontWeight: "400" }}>
                    Looks like the teacher had removed you from the poll system
                    .Please Try again sometime.
                </div>
            </div>
        </div>
    );
};

export default Kicked;
