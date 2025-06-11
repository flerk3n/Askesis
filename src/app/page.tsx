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
        <div className="absolute top-0 left-0 w-50 h-96 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        {/* Dark blue blobs */}
        <div className="absolute top-20 right-40 w-80 h-80 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full blur-3xl opacity-25 animate-pulse delay-1000"></div>
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
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
        {/* Hero Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight font-poppins mt-16">
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
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-2xl">
              Start Learning
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors duration-200 border border-white/20">
              Watch Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Teachers Section */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          className="mt-20 w-full max-w-7xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white text-center mb-12 font-poppins">
            Meet Your AI Teachers
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {/* History Teacher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden mx-auto">
                <Image 
                  src="/images/history.png" 
                  alt="Mr. Jonathan Graves" 
                  width={96} 
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mr. Jonathan Graves</h3>
              <p className="text-blue-400 text-sm font-medium mb-4">History Teacher</p>
              <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                <p className="text-white/80 text-sm italic leading-relaxed">
                  "What do you think led to the fall of the Roman Empire? Let's examine the evidence together and see what patterns emerge from history's lessons."
                </p>
              </div>
            </motion.div>

            {/* Literature Teacher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 4.2 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden mx-auto">
                <Image 
                  src="/images/literature.png" 
                  alt="Ms. Eleanor Whitmore" 
                  width={96} 
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ms. Eleanor Whitmore</h3>
              <p className="text-blue-400 text-sm font-medium mb-4">Literature Teacher</p>
              <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                <p className="text-white/80 text-sm italic leading-relaxed">
                  "When Hamlet says 'To be or not to be,' what question is he really asking? How might this relate to choices you face in your own life?"
                </p>
              </div>
            </motion.div>

            {/* Philosophy Teacher */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 4.4 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="w-24 h-24 mb-4 rounded-xl overflow-hidden mx-auto">
                <Image 
                  src="/images/philosophy.png" 
                  alt="Dr. Celeste Morin" 
                  width={96} 
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dr. Celeste Morin</h3>
              <p className="text-blue-400 text-sm font-medium mb-4">Philosophy Teacher</p>
              <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                <p className="text-white/80 text-sm italic leading-relaxed">
                  "If a tree falls in a forest and no one hears it, does it make a sound? What does this question reveal about the nature of reality and perception?"
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Crowdfunding Section */}
        <motion.div
          id="crowdfunding"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 w-full max-w-7xl mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
              Support Education for All
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Help us make quality AI-powered education accessible to students who need it most. 
              Your contribution can change a life through learning.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donations List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Recent Donations</h3>
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg border border-blue-400/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      0x
                    </div>
                    <div>
                      <p className="text-white font-medium">Required Fund</p>
                      <p className="text-white/60 text-sm">0x34f7...8a2c</p>
                    </div>
                  </div>
                  <span className="text-blue-400 font-bold">+$420.50</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg border border-blue-400/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold">
                      0x
                    </div>
                    <div>
                      <p className="text-white font-medium">Contribution</p>
                      <p className="text-white/60 text-sm">0xa8b5...3f1e</p>
                    </div>
                  </div>
                  <span className="text-blue-400 font-bold">+$790.00</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-blue-600/30 rounded-lg border border-blue-500/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold">
                      0x
                    </div>
                    <div>
                      <p className="text-white font-medium">Required Fund</p>
                      <p className="text-white/60 text-sm">0xf4c2...9d67</p>
                    </div>
                  </div>
                  <span className="text-blue-200 font-bold text-lg">+$1,740.00</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-sky-600/30 rounded-lg border border-sky-500/50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white font-bold">
                      0x
                    </div>
                    <div>
                      <p className="text-white font-medium">CF</p>
                      <p className="text-white/60 text-sm">0x7e91...2b4a</p>
                    </div>
                  </div>
                  <span className="text-sky-200 font-bold text-lg">+$1,810.50</span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-blue-500/20 rounded-lg border border-blue-400/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      0x
                    </div>
                    <div>
                      <p className="text-white font-medium">Contribution</p>
                      <p className="text-white/60 text-sm">0x2d83...6c9f</p>
                    </div>
                  </div>
                  <span className="text-blue-400 font-bold">+$2,410.50</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Statistics Chart */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-6">Donation Statistics</h3>
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center mb-8"
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="inline-block bg-gradient-to-r from-blue-400 to-cyan-400 px-6 py-2 rounded-full text-black font-bold text-2xl"
                  >
                    $24,185.50
                  </motion.div>
                  <p className="text-white/70 mt-2">Total Raised This Month</p>
                </motion.div>

                {/* Mock Chart */}
                <div className="relative h-48 mb-6">
                  <svg className="w-full h-full" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
                      </linearGradient>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1"/>
                      </linearGradient>
                    </defs>
                    <motion.path
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1 }}
                      viewport={{ once: true }}
                      d="M 0,150 Q 50,120 100,140 T 200,100 T 300,80 T 400,60"
                      stroke="#3B82F6"
                      strokeWidth="3"
                      fill="url(#gradient1)"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 1.2 }}
                      viewport={{ once: true }}
                      d="M 0,180 Q 50,160 100,170 T 200,140 T 300,120 T 400,100"
                      stroke="#06B6D4"
                      strokeWidth="3"
                      fill="url(#gradient2)"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-400">156</p>
                    <p className="text-white/60 text-sm">Donors</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-400">23</p>
                    <p className="text-white/60 text-sm">Students Helped</p>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-400">$1,052</p>
                    <p className="text-white/60 text-sm">Avg. Donation</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-2xl">
              Donate Now
            </button>
          </motion.div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          id="testimonials"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-32 w-full max-w-7xl mx-auto px-4"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4 font-poppins">
              What Students Say
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover how Askesis is transforming learning experiences across the globe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SM
                </div>
                <div>
                  <h4 className="text-white font-semibold">Sarah Martinez</h4>
                  <p className="text-white/60 text-sm">Philosophy Student, Harvard</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-white/80 italic leading-relaxed">
                "Dr. Celeste Morin's questions made me think deeper than any textbook ever could. 
                The Socratic method through AI feels incredibly natural and engaging."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="text-white font-semibold">Michael Johnson</h4>
                  <p className="text-white/60 text-sm">History Major, Oxford</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-white/80 italic leading-relaxed">
                "Mr. Graves helped me understand historical patterns I never noticed before. 
                The personalized conversations make complex topics feel accessible."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  EW
                </div>
                <div>
                  <h4 className="text-white font-semibold">Emily Watson</h4>
                  <p className="text-white/60 text-sm">Literature Student, Yale</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-white/80 italic leading-relaxed">
                "Ms. Whitmore's approach to analyzing literature is revolutionary. 
                I now see layers in texts that I completely missed before."
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-32 bg-black/50 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Press Kit</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="text-white/70 hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Guides</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="coolvetica text-2xl text-white font-medium mr-3">askesis</span>
              <Image 
                src="/images/logo.png" 
                alt="Askesis Logo" 
                width={30} 
                height={30}
                className="rounded-lg"
              />
            </div>
            
            <div className="flex space-x-6">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              © 2024 Askesis. All rights reserved. Empowering minds through AI-powered Socratic learning.
            </p>
          </div>
        </div>
      </footer>

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
          <a href="#features" className="dock-item">
            Features
          </a>
          <a href="#crowdfunding" className="dock-item">
            Crowdfunding
          </a>
          <a href="#testimonials" className="dock-item">
            Testimonials
          </a>
          <Link href="/pricing" className="dock-item">
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
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:scale-105 transition-transform duration-200"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}