'use client'

import React, { useState } from 'react';
import { 
  Plus, 
  Calendar, 
  User, 
  Building2, 
  ChevronRight, 
  ChevronLeft, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';


interface Post {
  id: string;
  buildingId: string;
  userId: string;
  userName: string;
  title: string;
  content: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}


const MOCK_POSTS: Post[] = [
  {
    id: "1",
    buildingId: "bld-882",
    userId: "usr-01",
    userName: "Admin Management",
    title: "Annual Summer Community Soirée",
    content: "We are thrilled to announce our annual rooftop gathering. Join your neighbors for an evening of live jazz, curated catering, and refreshments as we celebrate our vibrant community.",
    status: "active",
    createdAt: "2026-01-20T18:00:00.000Z",
    updatedAt: "2026-01-20T18:00:00.000Z"
  },
  {
    id: "2",
    buildingId: "bld-882",
    userId: "usr-05",
    userName: "Maintenance Team",
    title: "Elevator Modernization Update",
    content: "As part of our commitment to excellence, the East Wing elevators will undergo software optimization this Monday between 10 AM and 12 PM. We appreciate your patience.",
    status: "active",
    createdAt: "2026-01-21T09:00:00.000Z",
    updatedAt: "2026-01-21T09:00:00.000Z"
  },
  {
    id: "3",
    buildingId: "bld-882",
    userId: "usr-12",
    userName: "Security Desk",
    title: "Enhanced Valet & Parking Protocols",
    content: "To ensure seamless access for all residents, we are implementing a new digital guest registration system for the valet service starting next month.",
    status: "active",
    createdAt: "2026-01-22T11:45:00.000Z",
    updatedAt: "2026-01-22T11:45:00.000Z"
  },
  {
    id: "4",
    buildingId: "bld-882",
    userId: "usr-03",
    userName: "Wellness Coordinator",
    title: "Sunrise Yoga on the Terrace",
    content: "Embrace the morning with our professional-led yoga sessions. Complimentary for all verified members. Every Tuesday and Thursday at 7:30 AM.",
    status: "active",
    createdAt: "2026-01-22T14:20:00.000Z",
    updatedAt: "2026-01-22T14:20:00.000Z"
  }
];

const BuildingPostsPage: React.FC = () => {
  const [posts] = useState<Post[]>(MOCK_POSTS);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">BMS</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Community Hub</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
              <Search size={20} />
            </button>
            <Link href={'/features/community/create'} 

              className="group flex items-center bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 text-center rounded-full transition-all duration-300 shadow-lg shadow-slate-200"
            >
              <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-semibold text-sm">Create Post</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Building Feed</h2>
            <p className="text-slate-500 mt-2 text-lg">Stay updated with the latest announcements and events.</p>
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button className="px-4 cursor-pointer py-1.5 text-sm font-medium bg-slate-100 text-slate-900 rounded-md">All Posts</button>
            <button className="px-4 cursor-pointer py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">Events</button>
            <button className="px-4 cursor-pointer py-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">Notices</button>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 relative"
            >
              <div className="absolute top-8 right-8">
                <ArrowUpRight className="text-slate-300 group-hover:text-indigo-500 transition-colors" size={20} />
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {post.userName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{post.userName}</h4>
                  <div className="flex items-center text-xs text-slate-400 mt-0.5 font-medium">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(post.createdAt)}
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {post.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed mb-6 text-[17px]">
                {post.content}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700 uppercase tracking-tighter">
                    {post.status}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center">
                    <User size={14} className="mr-1" />
                    Resident Verified
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex items-center justify-between border-t border-slate-200 pt-8">
          <button className="flex cursor-pointer items-center text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors disabled:opacity-30">
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>
          
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((page) => (
              <button 
                key={page}
                className={`w-10 cursor-pointer h-10 rounded-xl text-sm font-bold transition-all ${
                  page === 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button className="flex cursor-pointer items-center text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            Next
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </main>

      <footer className="py-12 text-center">
        <p className="text-slate-400 text-sm font-medium">© 2026 Skyline Heights Residential. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BuildingPostsPage;