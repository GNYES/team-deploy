import { useUserStore, useDeployStore, useAchievementStore } from '@/stores';
import { UserIcon, PhoneIcon, UsersIcon, CogIcon, ArrowRightOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const records = useDeployStore((s) => s.records);
  const badges = useAchievementStore((s) => s.badges);

  const userRecords = records.filter((r) => r.userId === user?.id);
  const totalDevices = userRecords.reduce((acc, r) => acc + r.devices, 0);
  const totalRings = userRecords.reduce((acc, r) => acc + r.rings, 0);
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl">
            {user?.name[0] || 'U'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.name || '用户'}</h2>
            <p className="text-slate-400 flex items-center gap-1 mt-1">
              <UsersIcon className="w-4 h-4" />
              {user?.team || '默认团队'}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
              <ShieldCheckIcon className="w-3 h-3" />
              <span>{user?.role === 'admin' ? '管理员' : '团队成员'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card text-center">
          <p className="text-2xl font-bold text-blue-600">{totalDevices}</p>
          <p className="text-xs text-slate-500">铺设设备</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-cyan-600">{totalRings}</p>
          <p className="text-xs text-slate-500">小蓝环</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-600">{unlockedBadges}</p>
          <p className="text-xs text-slate-500">徽章</p>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-slate-800 mb-4">账户信息</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">姓名</p>
              <p className="font-medium text-slate-800">{user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <PhoneIcon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">手机号</p>
              <p className="font-medium text-slate-800">{user?.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <UsersIcon className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">团队</p>
              <p className="font-medium text-slate-800">{user?.team}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">设置</h3>
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <CogIcon className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">应用设置</span>
            </div>
            <span className="text-slate-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="w-5 h-5 text-slate-400" />
              <span className="text-slate-700">隐私政策</span>
            </div>
            <span className="text-slate-400">→</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 hover:bg-red-50 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3 text-red-500">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>退出登录</span>
            </div>
            <span className="text-red-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
