import { useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { apiConnector } from "../services/apiConnector"
import { quizEndpoints } from '../services/APIs'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { FiClock, FiAward, FiRefreshCw, FiInbox } from 'react-icons/fi'

const AttemptCard = ({ item, index }) => {
  const navigate = useNavigate()
  // Ensure we don't divide by zero and use fallbacks if answers array is missing
  const total = item?.answers?.length || item?.totalQuestions || (item?.score ? Math.max(item.score, 5) : 5);
  const score = item?.score || 0
  const pct = total > 0 ? Math.round((score / total) * 100) : 0
  const color = pct >= 75 ? 'text-green-400' : pct >= 50 ? 'text-indigo-400' : 'text-red-400'
  const bg = pct >= 75 ? 'from-green-500/10' : pct >= 50 ? 'from-indigo-500/10' : 'from-red-500/10'

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}
      className={`glass rounded-2xl p-5 border border-white/8 card-hover relative overflow-hidden`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bg} to-transparent pointer-events-none`} />
      <div className="relative">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="text-white font-bold line-clamp-1">{item?.quizId?.title || "Untitled Quiz"}</h3>
            <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{item?.quizId?.description || "No description provided."}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`text-2xl font-black ${color}`}>{pct}%</p>
            <p className="text-slate-500 text-xs">{score}/{total}</p>
          </div>
        </div>

        <div className="h-1.5 bg-white/8 rounded-full overflow-hidden mb-4">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: index * 0.07 + 0.3 }}
            className="h-full progress-bar rounded-full" />
        </div>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-slate-500 text-xs">
            <FiClock className="text-xs" />
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </span>
          <button onClick={() => navigate(`/quiz/${item?.quizId?._id}`)}
            className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors">
            <FiRefreshCw className="text-xs" /> Retry
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const History = () => {
  const [loading, setLoading] = useState(true)
  const [attempts, setAttempts] = useState([])
  const { token } = useSelector(state => state.auth)

  useEffect(() => {
    const fetchUserAttempts = async () => {
      try {
        const response = await apiConnector("GET", quizEndpoints.GET_USER_ATTEMPS, null, { Authorization: `Bearer ${token}` })
        if (!response.data.success) throw new Error(response.data.error)
        setAttempts(response.data.data)
      } catch (e) {
        toast.error("Failed to load attempts")
      } finally {
        setLoading(false)
      }
    }
    fetchUserAttempts()
  }, [])

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((acc, a) => {
        const totalQs = a.answers?.length || a.totalQuestions || a.score || 1; // Fallback to avoid Infinity
        return acc + (a.score / totalQs) * 100;
      }, 0) / attempts.length)
    : 0

  return (
    <section className="py-4 min-h-[calc(100vh-10rem)]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

        {/* Header */}
        <div className="glass rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Attempt <span className="gradient-text">History</span></h1>
              <p className="text-slate-400 text-sm mt-1">Track your learning progress</p>
            </div>
            {!loading && attempts.length > 0 && (
              <div className="flex gap-4">
                {[
                  { label: 'Total Attempts', value: attempts.length, icon: FiAward },
                  { label: 'Avg Score', value: `${avgScore}%`, icon: FiClock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="stat-card px-4 py-3 flex items-center gap-3">
                    <Icon className="text-indigo-400" />
                    <div>
                      <p className="text-white font-bold">{value}</p>
                      <p className="text-slate-500 text-xs">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 border border-white/8">
                <div className="shimmer h-5 w-3/4 rounded mb-2" />
                <div className="shimmer h-3 w-1/2 rounded mb-4" />
                <div className="shimmer h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : attempts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attempts.map((item, i) => <AttemptCard key={item._id} item={item} index={i} />)}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass rounded-3xl p-16 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center">
              <FiInbox className="text-slate-400 text-3xl" />
            </div>
            <p className="text-slate-400 text-lg font-medium">No attempts yet</p>
            <p className="text-slate-600 text-sm">Start a quiz to see your history here</p>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}

export default History
