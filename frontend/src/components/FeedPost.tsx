import React, { useState } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { supabase } from "../supabaseClient";
import  ProfileAvatar  from "../components/ProfileAvatar";

// Mood to emoji mapping
const moodMap: { [key: string]: string } = {
  happy: "😊",
  sad: "😢",
  frustrated: "😤",
  anxious: "😰",
  calm: "😌",
  neutral: "😐",
  excited: "🤩",
  tired: "😴",
  grateful: "🙏",
  peaceful: "☮️",
  other: "💭",
};

type Post = {
  id: number;
  date_posted: string | null;
  created_at: string | null;
  mood: string | null;
  content: string;
  owner_id: string;
  privacy: string;
  tags: string | null;
  prompt_id: number | null;
  profiles?: {
    first_name: string;
    last_name: string;
    username: string;
  };
};

type Props = {
  posts: Post[];
  currentUserId: string;
  onPostUpdated: () => void; // Callback to refresh posts
};

const moodColors: Record<string, string> = {
  happy: "bg-yellow-200 text-yellow-800",
  sad: "bg-blue-200 text-blue-800",
  anxious: "bg-orange-200 text-orange-800",
  calm: "bg-green-200 text-green-800",
  excited: "bg-purple-200 text-purple-800",
  tired: "bg-gray-200 text-gray-800",
  grateful: "bg-pink-200 text-pink-800",
  frustrated: "bg-red-200 text-red-800",
  peaceful: "bg-blue-100 text-blue-700",
  neutral: "bg-gray-200 text-gray-800",
  other: "bg-gray-200 text-gray-800",
};

const FeedPost = ({
  post,
  currentUserId,
  onPostUpdated,
}: {
  post: Post;
  currentUserId: string;
  onPostUpdated: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editMood, setEditMood] = useState(post.mood || "");
  const [editPrivacy, setEditPrivacy] = useState(post.privacy);
  const [editTags, setEditTags] = useState(post.tags || "");
  const [isDeleting, setIsDeleting] = useState(false);

  const displayName = post.profiles
    ? `${post.profiles.first_name} ${post.profiles.last_name}`
    : `User ${post.owner_id.substring(0, 8)}`;

  let formattedDate = "Unknown date";
  if (post.created_at) {
    try {
      const utcTimestamp = post.created_at.includes("Z")
        ? post.created_at
        : post.created_at + "Z";
      const postDate = new Date(utcTimestamp);
      formattedDate = formatDistanceToNow(postDate, {
        addSuffix: true,
        includeSeconds: true,
      });
    } catch (error) {
      console.error("Error parsing date:", error);
      formattedDate = "Invalid date";
    }
  }

  const moodStyle = moodColors[post.mood || ""] || "bg-gray-200 text-gray-800";

  // Check if current user owns this post
  const isOwner = post.owner_id === currentUserId;

  const handleEdit = async () => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          content: editContent,
          mood: editMood || null,
          privacy: editPrivacy,
          tags: editTags || null,
        })
        .eq("id", post.id);

      if (error) {
        console.error("Failed to update post:", error);
        alert("Failed to update post. Please try again.");
      } else {
        setIsEditing(false);
        onPostUpdated(); // Refresh the feed
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post.");
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this journal entry? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. Please try again.");
      } else {
        onPostUpdated(); // Refresh the feed
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content);
    setEditMood(post.mood || "");
    setEditPrivacy(post.privacy);
    setEditTags(post.tags || "");
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border-2 border-[#A78BFA]">
        <div className="flex items-start gap-3">
          <ProfileAvatar
            userId={post.owner_id}
            fallbackInitials={
              post.profiles
                ? `${post.profiles.first_name[0]}${post.profiles.last_name[0]}`.toUpperCase()
                : post.owner_id.substring(0, 2).toUpperCase()
            }
          />
          <div className="flex-1">
            <div className="mb-4">
              <p className="font-medium text-[#1F2937] mb-1">{displayName}</p>
              <span className="text-xs text-[#6B7280]">
                Editing • {formattedDate}
              </span>
            </div>

            {/* Edit form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
                  placeholder="Write your thoughts..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mood
                  </label>
                  <select
                    value={editMood}
                    onChange={(e) => setEditMood(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
                  >
                    <option value="">Select a mood...</option>
                    <option value="happy">😊 Happy</option>
                    <option value="sad">😢 Sad</option>
                    <option value="anxious">😰 Anxious</option>
                    <option value="calm">😌 Calm</option>
                    <option value="excited">🤩 Excited</option>
                    <option value="tired">😴 Tired</option>
                    <option value="grateful">🙏 Grateful</option>
                    <option value="frustrated">😤 Frustrated</option>
                    <option value="peaceful">☮️ Peaceful</option>
                    <option value="other">💭 Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Privacy
                  </label>
                  <select
                    value={editPrivacy}
                    onChange={(e) => setEditPrivacy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
                  >
                    <option value="private">🔒 Private</option>
                    <option value="friends">👥 Friends Only</option>
                    <option value="public">🌍 Public</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="work, family, goals..."
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={!editContent.trim()}
                  className="px-6 py-2 rounded-lg bg-[#A78BFA] text-white hover:bg-[#93C5FD] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6 group">
      <div className="flex items-start gap-3">
        <ProfileAvatar
          userId={post.owner_id}
          fallbackInitials={
            post.profiles
              ? `${post.profiles.first_name[0]}${post.profiles.last_name[0]}`.toUpperCase()
              : post.owner_id.substring(0, 2).toUpperCase()
          }
        />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#1F2937]">{displayName}</p>
                  <span className="text-xs text-[#6B7280]">
                    {formattedDate}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {post.mood && (
                    <span
                      className={`text-lg px-2 py-1 rounded-full ${moodStyle}`}
                      title={
                        post.mood.charAt(0).toUpperCase() + post.mood.slice(1)
                      }
                    >
                      {moodMap[post.mood] || "📝"}
                    </span>
                  )}

                  {/* Action buttons - only show if user owns the post */}
                  {isOwner && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-400 hover:text-[#A78BFA] hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit post"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete post"
                      >
                        {isDeleting ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#1F2937] whitespace-pre-line leading-relaxed">
            {post.content}
          </p>

          {/* Tags display */}
          {post.tags && (
            <div className="mt-3 flex flex-wrap gap-1">
              {post.tags.split(",").map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-[#F9FAFB] text-[#6B7280] rounded-full"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Feed({ posts, currentUserId, onPostUpdated }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <h2 className="font-['Playfair_Display'] text-2xl font-semibold text-[#1F2937] mb-6">
        Recent Journal Entries
      </h2>
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#6B7280]">No posts to display.</p>
          <p className="text-sm text-[#6B7280] mt-2">
            Create your first journal entry above!
          </p>
        </div>
      ) : (
        posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onPostUpdated={onPostUpdated}
          />
        ))
      )}
    </div>
  );
}
