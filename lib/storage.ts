
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
  title: string;
  type: string;
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  images: string[]; // Base64 or URLs
  timestamp: string;
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

  // Export as JSON
  exportDataJSON: () => {
    const data = Storage.getData();
    return JSON.stringify(data, null, 2);
  }
};
