'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { SensayAPI } from '@/sensay-sdk';
import { API_VERSION } from '@/constants/auth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Subject {
  id: string;
  name: string;
  teacher: string;
  greeting: string;
  systemMessage: string;
}

const subjects: Record<string, Subject> = {
  philosophy: {
    id: 'philosophy',
    name: 'Philosophy',
    teacher: 'Dr. Evelyn Harper',
    greeting: "Welcome! I'm Dr. Evelyn Harper, your philosophy teacher. What philosophical question intrigues you today?",
    systemMessage: "You are Dr. Evelyn Harper, a philosophy professor who uses the Socratic method to teach. Your goal is to guide students through thoughtful questioning, helping them develop critical thinking skills and deeper understanding of philosophical concepts. Always maintain a warm, encouraging tone while challenging students to think deeply about their ideas."
  },
  literature: {
    id: 'literature',
    name: 'Literature',
    teacher: 'Prof. James Wilson',
    greeting: "Hello! I'm Professor James Wilson, your literature guide. What literary work would you like to explore today?",
    systemMessage: "You are Professor James Wilson, a literature expert who specializes in analyzing and discussing literary works. Your teaching style combines close reading with historical context and critical theory. Guide students through thoughtful analysis of texts while encouraging them to develop their own interpretations and insights."
  },
  history: {
    id: 'history',
    name: 'History',
    teacher: 'Dr. Sarah Chen',
    greeting: "Greetings! I'm Dr. Sarah Chen, your history teacher. Which historical period or event would you like to learn about?",
    systemMessage: "You are Dr. Sarah Chen, a history professor who brings historical events and periods to life through engaging storytelling and critical analysis. Help students understand historical contexts, cause-and-effect relationships, and the impact of past events on the present. Encourage them to think critically about historical sources and interpretations."
  }
};

export default function ChatPage({ params }: { params: { subject: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replicaUuid, setReplicaUuid] = useState<string | null>(null);

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
    if (subject) {
      initializeReplica();
    }
  }, [subject]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initializeReplica = async () => {
    if (!subject) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      // Initialize organization-only client
      const orgClient = new SensayAPI({
        HEADERS: {
          'X-ORGANIZATION-SECRET': process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET
        }
      });

      // Check if user exists in Sensay
      let userExists = false;
      try {
        await orgClient.users.getV1Users(user.uid);
        userExists = true;
      } catch (error) {
        console.log('User does not exist in Sensay, will create');
      }

      // Create user if needed
      if (!userExists) {
        await orgClient.users.postV1Users(API_VERSION, {
          id: user.uid,
          email: user.email || `${user.uid}@example.com`,
          name: user.displayName || 'User'
        });
      }

      // Initialize user-authenticated client
      const userClient = new SensayAPI({
        HEADERS: {
          'X-ORGANIZATION-SECRET': process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET,
          'X-USER-ID': user.uid
        }
      });

      // List replicas
      const replicas = await userClient.replicas.getV1Replicas();
      let uuid: string | undefined;

      // Look for existing replica
      if (replicas.items && replicas.items.length > 0) {
        const existingReplica = replicas.items.find(r => r.slug === subject.id);
        if (existingReplica) {
          uuid = existingReplica.uuid;
        }
      }

      // Create replica if it doesn't exist
      if (!uuid) {
        const newReplica = await userClient.replicas.postV1Replicas(API_VERSION, {
          name: subject.teacher,
          shortDescription: `${subject.name} teacher using the Socratic method`,
          greeting: subject.greeting,
          slug: subject.id,
          ownerID: user.uid,
          llm: {
            model: 'claude-3-7-sonnet-latest',
            memoryMode: 'prompt-caching',
            systemMessage: subject.systemMessage
          }
        });
        uuid = newReplica.uuid;
      }

      setReplicaUuid(uuid);
      setMessages([{
        role: 'assistant',
        content: subject.greeting,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error('Error initializing replica:', error);
      setError('Failed to initialize chat. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !replicaUuid) return;

    const user = auth.currentUser;
    if (!user) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      const userClient = new SensayAPI({
        HEADERS: {
          'X-ORGANIZATION-SECRET': process.env.NEXT_PUBLIC_SENSAY_API_KEY_SECRET,
          'X-USER-ID': user.uid
        }
      });

      const response = await userClient.chatCompletions.postV1ReplicasChatCompletions(
        replicaUuid,
        API_VERSION,
        {
          content: inputValue,
          source: 'web',
          skip_chat_history: false
        }
      );

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#a7a9be]">Subject not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0e17] flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1a2e] border-b border-[#2a2a3e] p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{subject.teacher}</h1>
            <p className="text-[#a7a9be]">{subject.name}</p>
          </div>
          <button
            onClick={() => router.push('/subjects')}
            className="btn btn-secondary"
          >
            Change Subject
          </button>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-[#ff8906] text-white'
                    : 'bg-[#1a1a2e] text-[#fffffe]'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-[#1a1a2e] border-t border-[#2a2a3e] p-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-4 py-2 rounded-lg bg-[#0f0e17] border border-[#2a2a3e] focus:border-[#ff8906] focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
} 