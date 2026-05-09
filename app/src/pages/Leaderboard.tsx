import { useState } from 'react';
import { useLeaderboardStore } from '@/stores';
import { TrophyIcon, DevicePhoneMobileIcon, MapPinIcon } from '@heroicons/react/24/outline';

type TabType = 'teams' | 'members';

export default function Leaderboard() {
  const teams = useLeaderboardStore((s) => s.teams);
  const [tab, setTab] = useState<TabType>('teams');

  const members = [
    { id: '1', name: '王建国', team: '华东战队', devices: 45, rings: 23, rank: 1 },
    { id: '2', name: '李明辉', team: '华南战队', devices: 42, rings: 21, rank: 2 },
    { id: '3', name: '张伟', team: '华东战队', devices: 38, rings: 19, rank: 3 },
    { id: '4', name: '刘强', team: '华北战队', devices: 35, rings: 17, rank: 4 },
    { id: '5', name: '陈刚', team: '西南战队', devices: 32, rings: 15, rank: 5 },
  ];

  return (
    <div className="pb-4">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center gap-3">
          <TrophyIcon className="w-8 h-8" />
          <div>
            <p className="text-amber-100 text-sm">当前排名</p>
            <p className="text-2xl font-bold">团队总榜</p>
          </div>
        </div>
      </div>

      <div className="flex bg-white rounded-xl p-1 mb-6 shadow-sm">
        <button
          onClick={() => setTab('teams')}
          className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
            tab === 'teams' ? 'bg-blue-600 text-white' : 'text-slate-600'
          }`}
        >
          团队排行
        </button>
        <button
          onClick={() => setTab('members')}
          className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
            tab === 'members' ? 'bg-blue-600 text-white' : 'text-slate-600'
          }`}
        >
          个人排行
        </button>
      </div>

      {tab === 'teams' ? (
        <div className="space-y-3">
          {teams.map((team, idx) => (
            <div
              key={team.id}
              className={`card flex items-center gap-4 ${
                idx < 3 ? 'border-2 ' + (idx === 0 ? 'border-amber-400' : idx === 1 ? 'border-slate-300' : 'border-orange-400') : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{team.name}</p>
                <p className="text-xs text-slate-500">{team.members}名成员</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-slate-700">
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  <span className="font-semibold">{team.devices}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-600 text-xs">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{team.rings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, idx) => (
            <div key={member.id} className="card flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                idx === 0 ? 'bg-amber-100 text-amber-600' : idx === 1 ? 'bg-slate-200 text-slate-600' : idx === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
              }`}>
                {idx + 1}
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                {member.name[0]}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800">{member.name}</p>
                <p className="text-xs text-slate-500">{member.team}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-slate-700">
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  <span className="font-semibold">{member.devices}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-600 text-xs">
                  <MapPinIcon className="w-3 h-3" />
                  <span>{member.rings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
