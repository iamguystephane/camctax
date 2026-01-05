// components/dashboard/DashboardHeader.tsx
"use client";

import { 
  Search, 
  Bell, 
  Menu,
  X,
  LogOut,
  UserPlus,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import camctaxlogo from '../../public/images/camctax logo.png';
import logo from '../../public/images/logo.png';
import { SocketContext } from "@/context/SocketProvider";

interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
  type: 'lead' | 'consultant' | 'system' | 'status';
  icon: React.ReactNode;
}

interface DashboardHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function DashboardHeader({ 
  searchQuery, 
  onSearchChange, 
  onMenuClick,
  sidebarOpen 
}: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const socketContext = useContext(SocketContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = () => {
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return (first + last).toUpperCase() || "AD";
  };

  const getRoleLabel = () => {
    if (user?.role === "superadmin") return "Super Admin";
    if (user?.role === "admin") return "Administrator";
    return "User";
  };

  // Add notification function
  const addNotification = (text: string, type: Notification['type']) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString(),
      read: false,
      type,
      icon: getNotificationIcon(type)
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'lead': return <UserPlus className="w-4 h-4" />;
      case 'consultant': return <UserCheck className="w-4 h-4" />;
      case 'status': return <CheckCircle className="w-4 h-4" />;
      case 'system': return <AlertCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // WebSocket event listeners for real-time notifications
  useEffect(() => {
    if (!socketContext?.socket) return;

    const socket = socketContext.socket;

    // Listen for new leads
    socket.on('new-lead', (data: any) => {
      addNotification(`New lead registered: ${data.name || 'Unknown'}`, 'lead');
    });

    // Listen for consultant status updates
    socket.on('consultant-status-updated', (data: any) => {
      addNotification(`${data.name} is now ${data.isActive ? 'active' : 'inactive'}`, 'status');
    });

    // Listen for consultant room joined (when consultants log in)
    socket.on('consultant-room-joined', (data: any) => {
      addNotification(`Consultant ${data.consultantId} joined`, 'consultant');
    });

    // Listen for admin room joined
    socket.on('admin-room-joined', () => {
      addNotification('Admin connected to dashboard', 'system');
    });

    return () => {
      socket.off('new-lead');
      socket.off('consultant-status-updated');
      socket.off('consultant-room-joined');
      socket.off('admin-room-joined');
    };
  }, [socketContext?.socket]);

  // Initial system notification
  useEffect(() => {
    addNotification('Dashboard connected successfully', 'system');
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        {/* Left side: Logo and Menu */}
        <div className="flex items-center gap-3">
          {/* Menu Button */}
          <div className="md:px-1.5 py-1.5">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            )}
          </button>
          </div>
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image src={logo} alt="Logo" className="h-5 w-5 md:h-6 md:w-6" priority/>
            </div>
            <div>
              <div className="hidden md:block">
              <Image src={camctaxlogo} alt="Tax Assistant" className="h-14 w-36 " priority/>
              </div>
              <p className="text-xs md:text-sm text-gray-500 hidden md:block">
                Welcome back, {user?.firstName || "Admin"}!
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Search, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search - Desktop */}
          <div className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, consultants..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all w-64"
              />
            </div>
          </div>

          {/* Search - Mobile */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-xs">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  <p className="text-sm text-gray-500">You have {notifications.filter(n => !n.read).length} unread</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 flex justify-between items-center">
                  <button 
                    onClick={clearAllNotifications}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear all
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 hover:bg-gray-100 p-1 md:p-2 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white text-sm md:text-base font-bold">
                {getInitials()}
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2">
                  <p className="font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-500">{getRoleLabel()}</p>
                  <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
