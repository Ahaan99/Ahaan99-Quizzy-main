const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");

// ✅
exports.createQuiz = async (req, res) => {
  try {
    const { title, description, timer } = req.body;

    if (!title || !timer) {
      return res.status(400).json({ success: false, error: "Title and timer are required" });
    }

    if (typeof timer !== "number" || timer < 1 || timer > 180) {
      return res.status(400).json({ success: false, error: "Timer must be a number between 1 and 180 minutes" });
    }

    const quiz = await Quiz.create({
      title: title.trim(),
      description: description?.trim() || "",
      timer,
      createdBy: req.user.id,
    });

    return res.status(201).json({ success: true, message: "Quiz created successfully", data: quiz });
  } catch (e) {
    console.error("ERROR CREATING QUIZ:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, timer } = req.body;

    if (!title || !timer) {
      return res.status(400).json({ success: false, error: "Title and timer are required" });
    }

    if (typeof timer !== "number" || timer < 1 || timer > 180) {
      return res.status(400).json({ success: false, error: "Timer must be a number between 1 and 180 minutes" });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    quiz.title = title.trim();
    quiz.description = description?.trim() || "";
    quiz.timer = timer;
    await quiz.save();

    return res.status(200).json({ success: true, message: "Quiz updated successfully", data: quiz });
  } catch (e) {
    console.error("ERROR UPDATING QUIZ:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // Fixed: was using { quiz: quizId }, correct field is quizId
    await Question.deleteMany({ quizId });
    await Attempt.deleteMany({ quizId });
    await Quiz.findByIdAndDelete(quizId);

    return res.status(200).json({ success: true, message: "Quiz deleted successfully" });
  } catch (e) {
    console.error("ERROR DELETING QUIZ:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username email");
    return res.status(200).json({ success: true, data: quizzes });
  } catch (e) {
    console.error("ERROR GETTING QUIZZES:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).populate("createdBy", "username email");
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }
    return res.status(200).json({ success: true, data: quiz });
  } catch (e) {
    console.error("ERROR GETTING QUIZ:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.attemptQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, error: "quizId and answers array are required" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // Prevent duplicate attempts
    const existingAttempt = await Attempt.findOne({ userId, quizId });
    if (existingAttempt) {
      return res.status(400).json({ success: false, error: "You have already attempted this quiz" });
    }

    const questions = await Question.find({ quizId });
    if (questions.length === 0) {
      return res.status(400).json({ success: false, error: "This quiz has no questions" });
    }

    let score = 0;
    const answersArray = [];

    for (const question of questions) {
      const userAnswer = answers.find((ans) => ans.questionId === question._id.toString());
      if (userAnswer) {
        const selectedOption = question.options.id(userAnswer.selectedOption);
        if (selectedOption && selectedOption.isCorrect) {
          score += 1;
        }
        answersArray.push({
          questionId: question._id,
          selectedOption: userAnswer.selectedOption,
        });
      }
    }

    const attempt = await Attempt.create({ userId, quizId, score, answers: answersArray });

    // Update user's attempted quizzes list
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { attemptedQuizzes: quizId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Quiz attempted successfully",
      score,
      total: questions.length,
      attemptId: attempt._id,
    });
  } catch (e) {
    console.error("ERROR ATTEMPTING QUIZ:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id;
    const attempts = await Attempt.find({ userId }).populate("quizId", "title description");
    return res.status(200).json({ success: true, data: attempts });
  } catch (e) {
    console.error("ERROR FETCHING USER ATTEMPTS:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅
exports.getAdminQuizes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    return res.status(200).json({ success: true, data: quizzes });
  } catch (e) {
    console.error("ERROR FETCHING ADMIN QUIZZES:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅ Fixed: was .populate("userId score", "username") — score is not a ref
exports.getQuizAttempts = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    const attempts = await Attempt.find({ quizId }).populate("userId", "username email");
    return res.status(200).json({ success: true, data: attempts });
  } catch (e) {
    console.error("ERROR FETCHING QUIZ ATTEMPTS:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// ✅ Dashboard Stats
exports.getAdminDashboardStats = async (req, res) => {
  try {
    const adminId = req.user.id;
    const quizzes = await Quiz.find({ createdBy: adminId });
    const quizIds = quizzes.map(q => q._id);

    // 1. Total Quizzes
    const totalQuizzes = quizzes.length;

    // Fetch attempts for all quizzes owned by this admin
    const attempts = await Attempt.find({ quizId: { $in: quizIds } })
      .populate("userId", "username email")
      .populate("quizId", "title timer")
      .lean();

    // 2. Active Events (Proxied by attempts in the last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const activeEvents = attempts.filter(a => new Date(a.completedAt) >= oneWeekAgo).length;

    // 3. Students
    const uniqueStudentIds = new Set(attempts.map(a => a.userId?._id?.toString()).filter(Boolean));
    const totalStudents = uniqueStudentIds.size;

    // 4. Avg. Completion Rate
    let avgCompletion = 0;
    if (attempts.length > 0) {
      const totalPct = attempts.reduce((acc, a) => {
        const pct = a.answers?.length > 0 ? (a.score / a.answers.length) * 100 : 0;
        return acc + pct;
      }, 0);
      avgCompletion = Math.round(totalPct / attempts.length);
    }

    // 5. Top Students
    const userBestScores = {};
    attempts.forEach(a => {
      const uId = a.userId?._id?.toString();
      if(!uId) return;
      const pct = a.answers?.length > 0 ? (a.score / a.answers.length) * 100 : 0;
      if (!userBestScores[uId] || userBestScores[uId].score < pct) {
        userBestScores[uId] = {
           name: a.userId.username,
           subject: a.quizId?.title || "Mixed Quizzes",
           score: Math.round(pct),
           img: `https://ui-avatars.com/api/?name=${encodeURIComponent(a.userId.username)}&background=random`
        };
      }
    });

    const topStudents = Object.values(userBestScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    // 6. Recent Events (Simulate events with recent quiz attempts)
    const recentEvents = [...attempts]
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 4)
      .map(a => ({
         title: `${a.quizId?.title || 'Quiz'} Attempt Log`,
         date: new Date(a.completedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }),
         participants: 1,
         live: false,
         user: a.userId?.username
      }));

    // 7. Recent Quizzes
    const recentQuizzesRaw = await Quiz.find({ createdBy: adminId })
      .sort({ createdAt: -1 })
      .limit(4)
      .lean();
    
    const recentQuizzes = await Promise.all(recentQuizzesRaw.map(async (quiz) => {
       const quizAttempts = attempts.filter(a => a.quizId?._id?.toString() === quiz._id.toString());
       const completions = quizAttempts.length;
       const rate = completions > 0 
           ? Math.round(quizAttempts.reduce((acc, a) => acc + (a.answers?.length ? a.score/a.answers.length : 0), 0) / completions * 100) 
           : 0;
       const questionsCount = await Question.countDocuments({ quizId: quiz._id });
       return { ...quiz, completions, rate, questionsCount };
    }));

    return res.status(200).json({
      success: true,
      stats: { totalQuizzes, activeEvents, totalStudents, avgCompletion },
      topStudents,
      recentEvents,
      recentQuizzes
    });

  } catch (e) {
    console.error("ERROR FETCHING DASHBOARD STATS:", e);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
