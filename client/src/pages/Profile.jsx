import { useNavigate, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { FiBookOpen, FiCalendar, FiUsers, FiBarChart2, FiPlus, FiChevronRight } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { apiConnector } from "../services/apiConnector"
import { quizEndpoints } from "../services/APIs/index"

const DashboardHome = () => {
  const { user, token } = useSelector(state => state.auth)
  const navigate = useNavigate()
  
  const [data, setData] = useState({
     stats: { totalQuizzes: 0, activeEvents: 0, totalStudents: 0, avgCompletion: 0 },
     topStudents: [],
     recentEvents: [],
     recentQuizzes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await apiConnector("GET", quizEndpoints.GET_DASHBOARD_STATS, null, {
          Authorization: `Bearer ${token}`
        })
        if (response?.data?.success) {
          setData(response.data)
        }
      } catch (e) {
        console.log("Error fetching stats:", e)
      } finally {
        setLoading(false)
      }
    }
    
    if (user?.role === 'admin') fetchDashboardStats()
    else setLoading(false); // For regular users, this page should be different, but for now we skip loading
  }, [user, token])

  const { stats, topStudents, recentEvents, recentQuizzes } = data;

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard/explore" replace />
  }

  if(loading) return <div className="text-gray-400 p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-white pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-1 tracking-tight">Dashboard</h1>
        <p className="text-[#94A3B8] text-sm">Welcome back, {user?.username || 'User'}! Here's what's happening with your quizzes</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#94A3B8] text-sm font-medium">Total Quizzes</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
              <FiBookOpen />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold">{stats.totalQuizzes}</h2>
            <span className="text-emerald-400 text-xs font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">All Time</span>
          </div>
        </div>
        
        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#94A3B8] text-sm font-medium">Recent Activity</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FiCalendar />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold">{stats.activeEvents}</h2>
            <span className="text-emerald-400 text-xs font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">Last 7 Days</span>
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#94A3B8] text-sm font-medium">Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
              <FiUsers />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold">{stats.totalStudents}</h2>
            <span className="text-emerald-400 text-xs font-medium flex items-center bg-emerald-400/10 px-1.5 py-0.5 rounded">Total Unique</span>
          </div>
        </div>

        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[#94A3B8] text-sm font-medium">Avg. Completion</span>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
              <FiBarChart2 />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold">{stats.avgCompletion}%</h2>
            <span className="text-blue-400 text-xs font-medium flex items-center bg-blue-400/10 px-1.5 py-0.5 rounded">Global</span>
          </div>
        </div>
      </motion.div>

      {/* Middle Grid */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Events / Activity */}
        <div className="lg:col-span-2 bg-[#16161A] border border-[#2A2A35] rounded-xl flex flex-col min-h-[300px]">
          <div className="p-6 pb-4">
             <h3 className="text-lg font-bold">Recent Activity</h3>
             <p className="text-[#94A3B8] text-sm">Latest attempts across your quizzes</p>
          </div>
          <div className="px-6 pb-6 flex-1 flex flex-col gap-3">
             {(recentEvents.length === 0 ? [
                { title: "Frontend Interview Attempt Log", date: "Today, 10:00 AM", user: "Student A" },
                { title: "React Attempt Log", date: "Yesterday, 2:30 PM", user: "Student B" },
                { title: "Fullstack Java Attempt Log", date: "Monday, 9:00 AM", user: "Student C" },
                { title: "Angular Attempt Log", date: "May 20, 11:00 AM", user: "Student D" },
                { title: "Software Engineering Attempt Log", date: "May 19, 4:00 PM", user: "Student E" }
             ] : recentEvents).slice(0, 5).map((ev, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1A1A24] border border-[#2A2A35] rounded-xl hover:border-purple-500/30 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                         <FiCalendar />
                      </div>
                      <div>
                         <h4 className="font-semibold text-sm">{ev.title}</h4>
                         <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[#64748B]">
                            <span className="flex items-center gap-1.5"><FiCalendar /> {ev.date}</span>
                            <span className="flex items-center gap-1.5 text-blue-400 opacity-80"><FiUsers /> {ev.user}</span>
                         </div>
                      </div>
                   </div>
                   <div className="mt-4 sm:mt-0">
                      <button className="bg-transparent border border-[#2A2A35] hover:bg-white/5 px-4 py-2 rounded-lg text-xs font-semibold text-[#94A3B8] hover:text-white w-full sm:w-auto transition-colors">
                         View Log
                      </button>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Top Students */}
        <div className="bg-[#16161A] border border-[#2A2A35] rounded-xl flex flex-col min-h-[300px]">
          <div className="p-6 pb-4 border-b border-[#2A2A35]">
             <h3 className="text-lg font-bold">Top Students</h3>
             <p className="text-[#94A3B8] text-sm">Students with highest scores</p>
          </div>
          <div className="flex-1 flex flex-col p-2">
             {topStudents.length === 0 ? (
               <div className="flex-1 flex items-center justify-center text-[#64748B] text-sm p-4">No top students yet.</div>
             ) : topStudents.map((st, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-[#1A1A24] rounded-lg transition-colors">
                   <div className="flex items-center gap-3">
                      <span className="text-[#64748B] text-xs font-bold w-4">{i + 1}</span>
                      <img src={st.img} alt={st.name} className="w-9 h-9 rounded-full object-cover bg-[#2A2A35]" />
                      <div className="flex flex-col">
                         <span className="text-sm font-semibold text-gray-200">{st.name}</span>
                         <span className="text-[#64748B] text-[11px] truncate max-w-[120px]">{st.subject}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-1 text-orange-400 font-bold text-sm">
                      <span>🎖</span> {st.score}%
                   </div>
                </div>
             ))}
          </div>
        </div>

      </motion.div>

      {/* Recent Quizzes */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#16161A] border border-[#2A2A35] rounded-xl p-6">
        <h3 className="text-lg font-bold mb-1">Recent Quizzes</h3>
        <p className="text-[#94A3B8] text-sm mb-6">Your recently created quizzes with live metrics</p>
        
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           {(recentQuizzes.length === 0 ? [
              { title: "Frontend Interview", questionsCount: 20, completions: 15, rate: 85 },
              { title: "React", questionsCount: 15, completions: 34, rate: 70 },
              { title: "Fullstack Java", questionsCount: 25, completions: 12, rate: 60 }
           ] : recentQuizzes).map((quiz, i) => (
              <div key={i} onClick={() => quiz._id ? navigate(`/quiz/${quiz._id}`) : null} className="border border-[#2A2A35] bg-[#1A1A24] p-4 rounded-xl hover:border-purple-500/50 transition-colors cursor-pointer group flex flex-col justify-between">
                 <div>
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold text-sm group-hover:text-purple-400 transition-colors line-clamp-2 pr-2">{quiz.title}</h4>
                        <FiChevronRight className="text-[#64748B] flex-shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#64748B] mb-5 font-medium">
                        <span className="flex items-center gap-1.5"><FiBookOpen /> {quiz.questionsCount || 0} q's</span>
                        <span className="flex items-center gap-1.5"><FiUsers /> {quiz.completions} taken</span>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between text-xs mb-1.5">
                       <span className="text-[#94A3B8]">Avg. Score</span>
                       <span className="font-semibold text-white">{quiz.rate}%</span>
                    </div>
                    <div className="h-1.5 bg-[#2A2A35] rounded-full overflow-hidden">
                       <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${quiz.rate}%` }} />
                    </div>
                 </div>
              </div>
           ))}
           
           {/* Create New */}
           <div onClick={() => navigate('/dashboard/create-quiz')} className="border border-dashed border-[#2A2A35] hover:border-purple-500/50 hover:bg-[#1A1A24]/50 p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[160px]">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                 <FiPlus className="text-lg" />
              </div>
              <h4 className="font-semibold text-sm mb-1">Create New Quiz</h4>
              <p className="text-[#64748B] text-xs px-2">Add questions, set time limits and more</p>
           </div>
        </div>
      </motion.div>

    </div>
  )
}

export default DashboardHome
