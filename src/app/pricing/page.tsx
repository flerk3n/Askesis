'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "🧠 Free Plan",
      price: "$0",
      yearlyPrice: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Limited daily AI chats",
        "Earn points by answering to unlock more chats",
        "Limited access to conversation history",
        "Basic AI model access"
      ],
      buttonText: "Get Started",
      popular: false,
      gradient: "from-gray-500 to-gray-600"
    },
    {
      name: "🚀 Plus Plan",
      price: "$5",
      yearlyPrice: "$45",
      period: "month",
      description: "For dedicated learners",
      features: [
        "3× more chats per day",
        "Advanced questions and deeper dialogue trees",
        "Save full conversation history",
        "Weekly performance insights",
        "Priority in new feature rollout",
        "2× points on correct answers"
      ],
      buttonText: "Start Plus",
      popular: true,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "🔥 Pro Plan",
      price: "$15",
      yearlyPrice: "$150",
      period: "month",
      description: "For serious scholars",
      features: [
        "Unlimited AI conversations",
        "Export conversations to PDF",
        "Personalized learning customization",
        "Verified learner badge in leaderboards",
        "Change/skip questions",
        "Access to advanced AI models"
      ],
      buttonText: "Go Pro",
      popular: false,
      gradient: "from-blue-600 to-blue-800"
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-blue-400 to-blue-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full blur-3xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-gradient-to-r from-blue-700 to-blue-600 rounded-full blur-3xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-3xl opacity-25 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center space-x-3">
          <span className="coolvetica text-2xl text-white font-medium">askesis</span>
        </Link>
        <Link href="/" className="text-white/80 hover:text-white transition-colors duration-200">
          ← Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-poppins">
            Choose Your Learning Journey
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Unlock the power of Socratic AI learning with plans designed for every type of learner
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-lg ${!isYearly ? 'text-white' : 'text-white/60'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
                isYearly ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/20'
              }`}
            >
              <div
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  isYearly ? 'transform translate-x-7' : 'transform translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-lg ${isYearly ? 'text-white' : 'text-white/60'}`}>
              Yearly <span className="text-green-400 text-sm">(Save 16%)</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border ${
                plan.popular ? 'border-blue-400 shadow-xl shadow-blue-500/20' : 'border-white/20'
              } hover:border-blue-400/50 transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-white/60 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold text-white">
                      {isYearly ? plan.yearlyPrice : plan.price}
                    </span>
                    {plan.price !== "$0" && (
                      <span className="text-white/60 ml-2">
                        /{isYearly ? 'year' : plan.period}
                      </span>
                    )}
                  </div>
                  {isYearly && plan.price !== "$0" && (
                    <p className="text-green-400 text-sm mt-2">
                      Save ${(parseInt(plan.price.slice(1)) * 12 - parseInt(plan.yearlyPrice.slice(1)))} per year
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-white/80 text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.gradient} hover:scale-105 shadow-lg`
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Can I change plans anytime?</h3>
              <p className="text-white/70">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">What happens to my data if I cancel?</h3>
              <p className="text-white/70">Your conversation history remains accessible for 30 days after cancellation, giving you time to export if needed.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Is there a student discount?</h3>
              <p className="text-white/70">Yes! Students get 50% off any paid plan with a valid .edu email address.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">How does the points system work?</h3>
              <p className="text-white/70">Earn points by engaging with AI conversations and providing thoughtful responses. Use points to unlock additional chats on the Free plan.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 