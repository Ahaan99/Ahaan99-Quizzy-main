import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { apiConnector } from "../services/apiConnector"
import { quizEndpoints } from "../services/APIs/index"
import { motion } from 'framer-motion'
import { FiClock, FiUser, FiCheckCircle, FiZap, FiSearch } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { Link } from 'react-router-dom'

const QuizCard = ({ quiz, index, attempted }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    whileHover={{ y: -4 }}
  >
    <Link to={`/quiz/${quiz._id}`}
      className="block glass rounded-2xl p-5 card-hover border border-white/8 relative overflow-hidden group">
      {/* Gradient accent top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {attempted && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1 bg-green-500/20 text-green-400 text-xs px-2.5 py-1 rounded-full border border-green-500/30 font-medium">
            <FiCheckCircle className="text-xs" /> Completed
          </span>
        </div>
      )}

      <div className="mb-3">
        <span className="badge text-white">Quiz</span>
      </div>

      <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
        {quiz.title}
      </h2>
      <p className="text-slate-400 text-sm line-clamp-2 mb-4">{quiz.description || 'No description provided'}</p>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <FiUser className="text-indigo-400" />
          <span className="text-slate-400">{quiz.createdBy?.username}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <FiClock className="text-purple-400" />
          <span className="text-slate-400">{quiz.timer} min</span>
        </span>
        <span className="text-slate-500">{formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}</span>
      </div>
    </Link>
  </motion.div>
)

const SkeletonCard = () => (
  <div className="glass rounded-2xl p-5 border border-white/8">
    <div className="shimmer h-4 w-16 rounded-full mb-3" />
    <div className="shimmer h-6 w-3/4 rounded-lg mb-2" />
    <div className="shimmer h-4 w-full rounded-lg mb-1" />
    <div className="shimmer h-4 w-2/3 rounded-lg mb-4" />
    <div className="flex justify-between">
      <div className="shimmer h-3 w-20 rounded" />
      <div className="shimmer h-3 w-16 rounded" />
    </div>
  </div>
)

const Home = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { token, user } = useSelector(state => state.auth)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await apiConnector("GET", quizEndpoints.GET_ALL_QUIZES, null, {
          Authorization: `Bearer ${token}`
        })
        if (response.data.success) setQuizzes(response.data.data)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  const filtered = quizzes.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    (q.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section className="min-h-[90vh] py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">
              Available <span className="gradient-text">Quizzes</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {loading ? 'Loading...' : `${quizzes.length} quizzes available`}
            </p>
          </div>
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="input-glass rounded-xl py-2.5 pl-9 pr-4 text-sm w-full md:w-64"
            />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mt-5 flex-wrap">
          {[
            { label: 'Total Quizzes', value: quizzes.length, icon: FiZap, color: 'text-indigo-400' },
            { label: 'Completed', value: user?.attemptedQuizzes?.length || 0, icon: FiCheckCircle, color: 'text-green-400' },
            { label: 'Remaining', value: Math.max(0, quizzes.length - (user?.attemptedQuizzes?.length || 0)), icon: FiClock, color: 'text-purple-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card px-4 py-3 flex items-center gap-3">
              <Icon className={`${color} text-lg`} />
              <div>
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((quiz, i) => (
            <QuizCard
              key={quiz._id}
              quiz={quiz}
              index={i}
              attempted={user?.attemptedQuizzes?.includes(quiz._id)}
            />
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="w-20 h-20 rounded-full glass flex items-center justify-center text-4xl">🔍</div>
          <p className="text-slate-400 text-lg">No quizzes found</p>
        </motion.div>
      )}
    </section>
  )
}

export default Home
