export interface SalaryConfig {
  id: string;
  name: string;
  baseSalary: number;
  devicePrice: number;
  ringPrice: number;
  deviceCommissionRates: CommissionTier[];
  ringCommissionRate: number;
  target: number;
  bonusTarget: number;
  bonusAmount: number;
  targetBonus: number;
  active: boolean;
  updatedAt: string;
}

export interface CommissionTier {
  min: number;
  max: number;
  rate: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  team: string;
  role: 'member' | 'leader' | 'admin';
  devices: number;
  rings: number;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  leader: string;
  members: number;
  devices: number;
  rings: number;
  region: string;
}

export interface DeployRecord {
  id: string;
  userId: string;
  userName: string;
  team: string;
  date: string;
  devices: number;
  rings: number;
  location: string;
  note?: string;
}

export interface IncomeRecord {
  id: string;
  userId: string;
  userName: string;
  team: string;
  month: string;
  baseSalary: number;
  deviceCommission: number;
  ringCommission: number;
  bonus: number;
  grossIncome: number;
  tax: number;
  netIncome: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: 'devices' | 'rings' | 'team';
  reward: number;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  target: number;
  reward: number;
  active: boolean;
}

export interface SystemStats {
  totalUsers: number;
  totalDevices: number;
  totalRings: number;
  totalTeams: number;
  monthIncome: number;
}

export interface DeviceRecord {
  id: string;
  userName: string;
  phone: string;
  team: string;
  date: string;
  checkInCount: number;
  onlineDays30: number;
  onlineDays10: number;
  onlinePersons20: number;
  deviceCount: number;
  status: 'qualified' | 'unqualified' | 'not_started';
  note?: string;
}

export interface DeviceAnalysis {
  id: string;
  analysisDate: string;
  period: string;
  totalUsers: number;
  qualifiedUsers: number;
  unqualifiedUsers: number;
  notStartedUsers: number;
  qualificationRate: number;
  records: DeviceRecord[];
}

export interface SalaryCalculation {
  userId: string;
  userName: string;
  team: string;
  baseSalary: number;
  deviceCount: number;
  devicePrice: number;
  deviceTotal: number;
  grossSalary: number;
  status: 'qualified' | 'unqualified' | 'not_started';
  qualifiedConditions: string[];
  unqualifiedConditions: string[];
}
