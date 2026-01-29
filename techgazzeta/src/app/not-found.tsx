'use client'

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white px-4 overflow-hidden relative">
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: Math.random() * 4 + 'px',
              height: Math.random() * 4 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
          />
        ))}
      </div>

      <div className="text-center z-10">
        <motion.h1 
          className="text-[12rem] font-bold leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-purple-600"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Lost in Space?
          </h2>
          <p className="text-slate-400 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-purple-500/20"
          >
            Return Home
          </Link>
        </motion.div>
      </div>

      <motion.div 
        className="mt-16 text-8xl"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        🧑‍🚀
      </motion.div>
    </div>
  );
};

export default NotFound;