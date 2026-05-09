import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, DeployRecord, SalaryConfig, TeamRanking, DailyTask, Badge, Post } from '@/types';

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  register: (name: string, phone: string, password: string, team: string) => Promise<boolean>;
  logout: () => void;
  updateStats: (devices: number, rings: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      login: async (phone, password) => {
        if (password.length >= 6) {
          const user: User = {
            id: 'user_' + Date.now(),
            name: phone.slice(-4) === '8888' ? '管理员' : '团队成员',
            phone,
            team: '默认团队',
            role: phone.slice(-4) === '8888' ? 'admin' : 'member',
          };
          set({ user, isLoggedIn: true });
          return true;
        }
        return false;
      },
      register: async (name, phone, password, team) => {
        if (password.length >= 6) {
          const user: User = {
            id: 'user_' + Date.now(),
            name,
            phone,
            team,
            role: 'member',
          };
          set({ user, isLoggedIn: true });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null, isLoggedIn: false }),
      updateStats: (devices, rings) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, avatar: `devices:${devices},rings:${rings}` } });
        }
      },
    }),
    { name: 'team-deploy-user' }
  )
);

interface DeployStore {
  records: DeployRecord[];
  addRecord: (record: Omit<DeployRecord, 'id'>) => void;
  getRecordsByUser: (userId: string) => DeployRecord[];
  getTotalStats: (userId: string) => { devices: number; rings: number };
}

export const useDeployStore = create<DeployStore>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => {
        const newRecord = { ...record, id: 'record_' + Date.now() };
        set((state) => ({ records: [...state.records, newRecord] }));
      },
      getRecordsByUser: (userId) => get().records.filter((r) => r.userId === userId),
      getTotalStats: (userId) => {
        const records = get().records.filter((r) => r.userId === userId);
        return records.reduce(
          (acc, r) => ({ devices: acc.devices + r.devices, rings: acc.rings + r.rings }),
          { devices: 0, rings: 0 }
        );
      },
    }),
    { name: 'team-deploy-records' }
  )
);

interface SalaryStore {
  config: SalaryConfig;
  updateConfig: (config: Partial<SalaryConfig>) => void;
  calculateIncome: (devices: number, rings: number) => {
    baseSalary: number;
    deviceCommission: number;
    ringCommission: number;
    bonus: number;
    grossIncome: number;
    tax: number;
    netIncome: number;
  };
}

const defaultConfig: SalaryConfig = {
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
};

export const useSalaryStore = create<SalaryStore>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      updateConfig: (newConfig) => {
        set((state) => ({ config: { ...state.config, ...newConfig } }));
      },
      calculateIncome: (devices, rings) => {
        const { config } = get();
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

        return { baseSalary: config.baseSalary, deviceCommission, ringCommission, bonus, grossIncome, tax, netIncome };
      },
    }),
    { name: 'team-deploy-salary' }
  )
);

interface LeaderboardStore {
  teams: TeamRanking[];
}

const defaultTeams: TeamRanking[] = [
  { id: '1', name: '华东战队', devices: 156, rings: 89, members: 12, rank: 1 },
  { id: '2', name: '华南战队', devices: 134, rings: 76, members: 10, rank: 2 },
  { id: '3', name: '华北战队', devices: 98, rings: 54, members: 8, rank: 3 },
  { id: '4', name: '西南战队', devices: 87, rings: 43, members: 7, rank: 4 },
  { id: '5', name: '西北战队', devices: 65, rings: 32, members: 6, rank: 5 },
];

export const useLeaderboardStore = create<LeaderboardStore>()(
  persist(
    () => ({
      teams: defaultTeams,
    }),
    { name: 'team-deploy-leaderboard' }
  )
);

interface CommunityStore {
  posts: Post[];
  addPost: (userId: string, userName: string, content: string) => void;
  toggleLike: (postId: string) => void;
}

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set) => ({
      posts: [
        { id: '1', userId: 'admin', userName: '管理员', content: '欢迎大家使用团队铺设管理系统！', likes: 24, comments: 5, createdAt: '2024-01-15', liked: false },
        { id: '2', userId: 'user1', userName: '张三', content: '今天完成了30台设备的铺设，继续加油！', likes: 18, comments: 3, createdAt: '2024-01-14', liked: false },
        { id: '3', userId: 'user2', userName: '李四', content: '新加入团队的小伙伴们有问题可以问我哦', likes: 12, comments: 8, createdAt: '2024-01-13', liked: false },
      ],
      addPost: (userId, userName, content) => {
        const newPost: Post = { id: 'post_' + Date.now(), userId, userName, content, likes: 0, comments: 0, createdAt: new Date().toISOString().split('T')[0], liked: false };
        set((state) => ({ posts: [newPost, ...state.posts] }));
      },
      toggleLike: (postId) => {
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, likes: p.liked ? p.likes - 1 : p.likes + 1, liked: !p.liked } : p
          ),
        }));
      },
    }),
    { name: 'team-deploy-community' }
  )
);

interface AchievementStore {
  badges: Badge[];
  tasks: DailyTask[];
  unlockBadge: (badgeId: string) => void;
  updateTask: (taskId: string, progress: number) => void;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set) => ({
      badges: [
        { id: '1', name: '初露锋芒', description: '铺设第一台设备', icon: '🌟', requirement: 1, progress: 0, unlocked: false },
        { id: '2', name: '小有名气', description: '铺设10台设备', icon: '⭐', requirement: 10, progress: 0, unlocked: false },
        { id: '3', name: '铺设达人', description: '铺设50台设备', icon: '🏆', requirement: 50, progress: 0, unlocked: false },
        { id: '4', name: '铺设大师', description: '铺设100台设备', icon: '👑', requirement: 100, progress: 0, unlocked: false },
        { id: '5', name: '团队之星', description: '获得团队排名第一', icon: '🌈', requirement: 1, progress: 0, unlocked: false },
      ],
      tasks: [
        { id: '1', userId: 'current', title: '铺设任务', description: '今日铺设设备', target: 5, current: 0, completed: false, reward: 100, date: new Date().toISOString().split('T')[0] },
        { id: '2', userId: 'current', title: '蓝环任务', description: '今日铺设蓝环', target: 10, current: 0, completed: false, reward: 50, date: new Date().toISOString().split('T')[0] },
      ],
      unlockBadge: (badgeId) => {
        set((state) => ({
          badges: state.badges.map((b) =>
            b.id === badgeId ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() } : b
          ),
        }));
      },
      updateTask: (taskId, progress) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, current: progress, completed: progress >= t.target } : t
          ),
        }));
      },
    }),
    { name: 'team-deploy-achievements' }
  )
);
