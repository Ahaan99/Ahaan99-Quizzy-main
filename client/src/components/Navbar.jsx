import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiZap, FiHome, FiGrid, FiLogOut, FiMenu, FiX } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../services/operations/AuthAPIs'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const [open, setOpen] = useState(false)

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${isActive ? 'nav-active border-indigo-500/50' : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'}`

  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center flex-shrink-0">
            <FiZap className="text-white text-sm" />
          </div>
          <span className="text-xl font-black gradient-text">Quizzy</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink to="/home" className={navLinkClass}><FiHome className="text-xs" /> Home</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}><FiGrid className="text-xs" /> Dashboard</NavLink>
          {user && (
            <button onClick={() => logout(dispatch, navigate)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 border border-transparent">
              <FiLogOut className="text-xs" /> Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(p => !p)}
          className="sm:hidden p-2 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="sm:hidden mt-3 glass rounded-2xl p-3 flex flex-col gap-1 overflow-hidden">
            <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass}>
              <FiHome /> Home
            </NavLink>
            <NavLink to="/dashboard" onClick={() => setOpen(false)} className={navLinkClass}>
              <FiGrid /> Dashboard
            </NavLink>
            {user && (
              <button onClick={() => { setOpen(false); logout(dispatch, navigate) }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent">
                <FiLogOut /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
