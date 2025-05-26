'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBook, FaHistory } from 'react-icons/fa';
import ConnectWallet from '../components/ConnectWallet';

export default function Home() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);

  return (
    <div className="min-h-screen animate-gradient">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0e17]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-[#fffffe]">
              Askesis
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsAboutVisible(true)}
                className="btn btn-secondary"
              >
                About
              </button>
              <ConnectWallet className="" />
              <Link href="/login" className="btn btn-primary">
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        {/* Hero Section */}
        <section className="text-center py-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold mb-6"
          >
            Enlighten Your Mind Through Socratic AI Inquiry
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[#a7a9be] text-xl mb-12 max-w-2xl mx-auto"
          >
            Discover the power of guided questioning with our AI teachers in Philosophy, Literature, and History.
          </motion.p>
        </section>

        {/* Subject Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Philosophy Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="text-[#ff8906] text-4xl mb-4">
                <FaGraduationCap />
              </div>
              <h3 className="text-2xl font-great-vibes mb-2">Philosophy</h3>
              <p className="text-[#a7a9be]">
                Explore fundamental questions about existence, knowledge, and ethics with our AI philosophy teacher.
              </p>
            </motion.div>

            {/* Literature Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="text-[#ff8906] text-4xl mb-4">
                <FaBook />
              </div>
              <h3 className="text-2xl font-great-vibes mb-2">Literature</h3>
              <p className="text-[#a7a9be]">
                Dive into classic and contemporary works with our AI literature expert.
              </p>
            </motion.div>

            {/* History Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="card group hover:scale-105 transition-transform duration-300"
            >
              <div className="text-[#ff8906] text-4xl mb-4">
                <FaHistory />
              </div>
              <h3 className="text-2xl font-great-vibes mb-2">History</h3>
              <p className="text-[#a7a9be]">
                Journey through time and explore significant events with our AI history teacher.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* About Modal */}
      {isAboutVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card max-w-2xl mx-4"
          >
            <h2 className="text-2xl font-bold mb-4">About Askesis</h2>
            <p className="text-[#a7a9be] mb-4">
              Askesis is an innovative learning platform that combines the ancient Socratic method with modern AI technology. Our AI teachers are designed to guide you through thoughtful questioning, helping you develop critical thinking skills and deeper understanding of various subjects.
            </p>
            <p className="text-[#a7a9be] mb-4">
              Each AI teacher is specialized in their field and uses the Socratic method to encourage active learning through dialogue and questioning. This approach helps you not just memorize information, but truly understand and engage with the material.
            </p>
            <button
              onClick={() => setIsAboutVisible(false)}
              className="btn btn-primary mt-4"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}