"use client";
import React, { useState } from 'react';

interface FormData {
  fullName: string;
  username: string;
  password: string;
  confirmPassword: string;
  bio: string;
}

interface EditState {
  fullName: boolean;
  username: boolean;
  password: boolean;
  bio: boolean;
}

const ProfileInfo: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: 'Jane Doe',
    username: 'janedoe',
    password: '',
    confirmPassword: '',
    bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, sed.',
  });

  const [editState, setEditState] = useState<EditState>({
    fullName: false,
    username: false,
    password: false,
    bio: false,
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (editState.password && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Saved Data:', formData);
    setEditState({
      fullName: false,
      username: false,
      password: false,
      bio: false,
    });
  };

  const handleDelete = () => {
    const confirmed = confirm('Are you sure you want to delete your account permanently?');
    if (confirmed) {
      console.log('Account Deleted');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center py-8 px-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <img
              src="https://github.com/shadcn.png"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 transition-colors">
            Change
          </button>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">56</div>
            <div className="text-sm text-gray-600">posts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1.2k</div>
            <div className="text-sm text-gray-600">followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">340</div>
            <div className="text-sm text-gray-600">following</div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Name</label>
            {editState.fullName ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={() => setEditState(prev => ({ ...prev, fullName: false }))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditState(prev => ({ ...prev, fullName: true }))}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-900">{formData.fullName}</span>
              </div>
            )}
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Username</label>
            {editState.username ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  onClick={() => setEditState(prev => ({ ...prev, username: false }))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditState(prev => ({ ...prev, username: true }))}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-900">@{formData.username}</span>
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Password</label>
            {editState.password ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setEditState(prev => ({ ...prev, password: false }))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            ) : (
              <div
                onClick={() => setEditState(prev => ({ ...prev, password: true }))}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-900">••••••••</span>
              </div>
            )}
          </div>

          {/* Bio Field */}
          <div>
            <label className="block text-lg font-semibold text-gray-900 mb-2">Bio</label>
            {editState.bio ? (
              <div className="flex gap-2">
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={() => setEditState(prev => ({ ...prev, bio: false }))}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div
                onClick={() => setEditState(prev => ({ ...prev, bio: true }))}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors min-h-[80px]"
              >
                <span className="text-gray-900">{formData.bio}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-colors"
        >
          Save
        </button>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="w-full mt-4 text-red-600 py-2 text-sm font-medium hover:text-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;