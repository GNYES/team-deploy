import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneIcon, LockClosedIcon, UserIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useUserStore } from '@/stores';

const teams = ['华东战队', '华南战队', '华北战队', '西南战队', '西北战队', '东北战队'];

export default function Register() {
  const navigate = useNavigate();
  const register = useUserStore((s) => s.register);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [team, setTeam] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !phone || !password || !team) {
      setError('请填写所有信息');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码至少6位');
      return;
    }
    const success = await register(name, phone, password, team);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6 pt-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-xl">
              <span className="text-3xl">📝</span>
            </div>
            <h1 className="text-2xl font-bold text-white">注册账号</h1>
            <p className="text-blue-200 mt-1">加入我们的团队</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="请输入姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field pl-12"
                />
              </div>

              <div className="relative">
                <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field pl-12"
                  maxLength={11}
                />
              </div>

              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="设置密码（至少6位）"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12"
                />
              </div>

              <div className="relative">
                <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="确认密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-12"
                />
              </div>

              <div className="relative">
                <UsersIcon className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
                <select
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="input-field pl-12 appearance-none"
                >
                  <option value="">选择团队</option>
                  {teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button onClick={handleRegister} className="btn-primary w-full">
                立即注册
              </button>

              <p className="text-sm text-slate-500 text-center">
                已有账号？{' '}
                <button onClick={() => navigate('/login')} className="text-blue-600 font-medium">
                  立即登录
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
