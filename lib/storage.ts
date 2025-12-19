
export interface MoodEntry {
  id: string;
  level: number;
  label: string;
  emoji: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Appointment {
  id: string;
  expertId: number;
  expertName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  timestamp: string;
}

export interface SavedResource {
  id: string;
  resourceId: number; // Original resource ID from the resources page
  title: string;
  type: 'document' | 'audio' | 'video';
  url: string;
  viewCount: number;
  lastViewed: string; // ISO timestamp of last view
  timestamp: string; // ISO timestamp of first view
}

export interface JournalEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[]; // Base64 or URLs
  timestamp: string;
}

export interface DiagnosticResult {
  id: string;
  toolId: string;
  toolName: string;
  answers: any;
  score: number;
  interpretation?: string;
  timestamp: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  type: "document" | "audio" | "video";
  checked: boolean;
  icon: string;
  // Detail fields
  pages?: number;
  currentPage?: number;
  fileName: string;
  fileUrl: string;
  duration?: string;
  currentTime?: string;
  // Stats
  viewCount: number;
  lastViewed?: string;
}

export interface JournalSettings {
  aiAccess: boolean;
}

export interface UserData {
  profile: {
    name: string;
    email: string;
    joinedAt: string;
  } | null;
  moods: MoodEntry[];
  conversations: {
    lastUpdated: string;
    messages: ChatMessage[];
  };
  appointments: Appointment[];
  savedResources: SavedResource[];
  expertsContacted: number[]; // Array of expert IDs
  journals: JournalEntry[];
  journalSettings: JournalSettings;
  resources: Resource[];
  diagnostics: DiagnosticResult[];
}

const STORAGE_KEY = 'ina_user_data';

const getInitialData = (): UserData => ({
  profile: null,
  moods: [],
  conversations: {
    lastUpdated: new Date().toISOString(),
    messages: [],
  },
  appointments: [],
  savedResources: [],
  expertsContacted: [],
  journals: [],
  journalSettings: {
    aiAccess: false,
  },
  resources: [
    {
      id: 1,
      title: "Les déterminants de la santé mentale",
      description: "Techniques de gestion du stress quotidien",
      type: "document",
      checked: false,
      icon: "document",
      pages: 12,
      currentPage: 1,
      fileName: "guide-stress.pdf",
      fileUrl: "/docs/determinants-sante-mentale.pdf",
      viewCount: 0
    },
    {
      id: 2,
      title: "Guide Santé",
      description: "PDF avec exercices de respiration profonde",
      type: "document",
      checked: true,
      icon: "document",
      pages: 8,
      currentPage: 1,
      fileName: "exercices-respiration.pdf",
      fileUrl: "/docs/guide_sante.pdf",
      viewCount: 0
    },
    {
      id: 5,
      title: "Méditation Guidée",
      type: "audio",
      description: "Séance de méditation de 15 minutes",
      checked: false,
      icon: "audio",
      duration: "15:00",
      currentTime: "00:00",
      fileName: "meditation-guidee.mp3",
      fileUrl: "/audio/podcast_v1.mp3",
      viewCount: 0
    },
    {
      id: 6,
      title: "Parlons de la Santé Mentale",
      type: "audio",
      description: "Sons naturels pour détente",
      checked: true,
      icon: "audio",
      duration: "30:00",
      currentTime: "00:00",
      fileName: "sons-relaxation.mp3",
      fileUrl: "/audio/podcast_v2.mp3",
      viewCount: 0
    },
    {
      id: 7,
      title: "Avoir le Courage d'en Parler!",
      type: "video",
      description: "Séance complète pour l'anxiété",
      checked: false,
      icon: "video",
      duration: "25:00",
      currentTime: "00:00",
      fileName: "sante_mental_v1.mp4",
      fileUrl: "/video/sante_mental_v1.mp4",
      viewCount: 0
    },
    {
      id: 8,
      title: "Pleine Conscience",
      type: "video",
      description: "Introduction à la pleine conscience",
      checked: true,
      icon: "video",
      duration: "20:00",
      currentTime: "00:00",
      fileName: "sante_mental_v2.mp4",
      fileUrl: "/video/sante_mental_v2.mp4",
      viewCount: 0
    },
  ],
  diagnostics: []
});

export const Storage = {
  getData: (): UserData => {
    if (typeof window === 'undefined') return getInitialData();
    const dataStr = localStorage.getItem(STORAGE_KEY);
    if (!dataStr) return getInitialData();
    
    const data = JSON.parse(dataStr);
    const initial = getInitialData();
    
    // Simple migration: ensure new keys exist
    return {
      ...initial,
      ...data,
      conversations: {
        ...initial.conversations,
        ...data.conversations
      },
      journalSettings: {
        ...initial.journalSettings,
        ...(data.journalSettings || {})
      }
    };
  },

  saveData: (data: UserData) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  // Moods
  addMood: (level: number, label: string, emoji: string) => {
    const data = Storage.getData();
    const newMood: MoodEntry = {
      id: Math.random().toString(36).substr(2, 9),
      level,
      label,
      emoji,
      timestamp: new Date().toISOString(),
    };
    data.moods.push(newMood);
    Storage.saveData(data);
    return newMood;
  },

  // Chat
  saveChatHistory: (messages: ChatMessage[]) => {
    const data = Storage.getData();
    data.conversations = {
      lastUpdated: new Date().toISOString(),
      messages,
    };
    Storage.saveData(data);
  },

  getResources: () => {
    return Storage.getData().resources;
  },

  getResourceById: (id: number) => {
    return Storage.getData().resources.find(r => r.id === id) || null;
  },

  // Appointments
  addAppointment: (appointment: Omit<Appointment, 'id' | 'timestamp'>) => {
    const data = Storage.getData();
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    data.appointments.push(newAppointment);
    
    // Also track as experts contacted if not already there
    if (!data.expertsContacted.includes(appointment.expertId)) {
      data.expertsContacted.push(appointment.expertId);
    }
    
    Storage.saveData(data);
    return newAppointment;
  },

  // Resources
  trackResourceView: (resourceId: number, title: string, type: 'document' | 'audio' | 'video', url: string) => {
    const data = Storage.getData();
    const existing = data.savedResources.find(r => r.resourceId === resourceId);
    
    if (existing) {
      // Update existing resource
      existing.viewCount += 1;
      existing.lastViewed = new Date().toISOString();
    } else {
      // Create new resource entry
      const newResource: SavedResource = {
        id: Math.random().toString(36).substr(2, 9),
        resourceId,
        title,
        type,
        url,
        viewCount: 1,
        lastViewed: new Date().toISOString(),
        timestamp: new Date().toISOString(),
      };
      data.savedResources.push(newResource);
    }
    
    // Also update the main resource entry
    const res = data.resources.find(r => r.id === resourceId);
    if (res) {
      res.viewCount += 1;
      res.lastViewed = new Date().toISOString();
    }
    
    Storage.saveData(data);
  },

  getViewedResources: () => {
    return Storage.getData().savedResources;
  },

  getUserContext: () => {
    const data = Storage.getData();
    
    // Get recent moods (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentMoods = data.moods.filter(m => new Date(m.timestamp) > sevenDaysAgo);
    
    // Calculate dominant mood
    const moodCounts: Record<string, number> = {};
    recentMoods.forEach(m => {
      moodCounts[m.label] = (moodCounts[m.label] || 0) + 1;
    });
    const dominantMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutre';
    
    // Get resource stats
    const resourceTypes = { document: 0, audio: 0, video: 0 };
    data.savedResources.forEach(r => {
      resourceTypes[r.type] = (resourceTypes[r.type] || 0) + r.viewCount;
    });
    
    // Get recent resources (last 5)
    const recentResources = [...data.savedResources]
      .sort((a, b) => new Date(b.lastViewed).getTime() - new Date(a.lastViewed).getTime())
      .slice(0, 5);
    
    return {
      moodTrends: {
        recentMoods,
        dominantMood,
        moodCount: recentMoods.length,
      },
      viewedResources: {
        types: resourceTypes,
        recentResources,
        totalViews: data.savedResources.reduce((sum, r) => sum + r.viewCount, 0),
      },
      diagnostics: data.diagnostics,
      hasExpert: data.expertsContacted.length > 0 || data.appointments.some(a => a.status === 'confirmed')
    };
  },

  saveResource: (resource: Omit<SavedResource, 'id' | 'timestamp'>) => {
    const data = Storage.getData();
    const newResource: SavedResource = {
      ...resource,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    data.savedResources.push(newResource);
    Storage.saveData(data);
    return newResource;
  },

  // Journals
  addJournal: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const data = Storage.getData();
    const newEntry: JournalEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    data.journals.unshift(newEntry); // Latest first
    Storage.saveData(data);
    return newEntry;
  },

  getJournals: () => {
    return Storage.getData().journals;
  },

  updateJournal: (id: string, updates: Partial<JournalEntry>) => {
    const data = Storage.getData();
    const index = data.journals.findIndex(j => j.id === id);
    if (index !== -1) {
      data.journals[index] = { ...data.journals[index], ...updates };
      Storage.saveData(data);
      return data.journals[index];
    }
    return null;
  },

  deleteJournal: (id: string) => {
    const data = Storage.getData();
    data.journals = data.journals.filter(j => j.id !== id);
    Storage.saveData(data);
  },

  setJournalAiAccess: (access: boolean) => {
    const data = Storage.getData();
    data.journalSettings.aiAccess = access;
    Storage.saveData(data);
  },

  getJournalAiAccess: () => {
    return Storage.getData().journalSettings.aiAccess;
  },

  updateResourceProgress: (id: number, updates: { currentTime?: string, currentPage?: number }) => {
    const data = Storage.getData();
    const res = data.resources.find(r => r.id === id);
    if (res) {
      if (updates.currentTime !== undefined) res.currentTime = updates.currentTime;
      if (updates.currentPage !== undefined) res.currentPage = updates.currentPage;
      Storage.saveData(data);
    }
  },

  // Export as JSON
  exportDataJSON: () => {
    const data = Storage.getData();
    return JSON.stringify(data, null, 2);
  },

  // Diagnostics
  addDiagnosticResult: (result: Omit<DiagnosticResult, 'id' | 'timestamp'>) => {
    const data = Storage.getData();
    const newResult: DiagnosticResult = {
      ...result,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    data.diagnostics.push(newResult);
    Storage.saveData(data);
    return newResult;
  },

  getDiagnostics: () => {
    return Storage.getData().diagnostics;
  }
};
