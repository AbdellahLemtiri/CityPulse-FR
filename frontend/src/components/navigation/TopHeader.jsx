import { useState, useEffect, useRef } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import toast, { Toaster } from 'react-hot-toast';
import { useStateContext } from '../../contexts/ContextProvider';
import axiosClient from '../../config/axios-client';

window.Pusher = Pusher;
window.Echo = new Echo({
  broadcaster: 'reverb',

  key: 'xadhdnbkzigazsdx91hw',

  wsHost: '127.0.0.1',
  wsPort: 8080,
  wssPort: 8080,

  cluster: 'mt1',

  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],

  authEndpoint: `http://127.0.0.1:8000/api/broadcasting/auth`,

  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        axiosClient
          .post('/broadcasting/auth', {
            socket_id: socketId,
            channel_name: channel.name,
          })
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            console.error("Erreur d'autorisation WebSockets:", error);
            callback(true, error);
          });
      },
    };
  },
});
export default function TopHeader() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useStateContext();

  let userId = null;
  if (user) {
    userId = user.id;
  }

  useEffect(() => {
    if (!userId) return;

    axiosClient.get('/notifications').then((res) => {
      const formattedNotifs = res.data.map((n) => ({
        id: n.id,
        ...n.data,
        read_at: n.read_at,
      }));
      setNotifications(formattedNotifs);

      const unread = formattedNotifs.filter((n) => n.read_at === null).length;
      setUnreadCount(unread);
    });
  }, [userId]);

  useEffect(() => {
    if (!userId || !window.Echo) return;

    const channelName = `App.Models.User.${userId}`;

    window.Echo.private(channelName)
      .notification((notification) => {
        console.log('🎉 NOTIFICATION REÇUE :', notification);

        toast.success(notification.message || 'Nouvelle notification !', {
          duration: 5000,
          position: 'top-right',
          icon: '🔔',
        });

        const newNotif = {
          id: notification.id || Date.now(),
          ...notification,
          read_at: null,
        };

        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      })
      .error((error) => {
        console.error('198 Err :', error);
      });

    return () => {
      window.Echo.leaveChannel(channelName);
    };
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown && unreadCount > 0) {
      setUnreadCount(0);
      axiosClient.post('/notifications/mark-as-read');

      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: new Date().toISOString() })));
    }
  };
  return (
    <header className="sticky  top-0 z-40 bg-white/90 overflow-visible dark:bg-gray-900 px-4 md:px-8 py-3 md:py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="md:hidden w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm"></div>
        <span className="md:hidden text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          City<span className="text-primary-500">Pulse</span>
        </span>

        <h1 className="hidden md:block text-xl font-bold text-gray-900 dark:text-white  tracking-wider">
          <span className="text-[#EA580C]">Bonjour </span> {user?.first_name} {user?.last_name}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative" ref={dropdownRef}>
          <button onClick={handleToggleDropdown} className="relative p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
            <span className="material-symbols-outlined text-[26px]">notifications</span>

            {unreadCount > 0 && <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-red-500 border-2 border-white dark:border-gray-900 rounded-full animate-bounce">{unreadCount}</span>}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden animate-fade-in-up">
              <div className="bg-gray-50 dark:bg-gray-900/80 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Notifications</h3>
                {notifications.length > 0 && <span className="text-[10px] bg-primary-900/30 text-primary-400 px-2 py-1 rounded-lg font-bold uppercase">{notifications.length} Récentes</span>}
              </div>

              <div className="max-h-[350px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center text-gray-500 dark:text-gray-500">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">notifications_paused</span>
                    <p className="text-sm font-medium">Vous êtes à jour !</p>
                    <p className="text-xs mt-1">Aucune nouvelle notification.</p>
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary-900/30 text-primary-400 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[18px]">info</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-bold mb-0.5">{notif.title || 'Mise à jour Système'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{notif.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

         
            </div>
          )}
        </div>

        <img src={user?.image} alt="avatar" className="w-8 h-8 rounded-lg" />
      </div>
    </header>
  );
}
