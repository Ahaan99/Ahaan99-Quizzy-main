import React, { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../services/operations/AuthAPIs'
import { FiGrid, FiBookOpen, FiCalendar, FiUsers, FiSettings, FiSearch, FiPlus, FiLogOut, FiBarChart2, FiMenu } from 'react-icons/fi'
import { motion } from 'framer-motion'

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
    { to: '/dashboard/quizes', label: 'Quizzes', icon: FiBookOpen },
    { to: '/dashboard/events', label: 'Events', icon: FiCalendar },
    { to: '/dashboard/students', label: 'Students', icon: FiUsers },
  ]
  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid, end: true },
    { to: '/dashboard/explore', label: 'Explore Quizzes', icon: FiSearch },
    { to: '/dashboard/history', label: 'History', icon: FiBarChart2 },
  ]
  
  const links = user?.role === 'admin' ? adminLinks : userLinks

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#0A0A0C] text-gray-300 font-sans overflow-hidden">
      
      {/* Sidebar (hidden on small screens) */}
      <aside className="hidden md:flex w-56 bg-[#16161A] border-r border-[#2A2A35] flex flex-col flex-shrink-0 z-20">
        
        {/* Logo */}
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#A855F7"/>
              <path d="M2 17L12 22L22 17" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">
              Quizzy
            </span>
          </div>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 px-3 space-y-1 mt-4">
          {links.map((link) => (
             <NavLink key={link.to} to={link.to} end={link.end}
               className={({ isActive }) => 
                 `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                   isActive 
                   ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20' 
                   : 'text-[#94A3B8] hover:text-white hover:bg-[#2A2A35]'
                 }`
               }
             >
               <link.icon className="text-[1.1rem]" />
               {link.label}
             </NavLink>
          ))}

          <div className="pt-6 pb-2 px-3">
             <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Manage</p>
          </div>
          
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-[#2A2A35] transition-colors">
             <FiSettings className="text-[1.1rem]" />
             Settings
          </button>
        </nav>

        <div className="p-3 mt-auto border-t border-[#2A2A35]">
           <button onClick={() => logout(dispatch, navigate)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-red-400 hover:bg-red-400/10 transition-colors">
             <FiLogOut className="text-[1.1rem]" />
             Logout
           </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#16161A] border-r border-[#2A2A35] p-4 overflow-auto">
            <div className="h-20 flex items-center px-2">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#A855F7"/>
                  <path d="M2 17L12 22L22 17" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent tracking-tight">Quizzy</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="ml-auto text-gray-400 hover:text-white p-2 rounded-md">
                <FiX />
              </button>
            </div>

            <nav className="mt-4 space-y-1 px-1">
              {links.map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/20' : 'text-[#94A3B8] hover:text-white hover:bg-[#2A2A35]'}`}>
                  <link.icon className="text-[1.1rem]" />
                  {link.label}
                </NavLink>
              ))}

              <div className="pt-6 pb-2 px-3">
                <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">Manage</p>
              </div>

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-white hover:bg-[#2A2A35] transition-colors">
                <FiSettings className="text-[1.1rem]" />
                Settings
              </button>

              <div className="p-3 mt-4 border-t border-[#2A2A35]">
                <button onClick={() => { setMobileOpen(false); logout(dispatch, navigate) }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#94A3B8] hover:text-red-400 hover:bg-red-400/10 transition-colors">
                  <FiLogOut className="text-[1.1rem]" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0F0F13] relative">
         
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-[#2A2A35] bg-[#0F0F13] z-10 flex-shrink-0">
          {/* Mobile hamburger for opening drawer */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden mr-3 p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
            <FiMenu className="text-xl" />
          </button>
          <div className="flex-1 max-w-md">
               <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                  <input type="text" placeholder="Search..." 
                         className="w-full bg-[#1A1A24] border border-[#2A2A35] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] transition-colors" />
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => navigate('/dashboard/create-quiz')} className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                  <FiPlus className="text-lg" />
                  Create Quiz
               </button>
            </div>
         </header>

         {/* Content Wrapper */}
         <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="p-8 pb-20">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                 {children}
              </motion.div>
            </div>
         </div>

      </main>
    </div>
  )
}

export default DashboardLayout
