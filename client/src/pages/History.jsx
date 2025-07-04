import { useEffect, useState } from "react";
import { useSocket } from "../components/SocketComponent";

function safeDivide(a, b) {
    console.info(a, b);
    if (b === 0) return 0; // avoid division by zero
    return +(a / b).toFixed(2);
}

const History = () => {
    const [data, setData] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit("show_history");
            socket.on("history", (questions) => setData(questions));
        }
    }, [socket]);
    console.table(data);
    return (
        <div className="history">
            <div
                className="Heading"
                style={{ paddingTop: "2rem", paddingBottom: "2rem" }}
            >
                <div className="Heading1">
                    View <span>Poll History</span>
                </div>
            </div>
            <div className="Table">
                {data.map(({ question, options }) => (
                    <div
                        className="question-table"
                        style={{ maxWidth: "737px" }}
                    >
                        <div className="question-header">{question}</div>
                        <div className="question-content">
                            {options.map(({ value: o, count }, i) => (
                                <div
                                    className="question-options"
                                    style={{
                                        background: "transparent",
                                        border: "1.5px solid #8D8D8D30",
                                    }}
                                >
                                    <span
                                        className="bg"
                                        style={{
                                            width: `${
                                                safeDivide(
                                                    count,
                                                    options
                                                        .map(
                                                            ({ count }) => count
                                                        )
                                                        .reduce(
                                                            (cum, curr) =>
                                                                cum + curr,
                                                            0
                                                        )
                                                ) * 100
                                            }%`,
                                        }}
                                    />
                                    <span
                                        className="index"
                                        style={{
                                            background: "white",
                                            color: "black",
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    <span className="option">{o}</span>
                                    <span className="percent">
                                        {safeDivide(
                                            count,
                                            options
                                                .map(({ count }) => count)
                                                .reduce(
                                                    (cum, curr) => cum + curr,
                                                    0
                                                )
                                        ) * 100}
                                        %
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
