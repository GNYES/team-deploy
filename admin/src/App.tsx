import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import Teams from '@/pages/Teams';
import Records from '@/pages/Records';
import Salary from '@/pages/Salary';
import ImportExport from '@/pages/ImportExport';
import Settings from '@/pages/Settings';
import DeviceAnalysis from '@/pages/DeviceAnalysis';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/records" element={<Records />} />
            <Route path="/salary" element={<Salary />} />
            <Route path="/import-export" element={<ImportExport />} />
            <Route path="/device-analysis" element={<DeviceAnalysis />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
