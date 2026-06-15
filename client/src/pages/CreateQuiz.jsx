import { useDispatch, useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createQuiz, updateQuiz } from '../services/operations/QuizAPIs'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { setEdit, setQuiz } from '../slices/QuizSlice'
import { FiFileText, FiClock, FiAlignLeft, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

const CreateQuiz = () => {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm()
  const { token } = useSelector(state => state.auth)
  const { edit, quiz } = useSelector(state => state.quiz)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id: quizId } = useParams()

  useEffect(() => {
    if (edit && quiz) {
      setValue("title", quiz.title)
      setValue("description", quiz.description)
      setValue("timer", quiz.timer)
    }
    if (location.pathname === "/dashboard/create-quiz" && edit) {
      dispatch(setEdit(false))
      dispatch(setQuiz(null))
      reset()
    }
  }, [edit, quiz, location.pathname])

  const submitHandler = async (data) => {
    setLoading(true)
    try {
      data.timer = Number(data.timer)
      if (edit) {
        const response = await updateQuiz(data, token, quizId)
        if (response) navigate("/dashboard/create-quiz/" + response._id)
        return
      }
      const response = await createQuiz(data, token)
      if (response) {
        dispatch(setQuiz(response))
        navigate("/dashboard/create-quiz/" + response._id)
        toast.success("Quiz created!")
      }
    } catch (e) {
      toast.error("Failed to save quiz")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "input-glass w-full rounded-xl py-3 pl-11 pr-4 text-sm"

  return (
    <div className="min-h-[70vh] flex justify-center flex-col items-center gap-8 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white">{edit ? 'Edit' : 'Create'} <span className="gradient-text">Quiz</span></h1>
          <p className="text-slate-400 text-sm mt-2">{edit ? 'Update your quiz details' : 'Set up a new quiz for your students'}</p>
        </div>

        <div className="glass rounded-3xl p-8 glow-purple relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          <form onSubmit={handleSubmit(submitHandler)} className="relative space-y-5">
            {/* Title */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Quiz Title</label>
              <div className="relative">
                <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="e.g. JavaScript Fundamentals" className={inputClass}
                  {...register("title", { required: "Title is required" })} />
              </div>
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Description <span className="text-slate-600">(optional)</span></label>
              <div className="relative">
                <FiAlignLeft className="absolute left-4 top-4 text-slate-400" />
                <textarea rows={3} placeholder="Brief description of this quiz..."
                  className="input-glass w-full rounded-xl py-3 pl-11 pr-4 text-sm resize-none"
                  {...register("description")} />
              </div>
            </div>

            {/* Timer */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Duration (minutes)</label>
              <div className="relative">
                <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="number" placeholder="10" min={1} max={180} className={inputClass}
                  {...register("timer", { required: "Duration is required" })} />
              </div>
              {errors.timer && <p className="text-red-400 text-xs mt-1">{errors.timer.message}</p>}
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={loading} type="submit"
              className="btn-gradient w-full py-3 rounded-xl font-semibold text-white text-sm disabled:opacity-60 flex items-center justify-center gap-2">
              <span>{loading ? 'Saving...' : edit ? 'Update Quiz' : 'Create Quiz'}</span>
              {!loading && <FiArrowRight />}
            </motion.button>

            {edit && (
              <button type="button" onClick={() => navigate("/dashboard/create-quiz/" + quiz._id)}
                className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all flex items-center justify-center gap-2">
                Skip to Questions <FiArrowRight />
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateQuiz
