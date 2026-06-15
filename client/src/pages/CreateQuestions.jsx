import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiConnector'
import { questionEndpoints } from '../services/APIs'
import CreateQuestionModal from '../components/core/createQuiz/CreateQuestionModal'
import { deleteQuestion } from '../services/operations/questionAPIs'
import { setQuiz, setEdit } from '../slices/QuizSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { FiPlus, FiCheckCircle, FiTrash2, FiFlag } from 'react-icons/fi'
import toast from 'react-hot-toast'

const QuestionCard = ({ question, index, onDelete }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
    className="glass rounded-2xl p-5 border border-white/8 group card-hover">
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="flex items-start gap-3 flex-1">
        <span className="badge text-white flex-shrink-0 mt-0.5">Q{index + 1}</span>
        <h4 className="text-white font-semibold leading-relaxed">{question.questionText}</h4>
      </div>
      <button onClick={() => onDelete(question)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400">
        <FiTrash2 className="text-sm" />
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {question.options.map((opt, i) => (
        <div key={opt._id}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border ${opt.isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-white/4 border-white/8 text-slate-400'}`}>
          <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${opt.isCorrect ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-500'}`}>
            {String.fromCharCode(65 + i)}
          </span>
          {opt.text}
          {opt.isCorrect && <FiCheckCircle className="ml-auto text-green-400 text-xs" />}
        </div>
      ))}
    </div>
  </motion.div>
)

const CreateQuestions = () => {
  const { quiz, edit } = useSelector(state => state.quiz)
  const { token } = useSelector(state => state.auth)
  const [questions, setQuestions] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()

  useEffect(() => {
    if (!quiz) navigate("/dashboard/create-quiz")
  }, [])

  useEffect(() => {
    if (edit) {
      setLoading(true)
      apiConnector("GET", `${questionEndpoints.GET_QUIZ_QUESTIONS}/${id}`, null, { Authorization: `Bearer ${token}` })
        .then(r => setQuestions(r?.data?.data || []))
        .catch(() => toast.error("Failed to load questions"))
        .finally(() => setLoading(false))
    }
  }, [quiz, edit, id])

  const handleDelete = async (question) => {
    const ok = await deleteQuestion(question._id, token)
    if (ok) setQuestions(prev => prev.filter(q => q._id !== question._id))
  }

  const handleFinish = () => {
    navigate("/dashboard/quizes")
    dispatch(setQuiz(null))
    dispatch(setEdit(false))
  }

  return (
    <>
      <div className="py-6 min-h-[80vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

          {/* Header */}
          <div className="glass rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="badge text-white mb-2 inline-block">Step 2</span>
                <h1 className="text-2xl font-black text-white">{quiz?.title}</h1>
                <p className="text-slate-400 text-sm mt-1">{quiz?.description || 'Add questions to your quiz'}</p>
              </div>
              <div className="flex gap-3">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(true)}
                  className="btn-gradient px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2">
                  <FiPlus /> Add Question
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleFinish}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm transition-all">
                  <FiFlag /> Finish
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-3">
            <div className="stat-card px-4 py-3 flex items-center gap-3">
              <FiCheckCircle className="text-indigo-400" />
              <div>
                <p className="text-white font-bold">{questions.length}</p>
                <p className="text-slate-500 text-xs">Questions</p>
              </div>
            </div>
          </div>

          {/* Questions */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 border border-white/8">
                  <div className="shimmer h-5 w-3/4 rounded mb-3" />
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, j) => <div key={j} className="shimmer h-9 rounded-xl" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="glass rounded-3xl p-16 flex flex-col items-center gap-4">
              <div className="text-6xl">📝</div>
              <p className="text-slate-400 text-lg font-medium">No questions yet</p>
              <p className="text-slate-600 text-sm">Click "Add Question" to get started</p>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowModal(true)}
                className="btn-gradient px-6 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2 mt-2">
                <FiPlus /> Add First Question
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, i) => <QuestionCard key={q._id} question={q} index={i} onDelete={handleDelete} />)}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {showModal && (
          <CreateQuestionModal
            quiz={quiz}
            setCreateQuestionModalData={setShowModal}
            setQuestions={setQuestions}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default CreateQuestions
