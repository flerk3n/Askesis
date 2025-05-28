export interface Subject {
  id: string;
  name: string;
  teacher: string;
  greeting: string;
  description: string;
}

export const subjects: Record<string, Subject> = {
  philosophy: {
    id: 'philosophy',
    name: 'Philosophy',
    teacher: 'Dr. Evelyn Harper',
    greeting: "Welcome! I'm Dr. Evelyn Harper, your philosophy teacher. What philosophical question intrigues you today?",
    description: "Explore fundamental questions about existence, knowledge, and ethics with our AI philosophy teacher."
  },
  literature: {
    id: 'literature',
    name: 'Literature',
    teacher: 'Prof. James Wilson',
    greeting: "Hello! I'm Professor James Wilson, your literature guide. What literary work would you like to explore today?",
    description: "Dive into classic and contemporary works with our AI literature expert."
  },
  history: {
    id: 'history',
    name: 'History',
    teacher: 'Dr. Sarah Chen',
    greeting: "Greetings! I'm Dr. Sarah Chen, your history teacher. Which historical period or event would you like to learn about?",
    description: "Journey through time and explore significant events with our AI history teacher."
  }
}; 