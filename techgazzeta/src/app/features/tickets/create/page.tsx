'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Wrench, 
  ChevronDown, 
  Type, 
  Tag, 
  BarChart, 
  AlignLeft,
  ArrowRight
} from 'lucide-react';

type TicketCategory = 'maintenance' | 'repair' | 'complaint' | 'other';
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

interface CreateTicketPayload {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
}

interface TicketResponse extends CreateTicketPayload {
  id: string;
  buildingId: string;
  unitId: string;
  createdByUserId: string;
  status: 'open' | string;
  assignedToUserId: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  buildingId?: string;
}

const CreateTicketPage: React.FC<Props> = ({ 
  buildingId = "550e8400-e29b-41d4-a716-446655440000" 
}) => {
  const [formData, setFormData] = useState<CreateTicketPayload>({
    title: '',
    category: 'repair',
    priority: 'medium',
    description: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [createdTicket, setCreatedTicket] = useState<TicketResponse | null>(null);

  const priorityColors: Record<TicketPriority, string> = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    urgent: 'bg-rose-50 text-rose-700 border-rose-200'
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResponse: TicketResponse = {
        ...formData,
        id: crypto.randomUUID(),
        buildingId: buildingId,
        unitId: "UNIT-404",
        createdByUserId: "USR-001",
        status: 'open',
        assignedToUserId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setCreatedTicket(mockResponse);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'success' && createdTicket) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 text-center border border-indigo-100 animate-in fade-in zoom-in duration-300">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-8 shadow-inner">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Submission Successful</h2>
          <p className="text-slate-500 mb-8 px-4">
            Ticket <span className="text-indigo-600 font-bold">#{createdTicket.id.slice(0, 8).toUpperCase()}</span> has been recorded. Our team will review it shortly.
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            Create Another Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-12 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100">
          <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">Maintenance Hub</h1>
                <p className="text-indigo-100 opacity-90 mt-1">Submit your technical requests below</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <Type className="w-4 h-4 text-indigo-500" />
                Problem Title
              </label>
              <input
                required
                name="title"
                type="text"
                placeholder="Briefly describe what's wrong"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-400 font-medium"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <Tag className="w-4 h-4 text-indigo-500" />
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer font-medium text-slate-700"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Technical Repair</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other Service</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                  <BarChart className="w-4 h-4 text-indigo-500" />
                  Priority
                </label>
                <div className="flex p-1.5 bg-slate-100 rounded-[1.25rem] border border-slate-200 gap-1">
                  {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                      className={`flex-1 cursor-pointer py-2 text-[11px] font-black uppercase rounded-xl transition-all ${
                        formData.priority === p 
                        ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' 
                        : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
                <AlignLeft className="w-4 h-4 text-indigo-500" />
                Detailed Description
              </label>
              <textarea
                required
                name="description"
                rows={4}
                placeholder="Please provide details about the location and nature of the issue..."
                className="w-full px-6 py-5 rounded-3xl bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-400 resize-none font-medium text-slate-700 leading-relaxed"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="flex items-start gap-4 p-5 bg-amber-50 rounded-2xl border-2 border-amber-100/50">
              <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 font-semibold leading-relaxed">
                Notice: Accurate information helps our technicians respond faster. 
                Misuse of the ticketing system may result in account restrictions.
              </p>
            </div>

            <button
              disabled={status === 'loading'}
              type="submit"
              className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-black py-6 rounded-[1.5rem] transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" />
                  <span className="text-lg uppercase tracking-wider">Processing...</span>
                </>
              ) : (
                <>
                  <span className="text-lg uppercase tracking-wider">Submit Request</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-10 flex justify-center items-center gap-4 text-slate-400">
           <div className="h-px w-12 bg-slate-200"></div>
           <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
             Ref ID: {buildingId.slice(0, 13).toUpperCase()}
           </p>
           <div className="h-px w-12 bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketPage;