'use client'

import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight,
  RefreshCcw,
  Tag,
  Calendar,
  Plus
} from 'lucide-react';
import Link from 'next/link';

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Ticket {
  id: string;
  buildingId: string;
  unitId: string;
  createdByUserId: string;
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedToUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: "TIC-8821-A",
    buildingId: "550e8400-e29b-41d4-a716-446655440000",
    unitId: "UNT-101",
    createdByUserId: "USR-99",
    title: "Elevator making strange noise",
    description: "The main elevator in Block A vibrates heavily between 4th and 5th floors.",
    category: "maintenance",
    priority: "high",
    status: "open",
    assignedToUserId: null,
    createdAt: "2026-01-18T10:30:00Z",
    updatedAt: "2026-01-18T10:30:00Z"
  },
  {
    id: "TIC-4492-B",
    buildingId: "550e8400-e29b-41d4-a716-446655440000",
    unitId: "UNT-304",
    createdByUserId: "USR-42",
    title: "Water leakage in bathroom",
    description: "Pipe burst under the sink, needs immediate attention.",
    category: "repair",
    priority: "urgent",
    status: "in_progress",
    assignedToUserId: "TECH-01",
    createdAt: "2026-01-19T08:15:00Z",
    updatedAt: "2026-01-19T09:00:00Z"
  },
  {
    id: "TIC-1102-C",
    buildingId: "550e8400-e29b-41d4-a716-446655440000",
    unitId: "UNT-502",
    createdByUserId: "USR-12",
    title: "Broken hallway light",
    description: "Second floor hallway light is flickering.",
    category: "maintenance",
    priority: "low",
    status: "resolved",
    assignedToUserId: "TECH-05",
    createdAt: "2026-01-15T14:20:00Z",
    updatedAt: "2026-01-16T11:00:00Z"
  },
  {
    id: "TIC-9931-D",
    buildingId: "550e8400-e29b-41d4-a716-446655440000",
    unitId: "UNT-202",
    createdByUserId: "USR-07",
    title: "Intercom not working",
    description: "Cannot hear visitors from the main gate.",
    category: "repair",
    priority: "medium",
    status: "closed",
    assignedToUserId: "TECH-03",
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-01-12T17:30:00Z"
  }
];

const TicketListPage = () => {
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTickets = useMemo(() => {
    return MOCK_TICKETS.filter(ticket => {
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, searchQuery]);

  const stats = {
    total: MOCK_TICKETS.length,
    active: MOCK_TICKETS.filter(t => t.status === 'open' || t.status === 'in_progress').length,
    resolved: MOCK_TICKETS.filter(t => t.status === 'resolved').length
  };

  const getStatusStyles = (status: TicketStatus) => {
    switch (status) {
      case 'open': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'in_progress': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'closed': return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPriorityStyles = (priority: TicketPriority) => {
    switch (priority) {
      case 'urgent': return 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-amber-600';
      case 'low': return 'text-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em]">
              <div className="w-10 h-1 bg-indigo-600 rounded-full"></div>
              Administration
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Tickets List</h1>
          </div>
          
          <Link href="/features/tickets/create" className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95">
            <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
            Create Ticket
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Tag className="w-16 h-16 text-indigo-600" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Recorded</p>
            <p className="text-4xl font-black text-slate-900 mt-2">{stats.total}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-amber-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Clock className="w-16 h-16 text-amber-600" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-500">Active Tasks</p>
            <p className="text-4xl font-black text-amber-600 mt-2">{stats.active}</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-16 h-16 text-emerald-600" />
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Successfully Resolved</p>
            <p className="text-4xl font-black text-emerald-600 mt-2">{stats.resolved}</p>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden">
          <div className="p-8 border-b-2 border-slate-50 flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by ID or title..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
              {(['all', 'open', 'in_progress', 'resolved', 'closed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-6 cursor-pointer py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                    statusFilter === s 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                    : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                  <th className="px-10 py-6">Reference & Description</th>
                  <th className="px-6 py-6 text-center">Current Status</th>
                  <th className="px-6 py-6 text-center">Urgency</th>
                  <th className="px-6 py-6">Date Registered</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-50">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="group hover:bg-slate-50/80 transition-all cursor-pointer">
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black font-mono text-indigo-500 mb-1">
                          #{ticket.id}
                        </span>
                        <span className="text-slate-900 font-bold text-lg leading-tight group-hover:text-indigo-600 transition-colors">
                          {ticket.title}
                        </span>
                        <span className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-1">
                          <Tag className="w-3 h-3" /> {ticket.category} • Unit {ticket.unitId}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-center">
                      <span className={`inline-block px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${getStatusStyles(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-8 text-center">
                      <span className={`text-[11px] font-black uppercase tracking-widest ${getPriorityStyles(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </div>
                        <span className="text-slate-400 text-[11px] font-medium ml-5">
                          {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-bold text-slate-500">
              Showing <span className="text-indigo-600">{filteredTickets.length}</span> results in total
            </p>
            
            <div className="flex items-center gap-3">
              <button 
                className="p-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm disabled:opacity-50"
                disabled
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-1">
                {[1].map(page => (
                  <button key={page} className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-xs">
                    {page}
                  </button>
                ))}
              </div>
              <button 
                className="p-3 bg-white border-2 border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm disabled:opacity-50"
                disabled
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketListPage;