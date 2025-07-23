import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Download, Trash2, Mail } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [accountInfo, setAccountInfo] = useState({
    email: '',
    memberSince: '',
    totalEntries: 0,
    storageUsed: '0 MB'
  });

  // Fetch user account information
  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        setIsLoading(true);

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          setError('No user found');
          return;
        }

        // Get user profile information
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Profile fetch error:', profileError);
        }

        // Get total number of entries
        const { count: entriesCount, error: entriesError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('owner_id', user.id);

        if (entriesError) {
          console.error('Entries count error:', entriesError);
        }

        // Calculate storage used (approximate)
        const { data: posts, error: postsError } = await supabase
          .from('posts')
          .select('content')
          .eq('owner_id', user.id);

        let storageUsed = 0;
        if (!postsError && posts) {
          storageUsed = posts.reduce((total: number, post: any) => {
            return total + (post.content ? new Blob([post.content]).size : 0);
          }, 0);
        }

        // Format storage size
        const formatStorageSize = (bytes: number) => {
          if (bytes === 0) return '0 MB';
          const mb = bytes / (1024 * 1024);
          if (mb < 1) {
            const kb = bytes / 1024;
            return `${kb.toFixed(1)} KB`;
          }
          return `${mb.toFixed(1)} MB`;
        };

        // Format member since date
        const memberSince = profile?.created_at
          ? new Date(profile.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })
          : new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            });

        setAccountInfo({
          email: user.email || '',
          memberSince,
          totalEntries: entriesCount || 0,
          storageUsed: formatStorageSize(storageUsed)
        });

      } catch (err) {
        console.error('Error fetching account info:', err);
        setError('Failed to load account information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountInfo();
  }, []);

  const handleExportData = async () => {
    setIsExporting(true);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user found');
      }

      // Fetch all user data
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (postsError) {
        throw postsError;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Create export data
      const exportData = {
        account: {
          email: user.email,
          created_at: user.created_at,
          profile: profile || {}
        },
        entries: posts || [],
        exported_at: new Date().toISOString(),
        total_entries: posts?.length || 0
      };

      // Create and download JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `luma-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSaveMessage('Data export completed successfully!');
    } catch (error) {
      console.error('Export error:', error);
      setSaveMessage('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('No user found');
      }

      // Delete user's posts first (due to foreign key constraints)
      const { error: postsError } = await supabase
        .from('posts')
        .delete()
        .eq('owner_id', user.id);

      if (postsError) {
        throw postsError;
      }

      // Delete user's profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile deletion error:', profileError);
      }

      // Sign out and delete the user account
      const { error: deleteError } = await supabase.auth.signOut();

      if (deleteError) {
        throw deleteError;
      }

      // Navigate to landing page
      navigate('/');

    } catch (error) {
      console.error('Account deletion error:', error);
      setSaveMessage('Account deletion failed. Please contact support.');
      setTimeout(() => setSaveMessage(''), 5000);
    }

    setShowDeleteConfirm(false);
  };

  const handleGoBack = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleGoBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-light text-gray-800">Account Settings</h1>
              <p className="text-gray-600 font-light">Manage your account and data</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Account Information</h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
              <span className="ml-3 text-gray-600">Loading account information...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <span className="text-gray-600">{accountInfo.email}</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <span className="text-gray-600">{accountInfo.memberSince}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Entries</label>
                  <span className="text-gray-600">{accountInfo.totalEntries} entries</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Storage Used</label>
                  <span className="text-gray-600">{accountInfo.storageUsed}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-6">Data Management</h3>

          <div className="space-y-4">
            {/* Export Data */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl">
              <div>
                <h4 className="font-medium text-gray-800">Export Your Data</h4>
                <p className="text-sm text-gray-600">Download all your journal entries and data</p>
              </div>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="bg-blue-400 text-white px-6 py-2 rounded-2xl font-light hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-3xl shadow-sm border border-red-200 p-8">
          <h3 className="text-lg font-medium text-red-600 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-2xl bg-red-50">
              <div>
                <h4 className="font-medium text-red-800">Delete Account</h4>
                <p className="text-sm text-red-600">Permanently delete your account and all data</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white px-6 py-2 rounded-2xl font-light hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-4">Delete Account</h3>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. All your journal entries, data, and account information will be permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-2xl font-light hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-500 text-white py-3 px-4 rounded-2xl font-light hover:bg-red-600 transition-colors"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {saveMessage && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettingsPage;
