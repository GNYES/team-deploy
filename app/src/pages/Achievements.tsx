import { useAchievementStore } from '@/stores';
import { TrophyIcon, CheckBadgeIcon, FireIcon, StarIcon } from '@heroicons/react/24/outline';

export default function Achievements() {
  const badges = useAchievementStore((s) => s.badges);
  const tasks = useAchievementStore((s) => s.tasks);

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-4">
          <TrophyIcon className="w-12 h-12" />
          <div>
            <p className="text-purple-200 text-sm">成就进度</p>
            <p className="text-3xl font-bold">{unlockedCount}/{badges.length}</p>
            <p className="text-purple-200 text-sm">已解锁徽章</p>
          </div>
        </div>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-amber-500" />
            今日任务
          </h3>
          <span className="text-sm text-blue-600">{completedTasks}/{tasks.length} 完成</span>
        </div>
        
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {task.completed ? (
                    <CheckBadgeIcon className="w-5 h-5 text-green-500" />
                  ) : (
                    <FireIcon className="w-5 h-5 text-orange-500" />
                  )}
                  <span className="font-medium text-slate-800">{task.title}</span>
                </div>
                <span className="text-sm text-emerald-600">+¥{task.reward}</span>
              </div>
              <p className="text-sm text-slate-500 mb-2">{task.description}</p>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    task.completed ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (task.current / task.target) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1 text-right">{task.current}/{task.target}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <TrophyIcon className="w-5 h-5 text-amber-500" />
          全部徽章
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl text-center transition-all ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200'
                  : 'bg-slate-50 opacity-60'
              }`}
            >
              <div className={`text-3xl mb-2 ${!badge.unlocked && 'grayscale'}`}>
                {badge.icon}
              </div>
              <p className="font-medium text-slate-800 text-sm">{badge.name}</p>
              <p className="text-xs text-slate-500 mt-1">{badge.description}</p>
              {badge.unlocked ? (
                <div className="mt-2">
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    已获得
                  </span>
                </div>
              ) : (
                <p className="text-xs text-slate-400 mt-1">
                  {badge.progress}/{badge.requirement}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
