import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NetworkPerson {
  id: number;
  name: string;
  company: string;
  position: string;
  expertise: string;
  connectionType: 'connected' | 'mutual' | 'suggested';
  avatar: string;
  lastSeen: string;
  status: 'online' | 'away' | 'offline';
  bio?: string;
  interests?: string[];
}

interface NetworkingContextType {
  people: NetworkPerson[];
  matches: NetworkPerson[];
  conversations: { [key: number]: Message[] };
  connectWithPerson: (personId: number) => void;
  sendMessage: (personId: number, message: string) => void;
  scanQRCode: () => void;
  shareQRCode: () => void;
  isConnected: (personId: number) => boolean;
}

interface Message {
  id: string;
  senderId: number | 'me';
  message: string;
  timestamp: Date;
}

const NetworkingContext = createContext<NetworkingContextType | undefined>(undefined);

const MOCK_PEOPLE: NetworkPerson[] = [
  {
    id: 1,
    name: 'Dr. Mehmet Yılmaz',
    company: 'TechCorp',
    position: 'CTO',
    expertise: 'Yapay Zeka, Machine Learning',
    connectionType: 'mutual',
    avatar: '👨‍💼',
    lastSeen: '2 saat önce',
    status: 'online',
    bio: 'AI ve teknoloji alanında 15 yıllık deneyim. Startup ekosisteminde aktif.',
    interests: ['Yapay Zeka', 'Startup', 'Teknoloji']
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    company: 'İnovaLab',
    position: 'Product Manager',
    expertise: 'AR/VR, UX Design',
    connectionType: 'suggested',
    avatar: '👩‍💼',
    lastSeen: '1 gün önce',
    status: 'offline',
    bio: 'İnovatif ürün tasarımı ve kullanıcı deneyimi uzmanı.',
    interests: ['UX Design', 'AR/VR', 'İnovasyon']
  },
  {
    id: 3,
    name: 'Can Özkan',
    company: 'DataSoft',
    position: 'Data Scientist',
    expertise: 'Büyük Veri, Analytics',
    connectionType: 'connected',
    avatar: '👨‍💻',
    lastSeen: 'Şimdi',
    status: 'online',
    bio: 'Veri bilimi ve analitik çözümler konusunda uzman.',
    interests: ['Veri Bilimi', 'Machine Learning', 'Analytics']
  },
  {
    id: 4,
    name: 'Zeynep Kaya',
    company: 'CloudTech',
    position: 'DevOps Engineer',
    expertise: 'Cloud Computing, Kubernetes',
    connectionType: 'suggested',
    avatar: '👩‍💻',
    lastSeen: '30 dakika önce',
    status: 'away',
    bio: 'Cloud teknolojileri ve DevOps süreçleri uzmanı.',
    interests: ['Cloud Computing', 'DevOps', 'Kubernetes']
  },
  {
    id: 5,
    name: 'Emre Şahin',
    company: 'CryptoBase',
    position: 'Blockchain Developer',
    expertise: 'Blockchain, DeFi',
    connectionType: 'suggested',
    avatar: '👨‍🔬',
    lastSeen: '1 saat önce',
    status: 'online',
    bio: 'Blockchain teknolojileri ve kripto para sistemleri geliştiricisi.',
    interests: ['Blockchain', 'DeFi', 'Cryptocurrency']
  },
  {
    id: 6,
    name: 'Selin Yılmaz',
    company: 'EcomPlus',
    position: 'Marketing Director',
    expertise: 'Digital Marketing, E-commerce',
    connectionType: 'suggested',
    avatar: '👩‍🎨',
    lastSeen: '3 saat önce',
    status: 'away',
    bio: 'Dijital pazarlama ve e-ticaret stratejileri uzmanı.',
    interests: ['Digital Marketing', 'E-commerce', 'Growth Hacking']
  }
];

export function NetworkingProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<NetworkPerson[]>(MOCK_PEOPLE);
  const [matches, setMatches] = useState<NetworkPerson[]>([]);
  const [conversations, setConversations] = useState<{ [key: number]: Message[] }>({});

  const connectWithPerson = (personId: number) => {
    setPeople(prevPeople =>
      prevPeople.map(person =>
        person.id === personId
          ? { ...person, connectionType: 'connected' }
          : person
      )
    );

    const person = people.find(p => p.id === personId);
    if (person && !matches.find(m => m.id === personId)) {
      setMatches(prevMatches => [...prevMatches, { ...person, connectionType: 'connected' }]);
    }
  };

  const sendMessage = (personId: number, message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      message,
      timestamp: new Date()
    };

    setConversations(prev => ({
      ...prev,
      [personId]: [...(prev[personId] || []), newMessage]
    }));

    // Simulate response after 2 seconds
    setTimeout(() => {
      const person = people.find(p => p.id === personId);
      const responses = [
        'Merhaba! Nasılsınız?',
        'Fuar nasıl geçiyor?',
        'İş birliği fırsatları konuşabilir miyiz?',
        'Projelerinizden bahseder misiniz?',
        'Teşekkürler, çok ilginç!',
        'Kesinlikle! Detayları konuşalım.'
      ];

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        senderId: personId,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };

      setConversations(prev => ({
        ...prev,
        [personId]: [...(prev[personId] || []), responseMessage]
      }));
    }, 2000);
  };

  const scanQRCode = () => {
    // Simulate QR code scanning
    const randomPerson = MOCK_PEOPLE[Math.floor(Math.random() * MOCK_PEOPLE.length)];
    if (!matches.find(m => m.id === randomPerson.id)) {
      setMatches(prevMatches => [...prevMatches, randomPerson]);
      connectWithPerson(randomPerson.id);
    }
  };

  const shareQRCode = () => {
    // QR code sharing logic (already implemented in profile)
  };

  const isConnected = (personId: number) => {
    const person = people.find(p => p.id === personId);
    return person?.connectionType === 'connected';
  };

  const value = {
    people,
    matches,
    conversations,
    connectWithPerson,
    sendMessage,
    scanQRCode,
    shareQRCode,
    isConnected
  };

  return (
    <NetworkingContext.Provider value={value}>
      {children}
    </NetworkingContext.Provider>
  );
}

export function useNetworking() {
  const context = useContext(NetworkingContext);
  if (context === undefined) {
    throw new Error('useNetworking must be used within a NetworkingProvider');
  }
  return context;
}