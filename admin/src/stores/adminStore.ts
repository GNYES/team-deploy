import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SalaryConfig, User, Team, DeployRecord, IncomeRecord, Achievement, DailyTask, SystemStats, CommissionTier } from '@/types';

interface AdminStore {
  salaryConfig: SalaryConfig;
  users: User[];
  teams: Team[];
  deployRecords: DeployRecord[];
  incomeRecords: IncomeRecord[];
  achievements: Achievement[];
  dailyTasks: DailyTask[];
  
  updateSalaryConfig: (config: Partial<SalaryConfig>) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, data: Partial<Team>) => void;
  addDeployRecord: (record: Omit<DeployRecord, 'id'>) => void;
  importUsers: (users: Partial<User>[]) => void;
  importDeployRecords: (records: Partial<DeployRecord>[]) => void;
  importTeams: (teams: Partial<Team>[]) => void;
  exportData: (type: 'users' | 'teams' | 'records' | 'salary') => any[];
  calculateIncome: (devices: number, rings: number) => IncomeRecord;
  getStats: () => SystemStats;
}

const defaultSalaryConfig: SalaryConfig = {
  id: 'default',
  name: '默认工资配置',
  baseSalary: 3000,
  devicePrice: 100,
  ringPrice: 50,
  deviceCommissionRates: [
    { min: 1, max: 10, rate: 0.1 },
    { min: 11, max: 30, rate: 0.15 },
    { min: 31, max: Infinity, rate: 0.2 },
  ],
  ringCommissionRate: 0.1,
  target: 20,
  bonusTarget: 50,
  bonusAmount: 1000,
  targetBonus: 500,
  active: true,
  updatedAt: new Date().toISOString(),
};

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      salaryConfig: defaultSalaryConfig,
      users: [
        { id: '1', name: '王建国', phone: '13800138001', team: '华东战队', role: 'leader', devices: 45, rings: 23, createdAt: '2024-01-01' },
        { id: '2', name: '李明辉', phone: '13800138002', team: '华南战队', role: 'leader', devices: 42, rings: 21, createdAt: '2024-01-01' },
        { id: '3', name: '张伟', phone: '13800138003', team: '华东战队', role: 'member', devices: 38, rings: 19, createdAt: '2024-01-02' },
        { id: '4', name: '刘强', phone: '13800138004', team: '华北战队', role: 'leader', devices: 35, rings: 17, createdAt: '2024-01-02' },
        { id: '5', name: '陈刚', phone: '13800138005', team: '西南战队', role: 'member', devices: 32, rings: 15, createdAt: '2024-01-03' },
        { id: '6', name: '赵磊', phone: '13800138006', team: '华东战队', role: 'member', devices: 28, rings: 14, createdAt: '2024-01-03' },
        { id: '7', name: '孙鹏', phone: '13800138007', team: '华南战队', role: 'member', devices: 25, rings: 12, createdAt: '2024-01-04' },
        { id: '8', name: '周涛', phone: '13800138008', team: '华北战队', role: 'member', devices: 22, rings: 11, createdAt: '2024-01-04' },
        { id: '9', name: '吴昊', phone: '13800138009', team: '西南战队', role: 'member', devices: 20, rings: 10, createdAt: '2024-01-05' },
        { id: '10', name: '郑鑫', phone: '13800138010', team: '西北战队', role: 'leader', devices: 18, rings: 9, createdAt: '2024-01-05' },
      ],
      teams: [
        { id: '1', name: '华东战队', leader: '王建国', members: 3, devices: 111, rings: 56, region: '华东' },
        { id: '2', name: '华南战队', leader: '李明辉', members: 2, devices: 67, rings: 33, region: '华南' },
        { id: '3', name: '华北战队', leader: '刘强', members: 2, devices: 57, rings: 28, region: '华北' },
        { id: '4', name: '西南战队', leader: '陈刚', members: 2, devices: 52, rings: 25, region: '西南' },
        { id: '5', name: '西北战队', leader: '郑鑫', members: 1, devices: 18, rings: 9, region: '西北' },
      ],
      deployRecords: [
        { id: '1', userId: '1', userName: '王建国', team: '华东战队', date: '2024-01-15', devices: 5, rings: 3, location: '上海市浦东新区' },
        { id: '2', userId: '2', userName: '李明辉', team: '华南战队', date: '2024-01-15', devices: 4, rings: 2, location: '广州市天河区' },
        { id: '3', userId: '3', userName: '张伟', team: '华东战队', date: '2024-01-15', devices: 3, rings: 2, location: '杭州市西湖区' },
        { id: '4', userId: '1', userName: '王建国', team: '华东战队', date: '2024-01-14', devices: 4, rings: 2, location: '上海市静安区' },
        { id: '5', userId: '2', userName: '李明辉', team: '华南战队', date: '2024-01-14', devices: 3, rings: 2, location: '深圳市南山区' },
      ],
      incomeRecords: [],
      achievements: [
        { id: '1', name: '初露锋芒', description: '铺设第一台设备', icon: '🌟', requirement: 1, type: 'devices', reward: 50 },
        { id: '2', name: '小有名气', description: '铺设10台设备', icon: '⭐', requirement: 10, type: 'devices', reward: 100 },
        { id: '3', name: '铺设达人', description: '铺设50台设备', icon: '🏆', requirement: 50, type: 'devices', reward: 300 },
        { id: '4', name: '铺设大师', description: '铺设100台设备', icon: '👑', requirement: 100, type: 'devices', reward: 500 },
        { id: '5', name: '蓝环收集者', description: '铺设50个蓝环', icon: '💎', requirement: 50, type: 'rings', reward: 200 },
        { id: '6', name: '团队之星', description: '获得团队排名第一', icon: '🌈', requirement: 1, type: 'team', reward: 1000 },
      ],
      dailyTasks: [
        { id: '1', title: '铺设任务', description: '每日铺设设备目标', target: 5, reward: 100, active: true },
        { id: '2', title: '蓝环任务', description: '每日铺设蓝环目标', target: 10, reward: 50, active: true },
      ],

      updateSalaryConfig: (config) => {
        set((state) => ({
          salaryConfig: { ...state.salaryConfig, ...config, updatedAt: new Date().toISOString() },
        }));
      },

      addUser: (user) => {
        const newUser: User = {
          ...user,
          id: 'user_' + Date.now(),
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({ users: [...state.users, newUser] }));
      },

      updateUser: (id, data) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
      },

      addTeam: (team) => {
        const newTeam: Team = { ...team, id: 'team_' + Date.now() };
        set((state) => ({ teams: [...state.teams, newTeam] }));
      },

      updateTeam: (id, data) => {
        set((state) => ({
          teams: state.teams.map((t) => (t.id === id ? { ...t, ...data } : t)),
        }));
      },

      addDeployRecord: (record) => {
        const newRecord: DeployRecord = { ...record, id: 'record_' + Date.now() };
        set((state) => ({ deployRecords: [...state.deployRecords, newRecord] }));
      },

      importUsers: (users) => {
        const newUsers = users.map((u, idx) => ({
          id: 'imported_' + Date.now() + '_' + idx,
          name: u.name || '未命名',
          phone: u.phone || '',
          team: u.team || '默认团队',
          role: u.role || 'member',
          devices: u.devices || 0,
          rings: u.rings || 0,
          createdAt: u.createdAt || new Date().toISOString().split('T')[0],
        }));
        set((state) => ({ users: [...state.users, ...newUsers] }));
      },

      importDeployRecords: (records) => {
        const newRecords = records.map((r, idx) => ({
          id: 'imported_' + Date.now() + '_' + idx,
          userId: r.userId || '',
          userName: r.userName || '未知',
          team: r.team || '默认团队',
          date: r.date || new Date().toISOString().split('T')[0],
          devices: r.devices || 0,
          rings: r.rings || 0,
          location: r.location || '未指定',
          note: r.note,
        }));
        set((state) => ({ deployRecords: [...state.deployRecords, ...newRecords] }));
      },

      importTeams: (teams) => {
        const newTeams = teams.map((t, idx) => ({
          id: 'imported_' + Date.now() + '_' + idx,
          name: t.name || '未命名团队',
          leader: t.leader || '',
          members: t.members || 0,
          devices: t.devices || 0,
          rings: t.rings || 0,
          region: t.region || '未知',
        }));
        set((state) => ({ teams: [...state.teams, ...newTeams] }));
      },

      exportData: (type) => {
        const state = get();
        switch (type) {
          case 'users': return state.users;
          case 'teams': return state.teams;
          case 'records': return state.deployRecords;
          case 'salary': return [state.salaryConfig];
          default: return [];
        }
      },

      calculateIncome: (devices, rings) => {
        const config = get().salaryConfig;
        let deviceCommission = 0;
        let remainingDevices = devices;

        for (const tier of config.deviceCommissionRates) {
          if (remainingDevices <= 0) break;
          const inThisTier = Math.min(remainingDevices, tier.max === Infinity ? remainingDevices : tier.max - tier.min + 1);
          deviceCommission += inThisTier * config.devicePrice * tier.rate;
          remainingDevices -= inThisTier;
        }

        const ringCommission = rings * config.ringPrice * config.ringCommissionRate;
        let bonus = 0;
        if (devices >= config.target) bonus += config.targetBonus;
        if (devices >= config.bonusTarget) bonus += config.bonusAmount;

        const grossIncome = config.baseSalary + deviceCommission + ringCommission + bonus;
        const tax = grossIncome > 5000 ? grossIncome * 0.1 : 0;
        const netIncome = grossIncome - tax;

        return {
          id: 'income_' + Date.now(),
          userId: '',
          userName: '',
          team: '',
          month: new Date().toISOString().slice(0, 7),
          baseSalary: config.baseSalary,
          deviceCommission,
          ringCommission,
          bonus,
          grossIncome,
          tax,
          netIncome,
        };
      },

      getStats: () => {
        const state = get();
        return {
          totalUsers: state.users.length,
          totalDevices: state.users.reduce((acc, u) => acc + u.devices, 0),
          totalRings: state.users.reduce((acc, u) => acc + u.rings, 0),
          totalTeams: state.teams.length,
          monthIncome: state.users.reduce((acc, u) => {
            const income = state.calculateIncome(u.devices, u.rings);
            return acc + income.netIncome;
          }, 0),
        };
      },
    }),
    { name: 'team-deploy-admin' }
  )
);
