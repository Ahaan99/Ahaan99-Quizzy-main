import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome, FiTrendingUp } from 'react-icons/fi'
import confetti from 'canvas-confetti'

const QuizResult = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { score = 0, total = 0, quizTitle = 'Quiz' } = location.state || {}
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0

  const getPerformance = () => {
    if (percentage >= 90) return { label: 'Outstanding! 🏆', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-amber-500/10' }
    if (percentage >= 75) return { label: 'Excellent! 🎉', color: 'text-green-400', bg: 'from-green-500/20 to-emerald-500/10' }
    if (percentage >= 60) return { label: 'Good Job! 👍', color: 'text-blue-400', bg: 'from-blue-500/20 to-indigo-500/10' }
    if (percentage >= 40) return { label: 'Keep Practicing 📚', color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/10' }
    return { label: 'Need Improvement 💪', color: 'text-red-400', bg: 'from-red-500/20 to-rose-500/10' }
  }

  const perf = getPerformance()

  useEffect(() => {
    if (percentage >= 60) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'] })
    }
  }, [])

  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - percentage / 100)
  const strokeColor = percentage >= 75 ? '#22c55e' : percentage >= 50 ? '#6366f1' : '#ef4444'

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-purple-600 top-[-10%] left-[-10%]" />
      <div className="orb w-80 h-80 bg-indigo-600 bottom-[-10%] right-[-5%]" style={{ animationDelay: '3s' }} />

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="glass rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${perf.bg} pointer-events-none`} />
          <div className="relative">
            <div className="text-center mb-6 sm:mb-8">
              <span className="badge text-white mb-3 inline-block">Results</span>
              <h1 className="text-xl sm:text-2xl font-black text-white">{quizTitle}</h1>
            </div>

            {/* Score circle */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                <svg className="absolute" width="176" height="176" viewBox="0 0 176 176">
                  <circle cx="88" cy="88" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <motion.circle cx="88" cy="88" r={radius} fill="none" stroke={strokeColor} strokeWidth="10"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    strokeLinecap="round" className="timer-circle" />
                </svg>
                <div className="text-center z-10">
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-4xl sm:text-5xl font-black text-white">{percentage}%</motion.p>
                  <p className="text-slate-400 text-sm mt-1">{score} / {total}</p>
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="text-center mb-6 sm:mb-8">
              <p className={`text-xl sm:text-2xl font-bold ${perf.color}`}>{perf.label}</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
              {[
                { label: 'Correct', value: score, icon: '✅', color: 'text-green-400' },
                { label: 'Wrong', value: total - score, icon: '❌', color: 'text-red-400' },
                { label: 'Score', value: `${percentage}%`, icon: '🎯', color: 'text-indigo-400' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="bg-white/5 rounded-xl p-2 sm:p-3 text-center border border-white/8">
                  <div className="text-lg sm:text-xl mb-1">{icon}</div>
                  <p className={`text-lg sm:text-xl font-black ${color}`}>{value}</p>
                  <p className="text-slate-500 text-xs">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard/explore')}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm transition-all">
                <FiHome /> Home
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard/history')}
                className="flex-1 btn-gradient flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl text-white text-sm font-medium">
                <FiTrendingUp /> History
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default QuizResult
