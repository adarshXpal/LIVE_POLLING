const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  value: { type: String, required: true },
  correct: { type: Boolean, default: false },
  count: { type: Number, default: 0 },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [optionSchema], required: true },
  time: { type: Number, default: 60 }
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
