const express = require("express");
const http = require("http");
const socket = require("socket.io");
const { Mutex } = require("async-mutex");
const questionModel = require("./models/question.model");
const path = require("path");

require("dotenv").config();
require("./config/mongoose.connection.js");

const app = express();
app.use(express.static(path.join(__dirname, "client/build")));

const server = http.createServer(app);
const io = socket(server, {
    cors: { origin: "*" },
    path: "/api",
});

app.get("*endpoint", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

const PORT = process.env.PORT || 5000;
const studentMutex = new Mutex();

let teacher = null;
let students = []; // Renamed for clarity
let messages = [];

io.on("connect", (socket) => {
    console.log(`Connected: ${socket.id}`);

    // Login Page: Send teacher data
    socket.on("get_teacher", () => {
        socket.emit("send_teacher", teacher);
    });

    // Name Page: Register user (teacher/student)
    socket.on("register", async (user) => {
        try {
            if (!user?.name || !user?.role) {
                return socket.emit("error", "Name and role are required");
            }

            if (user.role === "Teacher") {
                teacher = { name: user.name, socketId: socket.id };
            } else {
                const release = await studentMutex.acquire();
                students.push({ name: user.name, socketId: socket.id });
                release();
            }
            socket.emit("registered");
        } catch (err) {
            console.error("Registration error:", err);
            socket.emit("error", "Registration failed");
        }
    });

    // Add Question Page: Create a new question
    socket.on("add_question", async (ques) => {
        try {
            if (!ques?.question || !ques?.options) {
                return socket.emit(
                    "error",
                    "Question and options are required"
                );
            }

            const addedQuestion = await questionModel.create(ques);
            socket.emit("added");
            io.emit("show_question", addedQuestion);
        } catch (err) {
            console.error("Error adding question:", err);
            socket.emit("error", "Failed to add question");
        }
    });

    // Show Question Page: Submit answer
    socket.on("submit", async (response) => {
        try {
            if (!response?.questionId || response?.index === undefined) {
                return socket.emit("error", "Invalid response data");
            }

            const resQuestion = await questionModel.findById(
                response.questionId
            );
            if (!resQuestion) {
                return socket.emit("error", "Question not found");
            }

            resQuestion.options[response.index].count++;
            await resQuestion.save();

            const optArray = resQuestion.options.map((opt) => opt.count);
            io.emit("results", {
                resultCount: optArray,
                totalStudent: students.length,
            });
        } catch (err) {
            console.error("Error submitting response:", err);
            socket.emit("error", "Failed to submit response");
        }
    });

    // View History Page: Fetch all questions
    socket.on("show_history", async () => {
        try {
            if (teacher?.socketId !== socket.id) {
                return socket.emit("error", "Unauthorized");
            }

            const questions = await questionModel.find();
            socket.emit("history", questions);
        } catch (err) {
            console.error("Error fetching history:", err);
            socket.emit("error", "Failed to load history");
        }
    });

    // Show Participants: List all students
    socket.on("show_participants", () => {
        try {
            socket.emit("participants", students);
        } catch (err) {
            console.error("Error fetching participants:", err);
            socket.emit("error", "Failed to load participants");
        }
    });

    // Kick Student: Remove a student by socket ID
    socket.on("kick_student", async (socketIdToRemove) => {
        try {
            if (teacher?.socketId !== socket.id) {
                return socket.emit("error", "Only teachers can kick students");
            }

            const release = await studentMutex.acquire();
            students = students.filter((s) => s.socketId !== socketIdToRemove);
            release();

            socket.emit("student_kicked");
            io.emit("participants", students);
        } catch (err) {
            console.error("Error kicking student:", err);
            socket.emit("error", "Failed to kick student");
        }
    });

    //Chat System
    socket.on("send_message", (message) => {
        messages.push(message);
        io.emit("message", message);
    });

    // socket.on("get_message", message);

    // Cleanup on disconnect
    socket.on("disconnect", () => {
        try {
            if (teacher?.socketId === socket.id) {
                teacher = null;
            } else {
                students = students.filter((s) => s.socketId !== socket.id);
            }
            console.log(`Disconnected: ${socket.id}`);
        } catch (err) {
            console.error("Disconnection error:", err);
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running on  http://localhost:${PORT}`);
});
