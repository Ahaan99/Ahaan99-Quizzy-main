const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

const validateOptions = (options) => {
  if (!Array.isArray(options) || options.length < 2) {
    return "Options must be an array with at least two items.";
  }
  for (const option of options) {
    if (typeof option.text !== "string" || option.text.trim() === "") {
      return "Each option must have a non-empty 'text' string.";
    }
    if (typeof option.isCorrect !== "boolean") {
      return "Each option must have 'isCorrect' as boolean.";
    }
  }
  if (!options.some((o) => o.isCorrect)) {
    return "At least one option must be marked as correct.";
  }
  return null;
};

// ✅
exports.createQuestion = async (req, res) => {
  try {
    const { questionText, options, quizId } = req.body;

    if (!questionText || !quizId) {
      return res.status(400).json({ success: false, error: "questionText and quizId are required" });
    }

    const optionError = validateOptions(options);
    if (optionError) {
      return res.status(400).json({ success: false, error: optionError });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    const question = await Question.create({
      quizId,
      questionText: questionText.trim(),
      options,
    });

    return res.status(201).json({ success: true, message: "Question created successfully", data: question });
  } catch (e) {
    console.error("ERROR CREATING QUESTION:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.updateQuestion = async (req, res) => {
  try {
    const { questionText, options } = req.body;
    const { id } = req.params;

    if (!questionText) {
      return res.status(400).json({ success: false, error: "questionText is required" });
    }

    const optionError = validateOptions(options);
    if (optionError) {
      return res.status(400).json({ success: false, error: optionError });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      { questionText: questionText.trim(), options },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }

    return res.status(200).json({ success: true, message: "Question updated successfully", data: question });
  } catch (e) {
    console.error("ERROR UPDATING QUESTION:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, error: "Question not found" });
    }
    return res.status(200).json({ success: true, message: "Question deleted successfully" });
  } catch (e) {
    console.error("ERROR DELETING QUESTION:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.getQuizQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.id });
    return res.status(200).json({ success: true, data: questions });
  } catch (e) {
    console.error("ERROR GETTING QUIZ QUESTIONS:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
