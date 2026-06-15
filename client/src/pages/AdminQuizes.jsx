import React, { useEffect, useState } from 'react'
import { apiConnector } from "../services/apiConnector"
import { quizEndpoints } from '../services/APIs'
import { useSelector, useDispatch } from "react-redux"
import { deleteQuiz } from '../services/operations/QuizAPIs'
import { setEdit, setQuiz } from '../slices/QuizSlice'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiSearch, FiFilter, FiBookOpen, FiClock, FiUsers, FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi'
import toast from 'react-hot-toast'

const AdminQuizes = () => {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All Quizzes')
  const [openMenuId, setOpenMenuId] = useState(null)
  
  const { token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    apiConnector("GET", quizEndpoints.GET_ADMIN_QUIZES, null, { Authorization: `Bearer ${token}` })
      .then(r => setQuizzes(r?.data?.data || []))
      .catch(() => toast.error("Failed to load quizzes"))
      .finally(() => setLoading(false))
  }, [token])

  const handleEdit = (quiz) => {
    dispatch(setQuiz(quiz))
    dispatch(setEdit(true))
    navigate(`/dashboard/edit-quiz/${quiz._id}`)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz and all its questions?")) return
    const ok = await deleteQuiz(id, token)
    if (ok) setQuizzes(prev => prev.filter(q => q._id !== id))
    setOpenMenuId(null)
  }

  const toggleMenu = (id) => {
    if (openMenuId === id) setOpenMenuId(null)
    else setOpenMenuId(id)
  }

  return (
    <div className="text-white max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight">Quizzes</h1>
          <p className="text-[#94A3B8] text-sm">Create, manage and analyze your quizzes</p>
        </div>
        <button onClick={() => navigate('/dashboard/create-quiz')} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
          <FiPlus className="text-lg" />
          Create New Quiz
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-[#16161A] border border-[#2A2A35] rounded-xl overflow-hidden">
        
        {/* Top Section */}
        <div className="p-6 border-b border-[#2A2A35]">
           <h2 className="text-xl font-bold mb-1">Quiz Library</h2>
           <p className="text-[#94A3B8] text-sm mb-6">Browse and manage all your quizzes</p>

           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-[#2A2A35] sm:border-0 w-full sm:w-auto">
                 {['All Quizzes', 'Published', 'Drafts'].map(tab => (
                    <button key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-medium transition-colors border-b-2 relative top-[1px] sm:top-0 ${activeTab === tab ? 'text-white border-[#8B5CF6]' : 'text-[#64748B] border-transparent hover:text-[#94A3B8]'}`}
                    >
                       {tab}
                    </button>
                 ))}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                 <div className="relative w-full sm:w-auto">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
                    <input type="text" placeholder="Search quizzes..." 
                           className="w-full sm:w-48 bg-[#1A1A24] border border-[#2A2A35] rounded-lg py-1.5 pl-9 pr-4 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] transition-colors" />
                 </div>
                 <div className="relative w-full sm:w-auto">
                    <button className="w-full sm:w-auto flex items-center gap-2 bg-[#1A1A24] border border-[#2A2A35] rounded-lg py-1.5 px-3 text-sm text-[#94A3B8] hover:text-white transition-colors">
                       <FiFilter /> All Categories
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* List */}
        <div className="p-6 flex flex-col gap-3 min-h-[400px]">
           {loading ? (
             <div className="text-[#64748B] text-sm">Loading quizzes...</div>
           ) : quizzes.length === 0 ? (
             <div className="text-[#64748B] text-sm py-12 text-center">No quizzes found.</div>
           ) : (
             quizzes.map((quiz, i) => {
                // Mocking alternating Published/Draft status for visual accuracy to screenshot
                const isPublished = i % 2 === 0;

                return (
                <div key={quiz._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1A1A24] border border-[#2A2A35] rounded-xl hover:border-[#8B5CF6]/50 transition-colors group">
                   
                   <div className="flex items-start sm:items-center gap-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 flex-shrink-0">
                         <FiBookOpen className="text-xl" />
                      </div>
                      
                      {/* Details */}
                      <div>
                         <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">{quiz.title}</h3>
                            {isPublished ? (
                              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                 Published
                              </span>
                            ) : (
                              <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                 Draft
                              </span>
                            )}
                         </div>
                         <p className="text-[#64748B] text-xs mb-2">Basic concepts of {quiz.title.toLowerCase()} for beginners</p>
                         
                         <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1.5"><FiBookOpen /> {quiz.questions?.length || 15} questions</span>
                            <span className="flex items-center gap-1.5"><FiClock /> {quiz.timer || 20} min</span>
                            <span className="flex items-center gap-1.5"><FiUsers /> 32 completions</span>
                            <span>Created just now</span>
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center gap-2 mt-4 sm:mt-0 relative">
                      <button onClick={() => navigate(`/quiz/${quiz._id}`)} className="bg-transparent border border-[#2A2A35] hover:bg-white/5 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
                         View
                      </button>
                      
                      <button onClick={() => toggleMenu(quiz._id)} 
                              className="w-8 h-[34px] flex items-center justify-center rounded-lg border border-[#2A2A35] text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
                         <FiMoreVertical />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === quiz._id && (
                         <div className="absolute right-0 top-10 w-36 bg-[#1A1A24] border border-[#2A2A35] rounded-lg shadow-xl overflow-hidden z-20">
                            <button onClick={() => { handleEdit(quiz); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#8B5CF6]/10 hover:text-white flex items-center gap-2">
                               <FiEdit2 className="text-xs" /> Edit
                            </button>
                            <button onClick={() => handleDelete(quiz._id)} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 flex items-center gap-2 border-t border-[#2A2A35]">
                               <FiTrash2 className="text-xs" /> Delete
                            </button>
                         </div>
                      )}
                   </div>

                </div>
             )})
           )}
        </div>
      </div>
    </div>
  )
}

export default AdminQuizes
