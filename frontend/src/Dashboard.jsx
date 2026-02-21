import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // 1. Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token) {
            navigate('/login'); // Sifto l login ila makanch mconnecté
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    // 2. Handle Logout
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            // Nsifto talab l Laravel bach yms7 token mn database
            await axios.post('http://127.0.0.1:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.log("Logout error (mafiha bass):", error);
        }

        // Nms7o koulchi mn LocalStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) return <div className="text-center mt-20">Chargement...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] p-8 font-sans">
            {/* Navbar Sghira */}
            <nav className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#EA580C] text-3xl">waves</span>
                    <h1 className="text-xl font-bold text-slate-800 dark:text-white">SafiPulse</h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-slate-600 dark:text-slate-300">
                        Bonjour, <strong>{user.first_name}</strong> 👋
                    </span>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition font-medium text-sm"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Déconnexion
                    </button>
                </div>
            </nav>

            {/* Content (Zwaq mo2a9at) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 bg-orange-100 text-[#EA580C] rounded-xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">report_problem</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Incidents Signalés</h3>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">12</p>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Résolus</h3>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">8</p>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">military_tech</span>
                    </div>
                    <h3 className="text-slate-500 text-sm font-medium">Points XP</h3>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{user.xp_points || 0}</p>
                </div>
            </div>
            
            <div className="mt-8 text-center text-slate-400 text-sm">
                Next Step: Njib data dial Incidents mn Laravel 😉
            </div>
        </div>
    );
}