import { useState } from "react";
import "./createQuestion.css";
import { BsStars } from "react-icons/bs";

const CreateQuestion = () => {
    const [question, setQuestion] = useState("Rahul Bajaj");
    const [time, setTime] = useState(60);
    const [options, setOption] = useState([{ value: "", correct: true }]);
    return (
        <div className="create-question">
            <div className="Logo" style={{ marginLeft: "1rem" }}>
                <BsStars />
                Intervue Poll
            </div>
            <div
                className="Heading"
                style={{ textAlign: "left", marginLeft: "1rem" }}
            >
                <div className="Heading1" style={{ marginBottom: ".5rem" }}>
                    Let's
                    <span> Get Started</span>
                </div>
                <div className="Heading2">
                    you’ll have the ability to create and manage polls, ask
                    questions, and monitor your students' responses in
                    real-time.
                </div>
            </div>

            <div className="text-area-container">
                <div className="label">
                    <label>Enter your question</label>
                    <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    >
                        <option value="60">60 seconds</option>
                        <option value="10">10 seconds</option>
                        <option value="15">15 seconds</option>
                        <option value="20">20 seconds</option>
                        <option value="30">30 seconds</option>
                        <option value="45">45 seconds</option>
                    </select>
                </div>

                <div className="text-area">
                    <textarea
                        value={question}
                        onChange={(e) => {
                            if (e.target.value.length <= 100)
                                setQuestion(e.target.value);
                        }}
                        rows={5}
                    >
                        Rahul Bajaj
                    </textarea>
                    <div className="count">{question.length}/100</div>
                </div>
            </div>

            <div className="options">
                <div className="values">
                    <label>Edit Options</label>
                    <div className="option-container">
                        {options.map(({ value }, i) => (
                            <div className="option-input">
                                <div>{i + 1}</div>
                                <input
                                    placeholder="Type the option"
                                    value={value}
                                    onChange={(e) =>
                                        setOption((t) => {
                                            const newOptions = [...t];
                                            newOptions[i] = {
                                                ...newOptions[i],
                                                value: e.target.value,
                                            };
                                            return newOptions;
                                        })
                                    }
                                />
                            </div>
                        ))}
                    </div>
                    <div
                        className="button"
                        onClick={() =>
                            setOption((t) => {
                                return [...t, { value: "", correct: false }];
                            })
                        }
                    >
                        + Add More option
                    </div>
                </div>
                <div className="correct">
                    <label>Is it Correct?</label>
                    <div className="checkboxes">
                        {options.map(({ correct }, i) => (
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        checked={correct}
                                        onChange={() =>
                                            setOption((t) => {
                                                const newOptions = [...t];
                                                newOptions[i] = {
                                                    ...newOptions[i],
                                                    correct: true,
                                                };
                                                return newOptions;
                                            })
                                        }
                                    />
                                    YES
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        checked={!correct}
                                        onChange={() =>
                                            setOption((t) => {
                                                const newOptions = [...t];
                                                newOptions[i] = {
                                                    ...newOptions[i],
                                                    correct: false,
                                                };
                                                return newOptions;
                                            })
                                        }
                                    />
                                    No
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="button">Ask Question</div>
        </div>
    );
};

export default CreateQuestion;
