import { useState } from 'react';
import { PlusIcon, MinusIcon, MapPinIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useUserStore, useDeployStore } from '@/stores';

export default function Deploy() {
  const user = useUserStore((s) => s.user);
  const addRecord = useDeployStore((s) => s.addRecord);
  const records = useDeployStore((s) => s.records);
  
  const [devices, setDevices] = useState(0);
  const [rings, setRings] = useState(0);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const userRecords = records.filter((r) => r.userId === user?.id).slice(0, 5);

  const handleSubmit = () => {
    if (devices === 0 && rings === 0) return;
    addRecord({
      userId: user!.id,
      date: new Date().toISOString(),
      devices,
      rings,
      location: location || '未指定地点',
      note,
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setDevices(0);
      setRings(0);
      setLocation('');
      setNote('');
    }, 1500);
  };

  return (
    <div className="pb-4">
      <div className="card mb-6">
        <h3 className="font-semibold text-slate-800 mb-4">📍 记录铺设</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <p className="font-medium text-slate-800">铺设设备</p>
                <p className="text-xs text-slate-500">每台奖励佣金</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDevices(Math.max(0, devices - 1))}
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <MinusIcon className="w-5 h-5 text-slate-600" />
              </button>
              <span className="w-12 text-center text-xl font-bold">{devices}</span>
              <button
                onClick={() => setDevices(devices + 1)}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                <span className="text-xl">🔵</span>
              </div>
              <div>
                <p className="font-medium text-slate-800">小蓝环</p>
                <p className="text-xs text-slate-500">额外奖励佣金</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setRings(Math.max(0, rings - 1))}
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
              >
                <MinusIcon className="w-5 h-5 text-slate-600" />
              </button>
              <span className="w-12 text-center text-xl font-bold">{rings}</span>
              <button
                onClick={() => setRings(rings + 1)}
                className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center hover:bg-cyan-700 transition-colors"
              >
                <PlusIcon className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">铺设地点</label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="输入铺设地点"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">备注（可选）</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="添加备注信息..."
              className="input-field resize-none h-20"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={devices === 0 && rings === 0}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              submitted
                ? 'bg-green-500 text-white'
                : devices === 0 && rings === 0
                ? 'bg-slate-100 text-slate-400'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-98'
            }`}
          >
            {submitted ? (
              <>
                <CheckIcon className="w-5 h-5" />
                提交成功！
              </>
            ) : (
              <>确认提交 ({devices}台设备 + {rings}个蓝环)</>
            )}
          </button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">📋 最近记录</h3>
        {userRecords.length === 0 ? (
          <p className="text-slate-400 text-center py-8">暂无记录</p>
        ) : (
          <div className="space-y-3">
            {userRecords.map((record) => (
              <div key={record.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">
                  📍
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800">{record.location}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(record.date).toLocaleDateString()} · {record.devices}台 · {record.rings}个
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
