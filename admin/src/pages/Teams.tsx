import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { Team } from '@/types';

export default function Teams() {
  const teams = useAdminStore((s) => s.teams);
  const addTeam = useAdminStore((s) => s.addTeam);
  const updateTeam = useAdminStore((s) => s.updateTeam);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    region: '',
    members: 0,
    devices: 0,
    rings: 0,
  });

  const filteredTeams = teams.filter(
    (t) =>
      t.name.includes(search) ||
      t.leader.includes(search) ||
      t.region.includes(search)
  );

  const handleSubmit = () => {
    if (editingTeam) {
      updateTeam(editingTeam.id, formData);
    } else {
      addTeam(formData);
    }
    setShowModal(false);
    setEditingTeam(null);
  };

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      leader: team.leader,
      region: team.region,
      members: team.members,
      devices: team.devices,
      rings: team.rings,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">团队管理</h1>
          <p className="text-slate-500 mt-1">管理团队信息和数据</p>
        </div>
        <button
          onClick={() => {
            setEditingTeam(null);
            setFormData({ name: '', leader: '', region: '', members: 0, devices: 0, rings: 0 });
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          添加团队
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">{team.name}</h3>
                <p className="text-sm text-slate-500">{team.region}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(team)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <PencilIcon className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">队长</span>
                <span className="font-medium text-slate-700">{team.leader}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">成员数</span>
                <span className="font-medium text-slate-700">{team.members}人</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">铺设设备</span>
                <span className="font-medium text-blue-600">{team.devices}台</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">小蓝环</span>
                <span className="font-medium text-cyan-600">{team.rings}个</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                  style={{ width: `${Math.min(100, (team.devices / 200) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2">完成率: {Math.min(100, Math.round((team.devices / 200) * 100))}%</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {editingTeam ? '编辑团队' : '添加团队'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">团队名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">队长</label>
                <input
                  type="text"
                  value={formData.leader}
                  onChange={(e) => setFormData({ ...formData, leader: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">区域</label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">成员数</label>
                  <input
                    type="number"
                    value={formData.members}
                    onChange={(e) => setFormData({ ...formData, members: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">设备数</label>
                  <input
                    type="number"
                    value={formData.devices}
                    onChange={(e) => setFormData({ ...formData, devices: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">蓝环数</label>
                  <input
                    type="number"
                    value={formData.rings}
                    onChange={(e) => setFormData({ ...formData, rings: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                取消
              </button>
              <button onClick={handleSubmit} className="btn-primary flex-1">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
