'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isInitialTypingComplete, setIsInitialTypingComplete] = useState(false);
  
  const baseText = 'Unlock the future\nof ';
  const cyclingWords = ['education', 'learning', 'teaching'];
  const fullInitialText = baseText + cyclingWords[0]; // "Unlock the future\nof education"
  
  useEffect(() => {
    let index = 0;
    
    const typeInitialText = () => {
      const timer = setInterval(() => {
        if (index < fullInitialText.length) {
          setTypewriterText(fullInitialText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setIsInitialTypingComplete(true);
          // Start cycling after a pause
          setTimeout(() => startCycling(), 2000);
        }
      }, 100);
      return timer;
    };
    
    const startCycling = () => {
      let wordIndex = 0; // Start with 'education' (first word)
      let charIndex = cyclingWords[0].length; // Start at the end of 'education'
      let isDeleting = false;
      let pauseCounter = 0;
      const pauseDuration = 20; // 2 seconds pause (20 * 100ms)
      
      const cycleTimer = setInterval(() => {
        const currentWord = cyclingWords[wordIndex];
        
        if (pauseCounter > 0) {
          // Pause between transitions
          pauseCounter--;
          return;
        }
        
        if (isDeleting) {
          // Delete characters
          if (charIndex > 0) {
            charIndex--;
            setTypewriterText(baseText + currentWord.slice(0, charIndex));
          } else {
            // Finished deleting, move to next word and start typing
            isDeleting = false;
            wordIndex = (wordIndex + 1) % cyclingWords.length;
            charIndex = 0;
          }
        } else {
          // Type characters
          if (charIndex < cyclingWords[wordIndex].length) {
            charIndex++;
            setTypewriterText(baseText + cyclingWords[wordIndex].slice(0, charIndex));
          } else {
            // Finished typing, start pause then delete
            isDeleting = true;
            pauseCounter = pauseDuration;
          }
        }
      }, isDeleting ? 50 : 100); // Faster deletion, slower typing
      
      return cycleTimer;
    };
    
    const initialTimer = typeInitialText();
    
    return () => {
      clearInterval(initialTimer);
    };
  }, []);

  // Cursor blinking effect
  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorTimer);
  }, []);

  const formatTypewriterText = (text: string) => {
    const lines = text.split('\n');
    const firstLine = lines[0] || '';
    const secondLine = lines[1] || '';
    
    return (
      <>
        {firstLine}
        {lines.length > 1 && <br />}
        {secondLine && (
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
            {secondLine}
          </span>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Light blue blob */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        {/* Dark blue blobs */}
        <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full blur-3xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-gradient-to-r from-blue-700 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse delay-2000"></div>
        
        {/* Cyan blue blob */}
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl opacity-25 animate-pulse delay-500"></div>
        
        {/* Additional floating blue elements */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-300 to-blue-400 rounded-3xl blur-2xl opacity-20 animate-bounce"></div>
        <div className="absolute top-2/3 right-1/3 w-40 h-40 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full blur-2xl opacity-15 animate-bounce delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6">
        {/* Left side - Brand and Logo */}
        <div className="flex items-center">
          <span className="coolvetica text-5xl text-white font-medium">askesis</span>
          <Image 
            src="/images/logo.png" 
            alt="Askesis Logo" 
            width={50} 
            height={50}
            className="rounded-lg -mt-5"
          />
        </div>

        {/* Right side - Auth buttons */}
        <div className="flex items-center space-x-4">
          <button className="px-6 py-2 text-white/80 hover:text-white transition-colors duration-200 font-medium">
            Login
          </button>
          <button className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white transition-all duration-300 font-medium">
            Create Account
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight font-poppins">
            {formatTypewriterText(typewriterText)}
            {showCursor && <span className="animate-pulse">|</span>}
          </h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
            className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Experience personalized AI-powered learning through the ancient art of Socratic questioning. 
            Discover knowledge in Philosophy, Literature, and History like never before.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-2xl">
              Start Learning
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors duration-200 border border-white/20">
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute top-20 left-10 hidden lg:block"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl mb-3"></div>
            <p className="text-white text-sm font-medium">Deep Learning Solutions</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute top-32 right-20 hidden lg:block"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mb-3"></div>
            <p className="text-white text-sm font-medium">AI Philosophy</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-32 left-20 hidden lg:block"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl mb-3"></div>
            <p className="text-white text-sm font-medium">Literature Analysis</p>
          </div>
        </motion.div>
      </main>

      {/* Bottom Dock Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="fixed bottom-6 w-full flex justify-center z-50"
      >
        <div className="bg-black/40 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-6 border border-white/20 shadow-lg">
          <button 
            onClick={() => setIsAboutVisible(true)}
            className="dock-item"
          >
            About Us
          </button>
          <Link href="#features" className="dock-item">
            Features
          </Link>
          <Link href="#benefits" className="dock-item">
            Benefits
          </Link>
          <Link href="#testimonials" className="dock-item">
            Testimonials
          </Link>
          <Link href="#pricing" className="dock-item">
            Pricing
          </Link>
        </div>
      </motion.div>

      {/* About Modal */}
      {isAboutVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setIsAboutVisible(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl mx-4 border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-bold text-white mb-6">About Askesis</h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                Askesis combines the ancient wisdom of Socratic questioning with cutting-edge AI technology to create a revolutionary learning experience.
              </p>
              <p>
                Our AI teachers are specialized in Philosophy, Literature, and History, each designed to guide you through thoughtful dialogue that develops critical thinking and deep understanding.
              </p>
              <p>
                Experience education that doesn't just teach you facts, but helps you discover knowledge through guided inquiry and personal reflection.
              </p>
            </div>
            <button
              onClick={() => setIsAboutVisible(false)}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}