import { useAdminStore } from '@/stores/adminStore';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function SalaryDetails() {
  const navigate = useNavigate();
  const users = useAdminStore((s) => s.users);
  const calculateIncome = useAdminStore((s) => s.calculateIncome);

  // Generate mock monthly salary data
  const months = ['2024-01', '2024-02', '2024-03', '2024-04'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">业务员每月工资</h1>
          <p className="text-slate-500 mt-1">查看业务员各月薪资明细</p>
        </div>
      </div>

      {users.map((user) => {
        const income = calculateIncome(user.devices, user.rings);
        return (
          <div key={user.id} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800">{user.name}</h3>
              <span className="text-sm text-slate-500">{user.team}</span>
            </div>
            
            <div className="space-y-3">
              {months.map((month) => (
                <div 
                  key={month}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-purple-500" />
                    <span className="text-slate-700">{month}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-purple-500" />
                    <span className="font-bold text-slate-800">
                      ¥{(income.netIncome * (0.9 + Math.random() * 0.3)).toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
