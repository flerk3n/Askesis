'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBook, FaHistory } from 'react-icons/fa';
import { auth } from '@/lib/firebase';

export default function Subjects() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const subjects = [
    {
      id: 'philosophy',
      name: 'Philosophy',
      icon: FaGraduationCap,
      description: 'Explore fundamental questions about existence, knowledge, and ethics.',
      teacher: 'Dr. Evelyn Harper',
      color: '#ff8906'
    },
    {
      id: 'literature',
      name: 'Literature',
      icon: FaBook,
      description: 'Dive into classic and contemporary works with our AI literature expert.',
      teacher: 'Prof. James Wilson',
      color: '#ff8906'
    },
    {
      id: 'history',
      name: 'History',
      icon: FaHistory,
      description: 'Journey through time and explore significant events that shaped our world.',
      teacher: 'Dr. Sarah Chen',
      color: '#ff8906'
    }
  ];

  const handleSubjectSelect = (subjectId: string) => {
    router.push(`/chat/${subjectId}`);
  };

  return (
    <div className="min-h-screen bg-[#0f0e17] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">What do you want to learn today?</h1>
          <p className="text-[#a7a9be] text-lg">
            Choose a subject to begin your learning journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handleSubjectSelect(subject.id)}
            >
              <div className="text-[#ff8906] text-4xl mb-4">
                <subject.icon />
              </div>
              <h3 className="text-2xl font-great-vibes mb-2">{subject.name}</h3>
              <p className="text-[#a7a9be] mb-4">{subject.description}</p>
              <div className="flex items-center text-sm text-[#a7a9be]">
                <span>Your teacher:</span>
                <span className="ml-2 font-medium">{subject.teacher}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 