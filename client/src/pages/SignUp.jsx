import toast from 'react-hot-toast'
import { useNavigate, Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { signUp } from '../services/operations/AuthAPIs'
import { TbEyeClosed, TbEyeCheck } from "react-icons/tb"
import { FiMail, FiLock, FiUser } from "react-icons/fi"
import { FaGraduationCap, FaChalkboardTeacher, FaFacebook } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { motion } from 'framer-motion'
import { theme, getClasses } from '../styles/theme'

const SignUp = () => {
  const [hidePassword, setHidePassword] = useState({ password: true, confirmPassword: true })
  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, setValue } = useForm()
  const navigate = useNavigate()

  useEffect(() => { setValue("role", "user") }, [setValue])

  const submitHandler = async (data) => {
    const authData = { ...data, confirmPassword: data.password }
    
    setLoading(true)
    const toastId = toast.loading("Creating account...")
    try {
      const response = await signUp(authData)
      if (response) navigate("/login")
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
      toast.dismiss(toastId)
    }
  }

  return (
    <div className={`h-screen flex overflow-hidden ${theme.colors.background.main} font-sans ${theme.colors.text.primary}`}>
      
      {/* Left Panel - Dark Grid */}
      <div className={`hidden lg:flex lg:w-1/2 ${theme.colors.background.panel} relative items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `linear-gradient(rgba(155,81,224,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(155,81,224,0.5) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }} 
        />
        <div className="relative z-10 flex items-center gap-4">
          <h1 className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Quizzy
          </h1>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto h-full scrollbar-hide">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md my-auto py-8"
        >
          <div className="mb-8">
            <h2 className={theme.typography.heading}>Create Account</h2>
            <p className={`${theme.colors.text.muted} ${theme.typography.subheading}`}>Choose your account type and start your journey with us</p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button" 
                onClick={() => { setRole("user"); setValue("role", "user") }}
                className={`${theme.components.roleCard} ${
                  role === 'user' 
                  ? `${theme.colors.background.input} ${theme.colors.border.active}` 
                  : `${theme.colors.background.input} ${theme.colors.border.default} ${theme.colors.border.hover}`
                }`}
              >
                <FaGraduationCap className={`text-2xl mb-2 ${role === 'user' ? theme.colors.text.accent : theme.colors.text.muted}`} />
                <span className={`font-semibold text-sm mb-1 ${role === 'user' ? theme.colors.text.primary : theme.colors.text.secondary}`}>Student</span>
                <span className={`text-[10px] ${theme.colors.text.muted} text-center px-2 leading-tight`}>
                  Take quizzes and track your progress
                </span>
              </button>

              <button 
                type="button" 
                onClick={() => { setRole("admin"); setValue("role", "admin") }}
                className={`${theme.components.roleCard} ${
                  role === 'admin' 
                  ? `${theme.colors.background.input} ${theme.colors.border.active}` 
                  : `${theme.colors.background.input} ${theme.colors.border.default} ${theme.colors.border.hover}`
                }`}
              >
                <FaChalkboardTeacher className={`text-2xl mb-2 ${role === 'admin' ? theme.colors.text.accent : theme.colors.text.muted}`} />
                <span className={`font-semibold text-sm mb-1 ${role === 'admin' ? theme.colors.text.primary : theme.colors.text.secondary}`}>Teacher</span>
                <span className={`text-[10px] ${theme.colors.text.muted} text-center px-2 leading-tight`}>
                  Create quizzes and manage students
                </span>
              </button>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4">
              <button type="button" className={getClasses('socialButton')}>
                <FcGoogle className="text-lg" />
                <span className={`text-sm font-medium ${theme.colors.text.secondary}`}>Google</span>
              </button>
              <button type="button" className={getClasses('socialButton')}>
                <FaFacebook className="text-lg text-blue-500" />
                <span className={`text-sm font-medium ${theme.colors.text.secondary}`}>Facebook</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className={`flex-grow border-t ${theme.colors.border.default}`}></div>
              <span className={`flex-shrink-0 mx-4 ${theme.colors.text.muted} text-[10px] font-bold uppercase tracking-wider`}>OR</span>
              <div className={`flex-grow border-t ${theme.colors.border.default}`}></div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`${theme.colors.text.secondary} ${theme.typography.label}`}>Full Name</label>
                <div className="relative">
                  <FiUser className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.muted}`} />
                  <input type="text" placeholder="Phabindra Kumar" className={getClasses('input')}
                    {...register("fullName")} />
                </div>
              </div>
              
              <div>
                <label className={`${theme.colors.text.secondary} ${theme.typography.label}`}>Username</label>
                <div className="relative">
                  <FiUser className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.muted}`} />
                  <input type="text" placeholder="Phabindra" className={getClasses('input')}
                    {...register("username", { required: "Username is required" })} />
                </div>
                {errors.username && <p className={`${theme.colors.text.error} ${theme.typography.error}`}>{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <label className={`${theme.colors.text.secondary} ${theme.typography.label}`}>Email</label>
              <div className="relative">
                <FiMail className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.muted}`} />
                <input type="email" placeholder="phabindra@example.com" className={getClasses('input')}
                  {...register("email", { required: "Email is required" })} />
              </div>
              {errors.email && <p className={`${theme.colors.text.error} ${theme.typography.error}`}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={`${theme.colors.text.secondary} ${theme.typography.label}`}>Password</label>
              <div className="relative">
                <FiLock className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.muted}`} />
                <input type={hidePassword.password ? "password" : "text"} placeholder="••••••••"
                  className={getClasses('input')}
                  {...register("password", { required: "Password is required" })} />
                <button type="button" onClick={() => setHidePassword(p => ({ ...p, password: !p.password }))}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 ${theme.colors.text.muted} hover:text-white transition-colors`}>
                  {hidePassword.password ? <TbEyeClosed /> : <TbEyeCheck />}
                </button>
              </div>
              {errors.password && <p className={`${theme.colors.text.error} ${theme.typography.error}`}>{errors.password.message}</p>}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              type="submit"
              className={getClasses('primaryButton')}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </motion.button>

          </form>

          <p className={`text-center ${theme.colors.text.muted} text-sm mt-8`}>
            Already have an account?{' '}
            <Link to="/login" className={`${theme.colors.text.accent} ${theme.colors.text.accentHover} font-semibold transition-colors`}>
              Sign In
            </Link>
          </p>

        </motion.div>
      </div>
    </div>
  )
}

export default SignUp
