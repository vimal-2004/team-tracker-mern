import React from 'react';
import { User } from 'lucide-react';

const stringToColor = (str) => {
  // Simple hash to color
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 60%)`;
  return color;
};

const UserCard = ({ user }) => {
  return (
    <div className="card flex flex-col items-center p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer">
      {/* Avatar/Logo */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md border-4 border-white dark:border-gray-800 bg-gradient-to-br from-blue-200 to-indigo-400 dark:from-gray-700 dark:to-blue-900"
        style={{ background: user.name ? stringToColor(user.name) : undefined }}
      >
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-white">
            {user.name ? user.name[0].toUpperCase() : <User className="w-8 h-8" />}
          </span>
        )}
      </div>
      {/* User Info */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">{user.email}</p>
      </div>
    </div>
  );
};

export default UserCard;