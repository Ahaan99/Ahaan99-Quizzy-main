import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMoreVertical, FiMail, FiCheckCircle, FiClock, FiTrendingUp, FiActivity } from 'react-icons/fi';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const students = [
    {
      id: 1,
      name: 'Emma Thompson',
      email: 'emma.t@example.com',
      enrolledCourses: ['React Mastery', 'Advanced Node.js'],
      progress: 85,
      grade: 'A',
      attendance: '92%',
      status: 'Active',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'm.chen@example.com',
      enrolledCourses: ['Frontend Fundamentals'],
      progress: 45,
      grade: 'C+',
      attendance: '78%',
      status: 'At Risk',
      avatar: 'https://i.pravatar.cc/150?img=11'
    },
    {
      id: 3,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      enrolledCourses: ['Fullstack Java', 'Database Design'],
      progress: 100,
      grade: 'A+',
      attendance: '100%',
      status: 'Completed',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      id: 4,
      name: 'David Rodriguez',
      email: 'david.r@example.com',
      enrolledCourses: ['React Mastery'],
      progress: 12,
      grade: 'N/A',
      attendance: '40%',
      status: 'Inactive',
      avatar: 'https://i.pravatar.cc/150?img=12'
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'At Risk': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'Completed': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]';
    if (progress >= 50) return 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]';
    if (progress >= 30) return 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]';
    return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
  };

  return (
    <div className="text-white max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight">Student Overview</h1>
          <p className="text-[#94A3B8] text-sm">Monitor enrollment, grades, and academic progress</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><FiUsers className="text-6xl text-purple-500" /></div>
           <span className="text-[#94A3B8] text-sm font-medium z-10">Total Enrolled</span>
           <div className="flex items-end gap-3 z-10">
              <h2 className="text-3xl font-bold">1,248</h2>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 mb-1"><FiTrendingUp /> +12%</span>
           </div>
        </div>
        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><FiCheckCircle className="text-6xl text-emerald-500" /></div>
           <span className="text-[#94A3B8] text-sm font-medium z-10">Avg. Attendance</span>
           <div className="flex items-end gap-3 z-10">
              <h2 className="text-3xl font-bold">86%</h2>
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 mb-1"><FiTrendingUp /> +2.4%</span>
           </div>
        </div>
        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><FiActivity className="text-6xl text-orange-500" /></div>
           <span className="text-[#94A3B8] text-sm font-medium z-10">At Risk Students</span>
           <div className="flex items-end gap-3 z-10">
              <h2 className="text-3xl font-bold text-orange-400">42</h2>
              <span className="text-red-400 text-xs font-bold flex items-center gap-1 mb-1">Needs attention</span>
           </div>
        </div>
        <div className="bg-[#16161A] border border-[#2A2A35] p-5 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10"><FiClock className="text-6xl text-blue-500" /></div>
           <span className="text-[#94A3B8] text-sm font-medium z-10">Course Completion</span>
           <div className="flex items-end gap-3 z-10">
              <h2 className="text-3xl font-bold">64%</h2>
              <span className="text-[#64748B] text-xs font-bold flex items-center gap-1 mb-1">Global average</span>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#16161A] border border-[#2A2A35] rounded-xl overflow-hidden">
        
        {/* Controls Section */}
        <div className="p-4 sm:p-6 border-b border-[#2A2A35]">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-xs">
                 <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                 <input 
                   type="text" 
                   placeholder="Search students by name or email..." 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-[#1A1A24] border border-[#2A2A35] rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#8B5CF6] transition-colors" 
                 />
              </div>

              <div className="flex items-center gap-3">
                 <button className="flex items-center justify-center gap-2 text-sm text-[#94A3B8] hover:text-white bg-[#1A1A24] border border-[#2A2A35] px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto">
                    <FiFilter /> Filters
                 </button>
              </div>
           </div>
        </div>

        {/* Mobile Cards (Visible only on small screens) */}
        <div className="block lg:hidden divide-y divide-[#2A2A35]">
          {students.map(student => (
             <div key={student.id} className="p-4 hover:bg-[#1A1A24] transition-colors">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-[#2A2A35] object-cover" />
                      <div>
                         <h3 className="font-semibold text-white text-sm">{student.name}</h3>
                         <p className="text-xs text-[#64748B]">{student.email}</p>
                      </div>
                   </div>
                   <button className="text-[#94A3B8] hover:text-white p-2"><FiMoreVertical /></button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <div className="bg-[#0F0F13] p-3 rounded-lg border border-[#2A2A35]">
                      <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold mb-1">Grade</p>
                      <p className="font-bold text-white text-sm">{student.grade}</p>
                   </div>
                   <div className="bg-[#0F0F13] p-3 rounded-lg border border-[#2A2A35]">
                      <p className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold mb-1">Status</p>
                      <span className={`border text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                   </div>
                </div>

                <div>
                   <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#94A3B8] font-medium">Course Progress</span>
                      <span className="text-white font-bold">{student.progress}%</span>
                   </div>
                   <div className="w-full h-1.5 bg-[#2A2A35] rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${student.progress}%` }} 
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${getProgressColor(student.progress)}`} 
                      />
                   </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                   <button className="flex-1 bg-transparent border border-[#2A2A35] hover:bg-white/5 text-white py-2 rounded-lg text-xs font-medium transition-colors">
                      View Profile
                   </button>
                   <button className="flex items-center justify-center w-10 border border-[#2A2A35] hover:bg-white/5 text-white rounded-lg transition-colors">
                      <FiMail className="text-[#94A3B8]" />
                   </button>
                </div>
             </div>
          ))}
        </div>

        {/* Desktop Table (Hidden on small screens) */}
        <div className="hidden lg:block overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="bg-[#0F0F13] border-b border-[#2A2A35] text-[#64748B] text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Enrolled Courses</th>
                    <th className="px-6 py-4 font-semibold">Progress</th>
                    <th className="px-6 py-4 font-semibold">Grade</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A35]">
                 {students.map(student => (
                    <tr key={student.id} className="hover:bg-[#1A1A24] transition-colors group">
                       <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                             <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full bg-[#2A2A35] object-cover border border-[#2A2A35]" />
                             <div>
                                <h3 className="font-semibold text-white text-sm group-hover:text-[#8B5CF6] transition-colors cursor-pointer">{student.name}</h3>
                                <p className="text-xs text-[#64748B]">{student.email}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5">
                             {student.enrolledCourses.map((course, i) => (
                               <span key={i} className="bg-[#2A2A35]/50 border border-[#2A2A35] text-[#94A3B8] text-[10px] font-bold px-2 py-1 rounded-md">
                                 {course}
                               </span>
                             ))}
                          </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap w-48">
                          <div className="flex items-center gap-3">
                             <div className="flex-1 h-1.5 bg-[#2A2A35] rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }} 
                                  animate={{ width: `${student.progress}%` }} 
                                  transition={{ duration: 1 }}
                                  className={`h-full rounded-full ${getProgressColor(student.progress)}`} 
                                />
                             </div>
                             <span className="text-xs font-bold text-white w-8">{student.progress}%</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-white font-bold text-sm">{student.grade}</span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`border text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(student.status)}`}>
                             {student.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2A2A35] text-[#94A3B8] hover:text-white hover:bg-[#8B5CF6] hover:border-[#8B5CF6] transition-all" title="Message Student">
                                <FiMail className="text-sm" />
                             </button>
                             <button className="bg-transparent border border-[#2A2A35] hover:bg-white/5 text-white px-4 py-1.5 rounded-lg text-xs font-medium transition-colors">
                                Profile
                             </button>
                             <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-transparent text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
                                <FiMoreVertical />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default Students;