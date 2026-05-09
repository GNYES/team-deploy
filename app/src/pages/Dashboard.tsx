import { useUserStore, useDeployStore, useLeaderboardStore, useAchievementStore } from '@/stores';
import { MapPinIcon, DevicePhoneMobileIcon, TagIcon, TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const records = useDeployStore((s) => s.records);
  const teams = useLeaderboardStore((s) => s.teams);
  const badges = useAchievementStore((s) => s.badges);

  const userRecords = records.filter((r) => r.userId === user?.id);
  const totalDevices = userRecords.reduce((acc, r) => acc + r.devices, 0);
  const totalRings = userRecords.reduce((acc, r) => acc + r.rings, 0);
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <p className="text-blue-200 text-sm mb-1">欢迎回来</p>
          <h2 className="text-2xl font-bold mb-4">{user?.name || '团队成员'}</h2>
          
          <div className="flex items-center gap-2 text-sm text-blue-100">
            <TagIcon className="w-4 h-4" />
            <span>{user?.team || '默认团队'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <DevicePhoneMobileIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalDevices}</p>
            <p className="text-xs text-slate-500">铺设设备</p>
          </div>
        </div>
        
        <div className="card flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
            <MapPinIcon className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{totalRings}</p>
            <p className="text-xs text-slate-500">小蓝环</p>
          </div>
        </div>
      </div>

      <div className="card mb-6" onClick={() => navigate('/leaderboard')}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-slate-800">团队排行</h3>
          </div>
          <span className="text-sm text-blue-600">查看全部 →</span>
        </div>
        <div className="space-y-3">
          {teams.slice(0, 3).map((team, idx) => (
            <div key={team.id} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {idx + 1}
              </div>
              <span className="flex-1 font-medium text-slate-700">{team.name}</span>
              <span className="text-sm text-slate-500">{team.devices}台</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card mb-6" onClick={() => navigate('/achievements')}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ArrowTrendingUpIcon className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-slate-800">我的成就</h3>
          </div>
          <span className="text-sm text-blue-600">查看全部 →</span>
        </div>
        <div className="flex gap-3">
          {badges.slice(0, 4).map((badge) => (
            <div
              key={badge.id}
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                badge.unlocked ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-slate-100'
              }`}
            >
              {badge.unlocked ? badge.icon : '🔒'}
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-500 mt-3">{unlockedBadges}/{badges.length} 已解锁</p>
      </div>

      <button onClick={() => navigate('/deploy')} className="btn-primary w-full flex items-center justify-center gap-2">
        <MapPinIcon className="w-5 h-5" />
        快速记录铺设
      </button>
    </div>
  );
}
