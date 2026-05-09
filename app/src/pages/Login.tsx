import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useUserStore } from '@/stores';

export default function Login() {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('请输入手机号和密码');
      return;
    }
    const success = await login(phone, password);
    if (success) {
      navigate('/');
    } else {
      setError('密码至少6位');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
              <span className="text-4xl">📡</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">TeamDeploy</h1>
            <p className="text-blue-200">团队铺设管理系统</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">登录账号</h2>

            <div className="space-y-4">
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
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button onClick={handleLogin} className="btn-primary w-full">
                登录
              </button>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-slate-600">
                  <input type="checkbox" className="w-4 h-4 mr-2 rounded border-slate-300" defaultChecked />
                  记住登录状态
                </label>
                <button className="text-blue-600 font-medium">忘记密码？</button>
              </div>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">或</span>
                </div>
              </div>

              <button onClick={() => navigate('/register')} className="btn-secondary w-full">
                注册新账号
              </button>

              <p className="text-xs text-slate-400 text-center mt-4">
                演示账号: 13800138000 / 123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
