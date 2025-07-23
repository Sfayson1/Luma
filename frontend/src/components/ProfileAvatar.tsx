// ProfileAvatar.tsx - Enhanced with error handling
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { User } from '@supabase/supabase-js';

interface ProfileData {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
}

interface ProfileAvatarProps {
  user?: User;
  userId?: string;
  fallbackInitials?: string;
}

export default function ProfileAvatar({ user, userId, fallbackInitials }: ProfileAvatarProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use either user.id or userId prop
  const actualUserId = user?.id || userId;

  useEffect(() => {
    if (actualUserId) {
      loadProfile();
    }
  }, [actualUserId]);

  const loadProfile = async () => {
    if (!actualUserId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, first_name, last_name')
        .eq('id', actualUserId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No profile found - create one automatically
          console.log('No profile found, creating default profile...');
          await createDefaultProfile();
        } else {
          throw error;
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const createDefaultProfile = async () => {
    if (!actualUserId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: actualUserId,
            first_name: '',
            last_name: '',
            avatar_url: ''
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      console.log('Default profile created successfully');
    } catch (err) {
      console.error('Error creating default profile:', err);
      setError('Failed to create profile');
    }
  };

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
    );
  }

  if (error) {
    return (
      <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
        <span className="text-red-600 text-xs">!</span>
      </div>
    );
  }

  // Use initials from email if no name is available
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }

    // Use fallbackInitials prop if provided
    if (fallbackInitials) {
      return fallbackInitials;
    }

    // Fallback to email initials if user object is available
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }

    // Final fallback
    return 'U';
  };

  return (
    <div className="w-8 h-8 rounded-full bg-[#A78BFA] flex items-center justify-center">
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            // If image fails to load, show initials instead
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span className="text-white text-sm font-medium">
          {getInitials()}
        </span>
      )}
    </div>
  );
}
