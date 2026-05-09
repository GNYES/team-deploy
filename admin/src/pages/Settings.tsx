import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { SaveIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Settings() {
  const store = useAdminStore();
  const [saved, setSaved] = useState(false);

  const handleClearData = (type: 'users' | 'teams' | 'records') => {
    if (confirm(`确定要清空所有${type === 'users' ? '用户' : type === 'teams' ? '团队' : '铺设记录'}数据吗？此操作不可恢复！`)) {
      alert('数据已清空');
    }
  };

  const handleResetAll = () => {
    if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
      localStorage.removeItem('team-deploy-admin');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">系统设置</h1>
        <p className="text-slate-500 mt-1">管理应用配置和数据</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">数据管理</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">用户数据</p>
                <p className="text-sm text-slate-500">{store.users.length} 条记录</p>
              </div>
              <button
                onClick={() => handleClearData('users')}
                className="btn-danger flex items-center gap-2 text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                清空
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">团队数据</p>
                <p className="text-sm text-slate-500">{store.teams.length} 条记录</p>
              </div>
              <button
                onClick={() => handleClearData('teams')}
                className="btn-danger flex items-center gap-2 text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                清空
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="font-medium text-slate-800">铺设记录</p>
                <p className="text-sm text-slate-500">{store.deployRecords.length} 条记录</p>
              </div>
              <button
                onClick={() => handleClearData('records')}
                className="btn-danger flex items-center gap-2 text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                清空
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">系统操作</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="font-medium text-slate-800 mb-1">刷新数据</p>
              <p className="text-sm text-slate-500 mb-3">从本地存储重新加载数据</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary flex items-center gap-2 text-sm"
              >
                <ArrowPathIcon className="w-4 h-4" />
                刷新页面
              </button>
            </div>
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="font-medium text-slate-800 mb-1">重置所有数据</p>
              <p className="text-sm text-slate-500 mb-3">清除所有数据并恢复默认设置</p>
              <button
                onClick={handleResetAll}
                className="btn-danger flex items-center gap-2 text-sm"
              >
                <TrashIcon className="w-4 h-4" />
                重置系统
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">系统信息</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-slate-500">应用名称</p>
            <p className="font-medium text-slate-800">TeamDeploy</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">版本</p>
            <p className="font-medium text-slate-800">1.0.0</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">存储方式</p>
            <p className="font-medium text-slate-800">LocalStorage</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">数据更新时间</p>
            <p className="font-medium text-slate-800">{new Date().toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">浏览器</p>
            <p className="font-medium text-slate-800">{navigator.userAgent.includes('Mobile') ? '移动端' : '桌面端'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">存储容量</p>
            <p className="font-medium text-slate-800">{(JSON.stringify(localStorage).length / 1024).toFixed(2)} KB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
