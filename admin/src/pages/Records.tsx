import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Records() {
  const records = useAdminStore((s) => s.deployRecords);
  const addRecord = useAdminStore((s) => s.addDeployRecord);

  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredRecords = records.filter((r) => {
    const matchSearch =
      r.userName.includes(search) ||
      r.team.includes(search) ||
      r.location.includes(search);
    const matchDate = !dateFilter || r.date.startsWith(dateFilter);
    return matchSearch && matchDate;
  });

  const totalDevices = filteredRecords.reduce((acc, r) => acc + r.devices, 0);
  const totalRings = filteredRecords.reduce((acc, r) => acc + r.rings, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">铺设记录</h1>
          <p className="text-slate-500 mt-1">查看所有成员的铺设记录</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="stat-card">
          <p className="text-sm text-slate-500">记录总数</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{filteredRecords.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">设备总数</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{totalDevices}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-slate-500">蓝环总数</p>
          <p className="text-3xl font-bold text-cyan-600 mt-1">{totalRings}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索成员、团队或地点..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="input-field w-40"
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="table-header">
              <th className="px-4 py-3 rounded-tl-lg">日期</th>
              <th className="px-4 py-3">成员</th>
              <th className="px-4 py-3">团队</th>
              <th className="px-4 py-3">地点</th>
              <th className="px-4 py-3">设备</th>
              <th className="px-4 py-3">蓝环</th>
              <th className="px-4 py-3 rounded-tr-lg">备注</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.map((record) => (
              <tr key={record.id} className="table-row">
                <td className="px-4 py-3 text-sm text-slate-600">{record.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{record.userName}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{record.team}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{record.location}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{record.devices}</td>
                <td className="px-4 py-3 text-sm text-cyan-600 font-medium">{record.rings}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{record.note || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
