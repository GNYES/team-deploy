export interface User {
  id: string;
  name: string;
  phone: string;
  team: string;
  role: 'member' | 'leader' | 'admin';
  avatar?: string;
}

export interface SalaryConfig {
  id: string;
  name: string;
  baseSalary: number;
  devicePrice: number;
  ringPrice: number;
  deviceCommissionRates: { min: number; max: number; rate: number }[];
  ringCommissionRate: number;
  target: number;
  bonusTarget: number;
  bonusAmount: number;
  targetBonus: number;
  active: boolean;
}

export interface DeployRecord {
  id: string;
  userId: string;
  date: string;
  devices: number;
  rings: number;
  location: string;
  note?: string;
}

export interface TeamRanking {
  id: string;
  name: string;
  devices: number;
  rings: number;
  members: number;
  rank: number;
}

export interface DailyTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
  reward: number;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
  liked: boolean;
}

export interface ProgressData {
  date: string;
  devices: number;
  rings: number;
}
