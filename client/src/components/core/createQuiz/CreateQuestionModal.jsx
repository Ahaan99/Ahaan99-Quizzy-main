import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { createQuestion } from '../../../services/operations/questionAPIs'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FiPlus, FiX, FiCheckCircle } from 'react-icons/fi'
import toast from 'react-hot-toast'

const CreateQuestionModal = ({ quiz, setQuestions, setCreateQuestionModalData }) => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentOption, setCurrentOption] = useState('')
  const [isCorrect, setIsCorrect] = useState(false)
  const [optionError, setOptionError] = useState('')
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const { token } = useSelector(state => state.auth)

  const addOption = () => {
    if (!currentOption.trim()) { setOptionError('Option text cannot be empty'); return }
    if (isCorrect && options.some(o => o.isCorrect)) { toast.error('Only one correct option allowed'); return }
    setOptions(prev => [...prev, { text: currentOption.trim(), isCorrect }])
    if (isCorrect) setOptionError('')
    setCurrentOption('')
    setIsCorrect(false)
  }

  const submitHandler = async (data) => {
    if (options.length < 2) { setOptionError('Add at least 2 options'); return }
    if (!options.some(o => o.isCorrect)) { setOptionError('Mark one option as correct'); return }
    setLoading(true)
    try {
      const response = await createQuestion({ ...data, options, quizId: quiz._id }, token)
      if (response) {
        setQuestions(prev => [...prev, response])
        setCreateQuestionModalData(false)
        toast.success('Question added!')
      }
    } catch (e) {
      toast.error('Failed to create question')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && setCreateQuestionModalData(false)}
    >
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="glass rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto glow-purple">

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-white">Add Question</h3>
          <button onClick={() => setCreateQuestionModalData(false)}
            className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all">
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">
          {/* Question text */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">Question</label>
            <textarea rows={3} placeholder="Enter your question here..."
              className="input-glass w-full rounded-xl py-3 px-4 text-sm resize-none"
              {...register("questionText", { required: "Question is required" })} />
            {errors.questionText && <p className="text-red-400 text-xs mt-1">{errors.questionText.message}</p>}
          </div>

          {/* Add option */}
          <div>
            <label className="text-slate-300 text-sm font-medium mb-2 block">Options ({options.length}/4)</label>
            <div className="flex gap-2 mb-2">
              <input value={currentOption} onChange={e => setCurrentOption(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addOption())}
                placeholder="Type an option..."
                className="input-glass flex-1 rounded-xl py-2.5 px-4 text-sm" />
              <button type="button" onClick={addOption}
                className="btn-gradient px-4 py-2.5 rounded-xl text-white text-sm flex items-center gap-1 flex-shrink-0">
                <span><FiPlus /></span>
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-400 hover:text-white transition-colors">
              <div onClick={() => setIsCorrect(p => !p)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isCorrect ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                {isCorrect && <FiCheckCircle className="text-white text-xs" />}
              </div>
              Mark as correct answer
            </label>
          </div>

          {/* Options list */}
          {options.length > 0 && (
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm ${opt.isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-white/4 border-white/8 text-slate-300'}`}>
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${opt.isCorrect ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-500'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt.text}</span>
                  {opt.isCorrect && <span className="text-green-400 text-xs">✓ Correct</span>}
                  <button type="button" onClick={() => setOptions(prev => prev.filter((_, j) => j !== i))}
                    className="text-slate-600 hover:text-red-400 transition-colors ml-auto">
                    <FiX className="text-xs" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {optionError && <p className="text-red-400 text-xs">{optionError}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setCreateQuestionModalData(false)}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 text-sm transition-all">
              Cancel
            </button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="flex-1 btn-gradient py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-60">
              <span>{loading ? 'Adding...' : 'Add Question'}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default CreateQuestionModal
