import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { User } from '@/types';

export default function Users() {
  const users = useAdminStore((s) => s.users);
  const addUser = useAdminStore((s) => s.addUser);
  const updateUser = useAdminStore((s) => s.updateUser);
  const deleteUser = useAdminStore((s) => s.deleteUser);

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    team: '',
    role: 'member' as 'member' | 'leader' | 'admin',
    devices: 0,
    rings: 0,
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.includes(search) ||
      u.phone.includes(search) ||
      u.team.includes(search)
  );

  const handleSubmit = () => {
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', phone: '', team: '', role: 'member', devices: 0, rings: 0 });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      team: user.team,
      role: user.role,
      devices: user.devices,
      rings: user.rings,
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该用户吗？')) {
      deleteUser(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">用户管理</h1>
          <p className="text-slate-500 mt-1">管理团队成员信息</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', phone: '', team: '', role: 'member', devices: 0, rings: 0 });
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          添加用户
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索用户姓名、手机号或团队..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3 rounded-tl-lg">姓名</th>
              <th className="px-4 py-3">手机号</th>
              <th className="px-4 py-3">团队</th>
              <th className="px-4 py-3">角色</th>
              <th className="px-4 py-3">设备</th>
              <th className="px-4 py-3">蓝环</th>
              <th className="px-4 py-3 rounded-tr-lg">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="table-row">
                <td className="px-4 py-3 font-medium text-slate-800">{user.name}</td>
                <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                <td className="px-4 py-3 text-slate-600">{user.team}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'leader' ? 'bg-purple-100 text-purple-600' :
                    user.role === 'admin' ? 'bg-red-100 text-red-600' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role === 'leader' ? '组长' : user.role === 'admin' ? '管理员' : '成员'}
                  </span>
                </td>
                <td className="px-4 py-3 text-blue-600 font-medium">{user.devices}</td>
                <td className="px-4 py-3 text-cyan-600 font-medium">{user.rings}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(user)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <PencilIcon className="w-4 h-4 text-slate-500" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              {editingUser ? '编辑用户' : '添加用户'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">手机号</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">团队</label>
                <input
                  type="text"
                  value={formData.team}
                  onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">角色</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="input-field"
                >
                  <option value="member">成员</option>
                  <option value="leader">组长</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">铺设设备</label>
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
