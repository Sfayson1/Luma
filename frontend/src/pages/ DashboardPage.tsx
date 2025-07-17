import React, { useEffect, useState } from "react";
import JournalEntryModal from "../components/JournalEntryModal";
import { supabase } from "../supabaseClient";
import Feed from "../components/FeedPost";

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
    console.log("Post submitted!");
    fetchPosts(); // Refresh the feed
    setIsModalOpen(false);
  };

  const fetchPosts = async () => {
    console.log("fetchPosts called");
    try {
      // Get current user first
      const { data: { user }, error: userError } = await supabase.auth.getUser();

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
      console.log("Owner IDs from posts:", ownerIds);

      // Get profiles for those owners
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ownerIds);

      console.log("Profiles data:", profiles, profilesError);

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

      console.log("Posts with profiles:", postsWithProfiles);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-['Inter']">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <div className="text-4xl font-['Playfair_Display'] font-bold text-[#A78BFA]">
            Luma
          </div>
        </div>
      </header>

      <div className="px-6 py-16">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-md">
          <h3 className="font-['Playfair_Display'] text-2xl font-semibold text-[#1F2937] mb-4">
            Prompt of the Day
          </h3>
          <p className="text-[#6B7280] mb-4 leading-relaxed">
            {currentPrompt?.content}
          </p>
          {currentPrompt?.id && (
            <p className="text-xs text-[#6B7280] mb-4">
              Prompt ID: {currentPrompt.id}
            </p>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#A78BFA] hover:bg-[#93C5FD] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Journal Entry
          </button>
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
