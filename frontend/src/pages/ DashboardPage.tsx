import React, { useEffect, useState } from "react";
import JournalEntryModal from "../components/JournalEntryModal";
import { supabase } from "../supabaseClient";
import Feed from "../components/FeedPost";
import { notificationService } from '../services/notificationService';


// Define the type for posts with profiles
type PostWithProfile = {
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

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentPrompt, setCurrentPrompt] = useState<any>(null);
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const handleJournalSubmit = async (entry: string) => {
    fetchPosts(); // Refresh the feed
    setIsModalOpen(false);
  };

  const fetchPosts = async () => {
    try {
      // Get current user first
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not authenticated:", userError);
        return;
      }

      // Fetch posts with privacy filter
      const { data: posts, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .not("created_at", "is", null)
        .or(`privacy.eq.public,owner_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching posts:", postsError);
        return;
      }

      // Get unique owner IDs from posts
      const ownerIds = [...new Set(posts?.map((post) => post.owner_id))];

      // Get profiles for those owners
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ownerIds);

      // Combine posts with profiles
      const postsWithProfiles =
        posts?.map((post) => {
          const profile = profiles?.find((p) => p.id === post.owner_id);
          return {
            ...post,
            profiles: profile || {
              first_name: "Unknown",
              last_name: "User",
              username: post.owner_id.substring(0, 8),
            },
          };
        }) || [];
      setPosts(postsWithProfiles);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const fetchRandomPrompt = async () => {
    try {
      const { data, error } = await supabase.from("prompts").select("*");

      if (error || !data || data.length === 0) {
        console.warn("No prompts found, setting default.");
        setDefaultPrompt();
        return;
      }

      const randomIndex = Math.floor(Math.random() * data.length);
      setCurrentPrompt(data[randomIndex]);
    } catch (error) {
      console.error("Error fetching prompt:", error);
      setDefaultPrompt();
    }
  };

  const setDefaultPrompt = () => {
    setCurrentPrompt({
      id: null,
      content: "What's something you wish others understood about you?",
      date_created: new Date().toISOString().split("T")[0],
    });
  };

  // Callback function to refresh posts after edit/delete
  const handlePostUpdated = () => {
    fetchPosts();
  };

  useEffect(() => {
    const checkDailyReminder = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user hasn't journaled today
        const today = new Date().toISOString().split('T')[0];
        const { data: todayPosts } = await supabase
          .from('posts')
          .select('id')
          .eq('owner_id', user.id)
          .gte('created_at', today + 'T00:00:00.000Z')
          .lt('created_at', today + 'T23:59:59.999Z');

        if (!todayPosts || todayPosts.length === 0) {
          // User hasn't journaled today - check their reminder preferences
          const preferences = await notificationService.getUserPreferences(user.id);
          if (preferences?.reminder_enabled) {
            // Could show in-app reminder or send notification
          }
        }
      }
    };

    checkDailyReminder();
  }, []);

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
      } else {
        console.error("User fetch error:", userError);
      }

      await fetchRandomPrompt();
      await fetchPosts();
      setLoading(false);
    };

    initializeDashboard();
  }, []);

  // Get dynamic button colors based on current color scheme


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Loading your journal...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter'] transition-colors duration-300">

      <div className="px-6 py-16">
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 transition-colors duration-300">
            Prompt of the Day
          </h3>
          <p className="bg-[#A78BFA]text-gray-600 dark:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">
            {currentPrompt?.content}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#A78BFA] hover:bg-[#93C5FD] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            ✨ Start Writing
          </button>
        </div>

        {/* Daily Progress Card */}
        <div className="max-w-xl mx-auto mt-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
                Today's Progress
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Keep your streak going!
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">🔥</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
            </div>
          </div>
        </div>
      </div>

      {user && (
        <JournalEntryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleJournalSubmit}
          user={user}
          currentPrompt={currentPrompt}
        />
      )}

      <Feed
        posts={posts}
        currentUserId={user?.id || ""}
        onPostUpdated={handlePostUpdated}
      />
    </div>
  );
}
