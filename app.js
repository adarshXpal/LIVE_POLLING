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

// Serve React app only for routes that do not start with /api
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});


const PORT = process.env.PORT || 5000;
const studentMutex = new Mutex();

let teacher = null;
let students = []; // Renamed for clarity
let messages = [];
let currQuestion = null;
let timer = 0;
setInterval(() => {
  if (timer > 0) {
    timer--;
  }
}, 1000);

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
        io.emit("teacher-register", students.length - 1);
      } else {
        const release = await studentMutex.acquire();
        students.push(user.name);
        release();
        io.emit("participants", students);
      }
      socket.emit("registered", students.length - 1);
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
      currQuestion = addedQuestion;
      timer = ques.time;
      io.emit("show_question", currQuestion._id);
    } catch (err) {
      console.error("Error adding question:", err);
      socket.emit("error", "Failed to add question");
    }
  });
  //Sending currQuestion;
  socket.on("get_question", () => {
    socket.emit("send_question", {
      question: currQuestion,
      timer,
      totalStudent: students.length,
    });
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
      currQuestion.options[response.index].count++;
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
  // custom Count !!
  socket.on("get_result", () => {
    const optArray = currQuestion.options?.map((opt) => opt.count);
    socket.emit("results", {
      resultCount: optArray,
      totalStudent: students.length,
    });
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
  socket.on("kick_student", async (id) => {
    try {
      const release = await studentMutex.acquire();
      students.splice(id, 1);
      release();

      io.emit("student_kicked", id);
      io.emit("participants", students);
    } catch (err) {
      console.error("Error kicking student:", err);
      socket.emit("error", "Failed to kick student");
    }
  });

  //Chat System
  socket.on("send_message", (message) => {
    messages.push(message);
    io.emit("message", messages);
  });

  socket.on("get_message", () => {
    socket.emit("message", messages);
  });

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
