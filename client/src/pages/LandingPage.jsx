import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiZap, FiMenu, FiX, FiTwitter, FiFacebook, FiInstagram,
  FiLinkedin, FiYoutube, FiMail, FiPhone, FiMapPin,
  FiMonitor, FiGift, FiGrid, FiTrendingUp, FiAward, FiSmartphone, FiClock
} from "react-icons/fi";
import { MdScience, MdCalculate, MdBiotech, MdPublic, MdNewspaper } from "react-icons/md";
import { GiChemicalDrop } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Award, TrendingUp, Star } from "lucide-react";

/* ─── DATA ─────────────────────────────────────────────────── */
const categories = [
  { label: "Frontend Interview",  icon: FiMonitor,     color: "from-blue-500 to-cyan-400",    border: "border-blue-500/30" },
  { label: "React",               icon: FiZap,         color: "from-indigo-500 to-blue-400",  border: "border-indigo-500/30" },
  { label: "Fullstack Java",      icon: FiGrid,        color: "from-orange-500 to-amber-400", border: "border-orange-500/30" },
  { label: "Angular",             icon: FiTrendingUp,  color: "from-red-500 to-rose-400",     border: "border-red-500/30" },
  { label: "Software Engineering",icon: FiAward,       color: "from-purple-500 to-violet-400", border: "border-purple-500/30" },
];

const features = [
  { icon: FiMonitor,    label: "Personalized Learning",    desc: "Adaptive quizzes that adjust to your knowledge level and learning pace" },
  { icon: FiGift,       label: "Reward System",            desc: "Earn points, badges, and real rewards for your achievements" },
  { icon: FiGrid,       label: "Teacher Dashboard",        desc: "Comprehensive tools for educators to create and manage quizzes" },
  { icon: FiTrendingUp, label: "Progress Tracking",        desc: "Adaptive quizzes that adjust to your knowledge level and learning pace" },
  { icon: FiAward,      label: "Competitive Leaderboards", desc: "Compete with peers and climb the ranks in various categories" },
  { icon: FiSmartphone, label: "Mobile Friendly",          desc: "Access quizzes anytime, anywhere on any device" },
];

const avatars = [
  "https://i.pravatar.cc/40?img=1",
  "https://i.pravatar.cc/40?img=2",
  "https://i.pravatar.cc/40?img=3",
  "https://i.pravatar.cc/40?img=4",
];

/* ─── NAVBAR ────────────────────────────────────────────────── */
const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <FiZap className="text-white text-sm" />
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Quizzy
          </span>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
          {["Quiz", "Weekly Quiz", "Rewards", "About"].map(l => (
            <li key={l}>
              <a href={`#${l.toLowerCase().replace(" ", "-")}`}
                className="hover:text-white transition-colors">{l}</a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login"
            className="text-sm font-semibold text-white border border-white/20 px-4 py-1.5 rounded-md hover:bg-white/10 transition-all">
            Sign In
          </Link>
          <Link to="/signup"
            className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-md hover:opacity-90 transition-all">
            Register
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(p => !p)} className="md:hidden text-white p-2">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="md:hidden bg-black/95 border-t border-white/5 overflow-hidden">
            <div className="px-4 py-4 flex flex-col gap-3">
              {["Quiz", "Weekly Quiz", "Rewards", "About"].map(l => (
                <a key={l} href={`#${l.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setOpen(false)}
                  className="text-gray-300 hover:text-white text-sm font-medium py-1">{l}</a>
              ))}
              <div className="flex gap-3 pt-2">
                <Link to="/login" onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-semibold text-white border border-white/20 px-4 py-2 rounded-md">
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}
                  className="flex-1 text-center text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-md">
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ─── HERO ──────────────────────────────────────────────────── */
const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
    {/* Dark gradient background */}
    <div className="absolute inset-0 bg-[#0d0d0d]" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-900/20 blur-[120px] rounded-full point-events-none" />

    {/* Grid overlay */}
    <div className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)`,
        backgroundSize: "40px 40px"
      }} />

    <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
      {/* Badge */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-black text-white text-xs font-medium px-4 py-2 rounded-full mb-8">
        <FiZap className="text-purple-400" />
        The ultimate quiz experience
      </motion.div>

      {/* Headline */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
          <span className="text-gray-300 block text-left pl-4 sm:pl-12 text-4xl sm:text-5xl lg:text-6xl">Learn,</span>
          <span className="bg-gradient-to-r from-purple-600 via-violet-500 to-orange-400 bg-clip-text text-transparent">
            Earn Rewards
          </span>
        </h1>
      </motion.div>

      {/* Subtext */}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
        Join thousands of students and teachers on the ultimate quiz platform. Test your knowledge,
        compete with peers, and win exciting rewards.
      </motion.p>

      {/* Buttons */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
        <Link to="/signup"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-all shadow-lg shadow-purple-500/30">
          Get Started
        </Link>
        <a href="#quiz"
          className="text-gray-700 font-semibold text-sm hover:text-purple-600 transition-colors flex items-center gap-1">
          Explore Quizzes <span>→</span>
        </a>
      </motion.div>

      {/* Social proof */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-3">
        <div className="flex -space-x-2">
          {avatars.map((src, i) => (
            <img key={i} src={src} alt="user"
              className="w-9 h-9 rounded-full border-2 border-white object-cover" />
          ))}
        </div>
        <span className="text-gray-600 text-sm font-semibold">5,000+</span>
      </motion.div>
    </div>
  </section>
);

/* ─── CATEGORIES ────────────────────────────────────────────── */
const Categories = () => (
  <section id="quiz" className="bg-[#0d0d0d] py-20 px-4">
    <div className="max-w-6xl mx-auto">
      {/* Section badge */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-2 border border-indigo-500/40 text-indigo-400 text-xs px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
          Categories
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-3">
        Explore <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Quiz Categories</span>
      </h2>
      <p className="text-gray-500 text-center text-sm mb-12">
        Discover quizzes across various subjects to test and expand your knowledge
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(({ label, icon: Icon, color, border }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className={`bg-[#1a1a1a] border ${border} rounded-xl p-5 hover:bg-[#222] transition-all group cursor-pointer`}>
            <div className="flex items-start gap-4">
              {/* Icon circle */}
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-base mb-1">{label}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">
                  Test your knowledge in {label.toLowerCase()} with our challenging quizzes
                </p>
                <a href="#"
                  className={`text-xs font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent flex items-center gap-1 group-hover:gap-2 transition-all`}>
                  Explore Quizzes →
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── WEEKLY QUIZ ───────────────────────────────────────────── */
const WeeklyQuiz = () => (
  <section id="weekly-quiz" className="bg-[#0a0a0a] py-20 px-4 border-t border-white/5">
    <div className="max-w-6xl mx-auto">
      {/* Section badge */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-2 border border-green-500/40 text-green-400 text-xs px-4 py-1.5 rounded-full">
          <FiAward className="text-xs" />
          Weekly Challenge
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-3">
        Take the <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Weekly Quiz</span>
      </h2>
      <p className="text-gray-500 text-center text-sm mb-12">
        Compete in our special weekly quiz for a chance to win exclusive rewards and top the leaderboard.
      </p>

      <div className="flex justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-3xl w-full overflow-hidden group hover:border-green-500/30 transition-all">
          
          {/* Subtle gradient glow in background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-green-500/10 transition-all" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-400/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
               <FiZap className="text-green-400 text-4xl" />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Live Now</span>
                <span className="text-gray-500 text-xs flex items-center gap-1"><FiMonitor /> Tech & Science</span>
                <span className="text-gray-500 text-xs flex items-center gap-1"><FiGift /> 500 Pts</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">The Ultimate AI & Web3 Challenge</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-xl">
                Test your knowledge on the latest advancements in Artificial Intelligence and Web3 technologies. Top 10 scorers receive a special badge and bonus points!
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/login" className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-lg shadow-green-500/20 text-center whitespace-nowrap">
                  Participate Now
                </Link>
                <div className="text-xs text-gray-400 font-medium bg-[#1a1a1a] px-4 py-2.5 rounded-lg border border-white/5 w-full sm:w-auto text-center flex justify-center items-center gap-2">
                  <FiClock /> Ends in: <span className="text-white font-bold">2d 14h 32m</span>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

    </div>
  </section>
);

/* ─── FEATURES ──────────────────────────────────────────────── */
const Features = () => (
  <section id="about" className="bg-[#0a0a0a] py-20 px-4">
    <div className="max-w-6xl mx-auto">
      {/* Section badge */}
      <div className="flex justify-center mb-4">
        <span className="inline-flex items-center gap-2 border border-purple-500/40 text-purple-400 text-xs px-4 py-1.5 rounded-full">
          <FiZap className="text-xs" />
          Features
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-black text-center text-white mb-3">
        Why <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Quizzy</span>
      </h2>
      <p className="text-gray-500 text-center text-sm mb-12">
        Discover quizzes across various subjects to test and expand your knowledge
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map(({ icon: Icon, label, desc }, i) => (
          <motion.div key={label}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
            className="bg-[#141414] border border-white/8 rounded-xl p-6 hover:border-purple-500/30 hover:bg-[#1a1a1a] transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/20 flex items-center justify-center mb-4">
              <Icon className="text-purple-400 text-lg" />
            </div>
            <h3 className="text-white font-bold text-base mb-2">{label}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── CTA ───────────────────────────────────────────────────── */
const CTA = () => (
  <section id="rewards" className="py-16 px-4 bg-[#0a0a0a]">
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-700 via-violet-600 to-rose-500 p-8 sm:p-12">

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-16 w-40 h-40 rounded-full bg-white/10 translate-y-1/3" />

        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
              Ready to Start Your<br />Quiz Journey?
            </h2>
            <p className="text-white/80 text-sm mb-6">
              Join thousands of students and teachers. Sign up today and get access to all features.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/signup"
                className="bg-white text-purple-700 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-all">
                Create Account
              </Link>
              <a href="#quiz"
                className="border border-white text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-white/10 transition-all">
                Explore Quizzes
              </a>
            </div>
          </div>

          {/* Premium Floating UI Card */}
          <div className="hidden md:block relative w-full max-w-sm ml-auto">
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Glass Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              whileInView={{ opacity: 1, scale: 1 }} 
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[20px] p-6 shadow-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center border border-white/20 shadow-inner">
                    <Zap className="text-white w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Weekly Challenge</div>
                    <div className="text-white/70 text-xs">Top 5% Performer</div>
                  </div>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  +500 Pts
                </div>
              </div>
              
              {/* Progress track */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-white/80">Current Progress</span>
                  <span className="text-white">85%</span>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 w-[85%] rounded-full relative shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="flex gap-2">
                <div className="bg-white/10 border border-white/10 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 text-xs text-white font-medium shadow-sm flex-1 justify-center">
                  <Star className="text-yellow-400 w-4 h-4 fill-yellow-400" /> Rank #12
                </div>
                <div className="bg-white/10 border border-white/10 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2 text-xs text-white font-medium shadow-sm flex-1 justify-center">
                  <TrendingUp className="text-green-400 w-4 h-4" /> 3 Day Streak
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

/* ─── FOOTER ────────────────────────────────────────────────── */
const Footer = () => (
  <footer className="bg-[#080808] border-t border-white/5 pt-14 pb-6 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <FiZap className="text-white text-sm" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Quizzy
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            The ultimate quiz platform for students and teachers. Learn, compete, and earn rewards.
          </p>
          <div className="flex items-center gap-3">
            {[FiTwitter, FiFacebook, FiInstagram, FiLinkedin, FiYoutube].map((Icon, i) => (
              <a key={i} href="#"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
          <ul className="space-y-2.5">
            {["Home", "About Us", "Features", "Pricing", "Contact"].map(l => (
              <li key={l}>
                <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* For Teachers */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">For Teachers</h4>
          <ul className="space-y-2.5">
            {["About", "Contact us", "Careers", "Culture", "Blog"].map(l => (
              <li key={l}>
                <a href="#" className="text-gray-500 text-sm hover:text-white transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Contacts us</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-gray-500 text-sm">
              <FiMail className="text-purple-400 flex-shrink-0" />
              contact@company.com
            </li>
            <li className="flex items-center gap-2 text-gray-500 text-sm">
              <FiPhone className="text-green-400 flex-shrink-0" />
              (414) 687 - 5892
            </li>
            <li className="flex items-start gap-2 text-gray-500 text-sm">
              <FiMapPin className="text-orange-400 flex-shrink-0 mt-0.5" />
              794 Mcallister St,<br />San Francisco, 94102
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-600 text-xs">Copyright © 2025 StuQuiz</p>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>All Rights Reserved |</span>
          <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms and Conditions</a>
          <span>|</span>
          <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── LANDING PAGE ──────────────────────────────────────────── */
const LandingPage = () => (
  <div className="bg-black text-white">
    <Navbar />
    <Hero />
    <Categories />
    <WeeklyQuiz />
    <Features />
    <CTA />
    <Footer />
  </div>
);

export default LandingPage;
