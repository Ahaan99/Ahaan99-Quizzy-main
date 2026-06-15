import { useEffect, useState, useCallback } from 'react'
import React from 'react'
import { apiConnector } from "../services/apiConnector"
import { useParams, useNavigate } from 'react-router-dom'
import { questionEndpoints, quizEndpoints } from '../services/APIs'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../slices/AuthSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiChevronLeft, FiChevronRight, FiSend, FiPlay, FiX, FiAlertTriangle } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const CircularTimer = ({ remaining, total }) => {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = remaining / total
  const strokeDashoffset = circumference * (1 - progress)
  const color = progress > 0.5 ? '#6366f1' : progress > 0.25 ? '#f59e0b' : '#ef4444'

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center flex-shrink-0">
      <svg className="absolute" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
        <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" className="timer-circle" style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
      </svg>
      <div className="text-center z-10">
        <p className="text-white font-black text-base leading-none">{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</p>
        <p className="text-slate-500 text-xs">left</p>
      </div>
    </div>
  )
}

const AttemptQuiz = () => {
  const [quizDetails, setQuizDetails] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState({})
  const [remaining, setRemaining] = useState(null)
  const [totalTime, setTotalTime] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [violations, setViolations] = useState(0)

  const { token, user } = useSelector(state => state.auth)
  const { id: quizId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const alreadyAttempted = user?.attemptedQuizzes?.includes(quizId)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [detailsRes, questionsRes] = await Promise.all([
          apiConnector("GET", `${quizEndpoints.GET_QUIZ_DETAILS}/${quizId}`, null, { Authorization: `Bearer ${token}` }),
          apiConnector("GET", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${quizId}`, null, { Authorization: `Bearer ${token}` })
        ])
        setQuizDetails(detailsRes.data.data)
        setQuestions(questionsRes.data.data)
        const t = detailsRes.data.data.timer * 60
        setRemaining(t)
        setTotalTime(t)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [quizId])

  useEffect(() => {
    if (!quizStarted || remaining === null) return
    if (remaining === 0) { submitQuiz(); return }
    const t = setInterval(() => setRemaining(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [quizStarted, remaining])

  // Anti-cheat / Fullscreen Logic
  const handleStartQuiz = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    setQuizStarted(true);
  }

  const exitQuizSafe = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    navigate('/dashboard/explore');
  }

  useEffect(() => {
    if (!quizStarted || submitting) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(v => v + 1);
        if (violations >= 1) {
           toast.error("Quiz auto-submitted due to multiple tab switches.");
           submitQuiz();
        } else {
           toast.error("WARNING: Do not switch tabs or windows. Doing this again will auto-submit your quiz!", { duration: 5000 });
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [quizStarted, submitting, violations])

  const handleAnswer = useCallback((questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }))
  }, [])

  const submitQuiz = async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({ questionId, selectedOption }))
      const response = await apiConnector('POST',
        `${quizEndpoints.ATTEMMP_QUIZ}/${quizId}/attempt`,
        { quizId, answers: answersArray },
        { Authorization: `Bearer ${token}` }
      )
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      dispatch(setUser({ ...user, attemptedQuizzes: [...(user.attemptedQuizzes || []), quizId] }))
      navigate('/quiz-results', { state: { score: response.data.score, total: response.data.total, quizTitle: quizDetails?.title } })
    } catch (e) {
      toast.error(e?.response?.data?.error || 'Failed to submit quiz')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-[90vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl btn-gradient mx-auto flex items-center justify-center animate-pulse">
          <FiClock className="text-white text-2xl" />
        </div>
        <p className="text-slate-400">Loading quiz...</p>
      </div>
    </div>
  )

  if (alreadyAttempted) return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 sm:p-10 text-center max-w-md w-full">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-white mb-2">Already Attempted</h2>
        <p className="text-slate-400 mb-6 text-sm">You've already completed this quiz. Check your results in History.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/')} className="px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm transition-all">Home</button>
          <button onClick={() => navigate('/dashboard/history')} className="btn-gradient px-5 py-2.5 rounded-xl text-white text-sm font-medium">View History</button>
        </div>
      </motion.div>
    </div>
  )

  if (!quizStarted) return (
    <div className="h-[calc(100vh-6rem)] flex items-center justify-center px-4 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-7 sm:p-10 max-w-lg w-full text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/5" />
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl btn-gradient mx-auto flex items-center justify-center text-3xl sm:text-4xl mb-5 glow-purple">
            ⚡
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{quizDetails?.title}</h1>
          <p className="text-slate-400 mb-6 text-sm">{quizDetails?.description}</p>
          
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/8">
              <div className="text-xl sm:text-2xl mb-1">📝</div>
              <p className="text-white font-bold text-xs sm:text-sm truncate">{questions.length}</p>
              <p className="text-slate-500 text-xs">Questions</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/8">
              <div className="text-xl sm:text-2xl mb-1">⏱️</div>
              <p className="text-white font-bold text-xs sm:text-sm truncate">{quizDetails?.timer} min</p>
              <p className="text-slate-500 text-xs">Duration</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2 sm:p-3 border border-white/8">
              <div className="text-xl sm:text-2xl mb-1">👤</div>
              <p className="text-white font-bold text-xs sm:text-sm truncate">{quizDetails?.createdBy?.username || "Admin"}</p>
              <p className="text-slate-500 text-xs">Created by</p>
            </div>
          </div>

          <p className="text-slate-500 text-xs mb-6">
            Created {formatDistanceToNow(new Date(quizDetails?.createdAt || new Date()), { addSuffix: true })}
          </p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleStartQuiz}
            className="btn-gradient px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold text-white text-base sm:text-lg flex items-center gap-3 mx-auto glow-purple">
            <FiPlay /> Start Quiz
          </motion.button>
          <button onClick={exitQuizSafe} className="mt-4 text-slate-500 hover:text-white text-sm transition-colors border-b border-transparent hover:border-white pb-0.5">Cancel & Return</button>
        </div>
      </motion.div>
    </div>
  )

  const q = questions[currentQ]
  const answered = Object.keys(answers).length
  const progress = (answered / questions.length) * 100

  return (
    <div className="min-h-[90vh] py-4 sm:py-6">
      {/* Top bar */}
      <div className="glass rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-center justify-between gap-3 relative">
        {/* Anti-cheat banner if violated */}
        {violations > 0 && (
          <div className="absolute -top-10 left-0 right-0 bg-red-500 text-white text-xs py-1.5 flex justify-center items-center gap-2 rounded-t-xl font-bold animate-pulse">
            <FiAlertTriangle /> WARNING: Tab switching detected. Next violation will auto-submit.
          </div>
        )}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 pr-4">
          <button onClick={exitQuizSafe} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/50 transition-all flex-shrink-0">
            <FiX />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-sm sm:text-lg line-clamp-1">{quizDetails?.title}</h2>
            <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2">
              <div className="flex-1 h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full progress-bar rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
              </div>
              <span className="text-slate-400 text-xs whitespace-nowrap">{answered}/{questions.length}</span>
            </div>
          </div>
        </div>
        <CircularTimer remaining={remaining} total={totalTime} />
      </div>

      {/* Mobile: question nav grid on top */}
      <div className="lg:hidden glass rounded-2xl p-3 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Questions</h4>
          <span className="text-slate-500 text-xs">{answered}/{questions.length} answered</span>
        </div>
        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
          {questions.map((q, i) => (
            <button key={q._id} onClick={() => setCurrentQ(i)}
              className={`aspect-square rounded-lg text-xs font-bold transition-all ${i === currentQ ? 'btn-gradient text-white' : answers[q._id] ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/8'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Question panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div key={currentQ}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="glass rounded-3xl p-5 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <span className="badge text-white">Q {currentQ + 1} of {questions.length}</span>
                {answers[q._id] && <span className="text-green-400 text-xs flex items-center gap-1">✓ Answered</span>}
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white mb-6 sm:mb-8 leading-relaxed">{q.questionText}</h3>
              <div className="space-y-2 sm:space-y-3">
                {q.options.map((opt, i) => (
                  <motion.div key={opt._id} whileTap={{ scale: 0.99 }}
                    onClick={() => handleAnswer(q._id, opt._id)}
                    className={`option-card rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 ${answers[q._id] === opt._id ? 'selected' : ''}`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 transition-all ${answers[q._id] === opt._id ? 'bg-indigo-500 text-white' : 'bg-white/8 text-slate-400'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className="text-slate-200 text-sm sm:text-base">{opt.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 sm:mt-8">
                <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed text-xs sm:text-sm transition-all">
                  <FiChevronLeft /> <span className="hidden sm:inline">Previous</span>
                </button>
                {currentQ < questions.length - 1 ? (
                  <button onClick={() => setCurrentQ(p => p + 1)}
                    className="btn-gradient flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-medium">
                    <span className="hidden sm:inline">Next</span> <FiChevronRight />
                  </button>
                ) : (
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={submitQuiz} disabled={submitting}
                    className="btn-gradient flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold disabled:opacity-60">
                    <FiSend /> {submitting ? 'Submitting...' : 'Submit Quiz'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop: side nav panel */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="glass rounded-2xl p-4 sticky top-4">
            <h4 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Questions</h4>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, i) => (
                <button key={q._id} onClick={() => setCurrentQ(i)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold transition-all ${i === currentQ ? 'btn-gradient text-white' : answers[q._id] ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/8'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-500"><div className="w-3 h-3 rounded bg-green-500/30 border border-green-500/50" /> Answered</div>
              <div className="flex items-center gap-2 text-slate-500"><div className="w-3 h-3 rounded btn-gradient" /> Current</div>
              <div className="flex items-center gap-2 text-slate-500"><div className="w-3 h-3 rounded bg-white/5 border border-white/10" /> Unanswered</div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={submitQuiz} disabled={submitting}
              className="btn-gradient w-full py-2.5 rounded-xl text-white text-sm font-bold mt-4 flex items-center justify-center gap-2 disabled:opacity-60">
              <FiSend /> {submitting ? 'Submitting...' : 'Submit'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttemptQuiz
