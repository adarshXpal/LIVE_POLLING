import { useEffect, useState } from "react";
import { LuAlarmClock } from "react-icons/lu";
import { IoEyeSharp } from "react-icons/io5";
import "./Question.css";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../components/SocketComponent";

function safeDivide(a, b) {
    if (b === 0) return 0; // avoid division by zero
    return +(a / b).toFixed(2);
}

const Question = () => {
    const redirect = useNavigate();
    const role = JSON.parse(sessionStorage.getItem("user_data")).role;
    const [submit, setSubmit] = useState(false);
    const [active, setActive] = useState(null);
    const [time, setTime] = useState(60);
    const [option, setOption] = useState([]);
    const [clicks, setClicks] = useState([]);
    const [question, setQuestion] = useState("");
    const [questionId, setQuestionId] = useState("");
    const index = JSON.parse(sessionStorage.getItem("user_data")).id;
    const total = clicks.reduce((acc, val) => acc + val, 0);
    const socket = useSocket();

    useEffect(() => {
        if (socket) {
            socket.emit("get_question");
            socket.on("send_question", ({ question, timer }) => {
                console.info(question, time);
                setTime(timer);
                setQuestion(question.question);
                setQuestionId(question._id);
                setOption(question.options.map(({ value }) => value));
            });
        }
    }, [socket]);

    useEffect(() => {
        if (time <= 0) return;

        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    const submitHandler = () => {
        if (socket) {
            socket.emit("submit", { questionId, index });
            setSubmit(true);
        } else {
            alert("Server disconnected");
        }
    };

    return (
        <div className="question">
            {role == "Teacher" && (
                <div className="history">
                    <IoEyeSharp size={"30px"} />
                    <span>View Poll history</span>
                </div>
            )}

            <div className="main">
                <div className="header">
                    <div className="title">Question</div>
                    {submit == true || (
                        <div className="timer">
                            <LuAlarmClock />
                            <div
                                style={{
                                    color: time < 10 ? "red" : "black",
                                    marginLeft: "5px",
                                }}
                            >
                                00:{time < 10 ? `0${time}` : time}
                            </div>
                        </div>
                    )}
                </div>
                <div className="question-table">
                    <div className="question-header">{question}</div>
                    <div className="question-content">
                        {role === "Teacher" || submit == true
                            ? option.map((o, i) => (
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
                                                  safeDivide(clicks[i], total) *
                                                  100
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
                                          {safeDivide(clicks[i], total) * 100}%
                                      </span>
                                  </div>
                              ))
                            : option.map((o, i) => (
                                  <div
                                      className="question-options"
                                      onClick={() =>
                                          setActive((t) => (t === i ? null : i))
                                      }
                                      style={{
                                          background:
                                              active === i
                                                  ? "white"
                                                  : "transparent",
                                          border:
                                              active === i
                                                  ? "1.5px solid #8f64e1"
                                                  : "1.5px solid #8D8D8D30",
                                      }}
                                  >
                                      <span
                                          className="index"
                                          style={{
                                              background:
                                                  active === i
                                                      ? "linear-gradient(243.94deg, #8f64e1 -50.82%, #4e377b 216.33%)"
                                                      : "#8D8D8D",
                                          }}
                                      >
                                          {i + 1}
                                      </span>
                                      <span className="option">{o}</span>
                                  </div>
                              ))}
                    </div>
                </div>
                {role === "Teacher" ? (
                    <div
                        className="submit"
                        onClick={() => redirect("/setQuestion")}
                    >
                        + Ask a new question
                    </div>
                ) : submit === false ? (
                    <div className="submit" onClick={submitHandler}>
                        Submit
                    </div>
                ) : (
                    <div className="wait">
                        Wait for the teacher to ask a new question..
                    </div>
                )}
            </div>
        </div>
    );
};

export default Question;
