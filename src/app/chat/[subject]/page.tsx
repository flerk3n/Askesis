'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { subjects } from '@/constants/subjects';
import { getGeminiResponse } from '@/lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage({ params }: { params: { subject: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const subject = subjects[params.subject];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add initial greeting when the component mounts
  useEffect(() => {
    if (subject && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: subject.greeting
      }]);
    }
  }, [subject, messages.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    setError(null);
    
    // Add user message to chat
    const userMessage: Message = {
      role: 'user',
      content: inputValue,
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Get response from Gemini API
      const response = await getGeminiResponse(params.subject, [...messages, userMessage]);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      // Remove the user message if there was an error
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
          <p className="text-gray-600 mb-4">The requested subject does not exist.</p>
          <button
            onClick={() => router.push('/subjects')}
            className="btn btn-primary"
          >
            Back to Subjects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#0f0e17] border-b border-[#2a2a3e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#fffffe]">
              {subject.name} Tutor
            </h1>
            <button
              onClick={() => router.push('/subjects')}
              className="btn btn-secondary"
            >
              Back to Subjects
            </button>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4">
        <div className="bg-[#1a1a2e] rounded-lg shadow-lg h-[calc(100vh-12rem)] flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-[#ff8906] text-white'
                      : 'bg-[#2a2a3e] text-[#a7a9be]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#2a2a3e] text-[#a7a9be] rounded-lg p-3">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-[#2a2a3e]">
            <div className="relative">
              <textarea
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="w-full p-3 pr-20 border border-[#2a2a3e] rounded-lg bg-[#1a1a2e] text-[#fffffe] focus:outline-none focus:ring-2 focus:ring-[#ff8906] min-h-[100px]"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="absolute right-2 bottom-2 bg-[#ff8906] text-white px-4 py-2 rounded-md hover:bg-[#ff8906]/90 transition-colors"
                disabled={isLoading || !inputValue.trim()}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
} 