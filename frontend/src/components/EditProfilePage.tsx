import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

interface ProfileData {
  firstName: string;
  lastName: string;
  bio: string;
  avatar: string | null;
  isPublic: boolean;
}

const EditProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    bio: "",
    avatar: null,
    isPublic: false,
  });

  const [originalProfile, setOriginalProfile] = useState<ProfileData | null>(
    null
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

const loadUserProfile = async () => {
  try {
    setIsLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, bio, avatar_url, is_public')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const userData = {
      firstName: profileData?.first_name || '',
      lastName: profileData?.last_name || '',
      bio: profileData?.bio || '',
      avatar: profileData?.avatar_url || null,
      isPublic: profileData?.is_public || false
    };

    setProfile(userData);
    setOriginalProfile(userData);

  } catch (error) {
    console.error('Failed to load user profile:', error);
    setSaveStatus('error');
  } finally {
    setIsLoading(false);
  }
};

  // Track changes by comparing with original data
  useEffect(() => {
    if (originalProfile) {
      const profileChanged =
        JSON.stringify(profile) !== JSON.stringify(originalProfile);
      const avatarChanged = avatarPreview !== null;
      setHasChanges(profileChanged || avatarChanged);
      setSaveStatus("idle");
    }
  }, [profile, avatarPreview, originalProfile]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
  };

  const updateProfile = <K extends keyof ProfileData>(
    key: K,
    value: ProfileData[K]
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let updatedProfile = { ...profile };

      if (avatarPreview) {
        const fileExt = avatarPreview.includes("jpeg") ? "jpg" : "png";
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;

        const response = await fetch(avatarPreview);
        const blob = await response.blob();

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, blob);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(fileName);

        updatedProfile.avatar = publicUrl;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        first_name: updatedProfile.firstName,
        last_name: updatedProfile.lastName,
        bio: updatedProfile.bio,
        avatar_url: updatedProfile.avatar,
        is_public: updatedProfile.isPublic,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setOriginalProfile(updatedProfile);
      setAvatarPreview(null);
      setHasChanges(false);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const getUserInitials = () => {
    return `${profile.firstName[0] || ""}${
      profile.lastName[0] || ""
    }`.toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#1F2937] mb-2">
          Edit Profile
        </h1>
        <p className="text-gray-600">
          Manage your profile information and how others see you on Luma
        </p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A78BFA]"></div>
          <span className="ml-3 text-gray-600">Loading your profile...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Profile Picture
              </h2>

              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-100">
                    {avatarPreview || profile.avatar ? (
                      <img
                        src={avatarPreview || profile.avatar!}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-gray-400">
                        {getUserInitials() || "👤"}
                      </span>
                    )}
                  </div>

                  {/* Edit Button Overlay */}
                  <label className="absolute bottom-2 right-2 bg-[#A78BFA] text-white rounded-full p-3 cursor-pointer hover:bg-purple-600 transition-colors shadow-lg">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block">
                    <span className="text-[#A78BFA] font-medium cursor-pointer hover:text-purple-600">
                      Upload new photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>

                  {(avatarPreview || profile.avatar) && (
                    <button
                      onClick={removeAvatar}
                      className="block text-red-600 font-medium hover:text-red-700"
                    >
                      Remove photo
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>

              {/* Public Profile Toggle */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">
                      Public Profile
                    </div>
                    <div className="text-sm text-gray-500">
                      Make your profile visible to others
                    </div>
                  </div>
                  <button
                    onClick={() => updateProfile("isPublic", !profile.isPublic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profile.isPublic ? "bg-[#A78BFA]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profile.isPublic ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Personal Information
              </h2>

              <div className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        updateProfile("firstName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        updateProfile("lastName", e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => updateProfile("bio", e.target.value)}
                    rows={4}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors resize-none"
                    placeholder="Tell others about yourself and your journaling journey..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      Share what inspires you to journal or what you hope to
                      achieve
                    </div>
                    <div
                      className={`text-xs ${
                        profile.bio.length > 280
                          ? "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {profile.bio.length}/300
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Section */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">Save Changes</h3>
                  <p className="text-sm text-gray-500">
                    {hasChanges
                      ? "You have unsaved changes"
                      : "All changes saved"}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {saveStatus === "success" && (
                    <div className="flex items-center text-green-600 text-sm">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Saved successfully!
                    </div>
                  )}

                  {saveStatus === "error" && (
                    <div className="flex items-center text-red-600 text-sm">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Failed to save
                    </div>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="px-6 py-3 bg-[#A78BFA] text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfilePage;
