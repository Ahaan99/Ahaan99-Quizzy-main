import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUsers, FiVideo, FiMapPin, FiMoreVertical, FiPlus, FiFilter } from 'react-icons/fi';

const Events = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');

  const events = [
    {
      id: 1,
      title: 'Advanced React Patterns Workshop',
      type: 'Virtual',
      date: 'Oct 24, 2026',
      time: '10:00 AM - 12:30 PM',
      attendees: 145,
      status: 'Upcoming',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Fullstack Java Certification Drive',
      type: 'In-Person',
      location: 'Main Campus, Hall A',
      date: 'Oct 28, 2026',
      time: '09:00 AM - 04:00 PM',
      attendees: 320,
      status: 'Upcoming',
      color: 'orange'
    },
    {
      id: 3,
      title: 'Frontend Architecture Q&A',
      type: 'Virtual',
      date: 'Nov 02, 2026',
      time: '02:00 PM - 03:00 PM',
      attendees: 85,
      status: 'Draft',
      color: 'purple'
    }
  ];

  const filteredEvents = activeTab === 'All' 
    ? events 
    : events.filter(e => e.status === activeTab);

  return (
    <div className="text-white max-w-7xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 tracking-tight">Events</h1>
          <p className="text-[#94A3B8] text-sm">Schedule and manage virtual and in-person events</p>
        </div>
        <button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors">
          <FiPlus className="text-lg" />
          Create Event
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#16161A] border border-[#2A2A35] rounded-xl overflow-hidden">
        
        {/* Controls Section */}
        <div className="p-6 border-b border-[#2A2A35]">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-[#2A2A35] sm:border-0 w-full sm:w-auto">
                 {['Upcoming', 'Past', 'Drafts', 'All'].map(tab => (
                    <button key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 sm:pb-0 text-sm font-medium transition-colors relative ${
                        activeTab === tab ? 'text-white' : 'text-[#64748B] hover:text-[#94A3B8]'
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="eventTabIndicator" className="absolute -bottom-[1px] sm:-bottom-3 left-0 right-0 h-0.5 bg-[#8B5CF6]" />
                      )}
                    </button>
                 ))}
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white bg-[#1A1A24] border border-[#2A2A35] px-3 py-1.5 rounded-lg transition-colors">
                    <FiFilter /> Filter
                 </button>
              </div>
           </div>
        </div>

        {/* Events List */}
        <div className="divide-y divide-[#2A2A35]">
           {filteredEvents.length === 0 ? (
             <div className="p-12 text-center text-[#64748B]">
                <FiCalendar className="text-4xl mx-auto mb-3 opacity-50" />
                <p>No events found for this category.</p>
             </div>
           ) : (
             filteredEvents.map((event, index) => (
                <div key={event.id} className="p-6 hover:bg-[#1A1A24] transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-6">
                   
                   <div className="flex items-start sm:items-center gap-4 flex-1">
                      {/* Date Block */}
                      <div className="w-14 h-14 rounded-xl bg-[#2A2A35]/50 border border-[#2A2A35] flex flex-col items-center justify-center flex-shrink-0">
                         <span className="text-xs font-bold text-[#8B5CF6] uppercase">{event.date.split(' ')[0]}</span>
                         <span className="text-lg font-black text-white leading-none mt-0.5">{event.date.split(' ')[1].replace(',', '')}</span>
                      </div>
                      
                      {/* Details */}
                      <div>
                         <div className="flex flex-wrap items-center gap-3 mb-1.5">
                            <h3 className="font-semibold text-base text-white group-hover:text-purple-400 transition-colors">{event.title}</h3>
                            <span className={`border text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                event.status === 'Upcoming' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                event.status === 'Draft' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                            }`}>
                               {event.status}
                            </span>
                         </div>
                         
                         <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#94A3B8]">
                            <span className="flex items-center gap-1.5">
                               {event.type === 'Virtual' ? <FiVideo className="text-[#8B5CF6]" /> : <FiMapPin className="text-orange-400" />} 
                               {event.type === 'Virtual' ? 'Virtual Meeting' : event.location}
                            </span>
                            <span className="flex items-center gap-1.5"><FiClock className="text-blue-400" /> {event.time}</span>
                            <span className="flex items-center gap-1.5"><FiUsers className="text-emerald-400" /> {event.attendees} Registered</span>
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex items-center gap-3 mt-4 md:mt-0">
                      <button className="bg-transparent border border-[#2A2A35] hover:bg-white/5 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full md:w-auto text-center">
                         Manage
                      </button>
                      <button className="w-9 h-[38px] flex items-center justify-center rounded-lg border border-[#2A2A35] text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors">
                         <FiMoreVertical />
                      </button>
                   </div>

                </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default Events;