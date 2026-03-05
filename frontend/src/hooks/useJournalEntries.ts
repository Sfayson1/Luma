import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useToast } from "./use-toast";
import { useAuth } from "./useAuth";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  author: string;
  user_id: string;
  timestamp: string;
  is_private: boolean;
  mood: "great" | "good" | "okay" | "low" | "difficult";
  hashtags: string[];
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
}

// Maps a backend PostOutWithUser object to the frontend JournalEntry shape
function mapPost(post: any): JournalEntry {
  const dateStr = post.date_posted ?? new Date().toISOString().split("T")[0];
  const authorName = post.owner
    ? `${post.owner.first_name} ${post.owner.last_name}`.trim()
    : "Anonymous";
  return {
    id: String(post.id),
    title: post.content?.split("\n")[0]?.slice(0, 60) ?? "",
    content: post.content ?? "",
    author: authorName,
    user_id: String(post.owner_id),
    timestamp: dateStr,
    is_private: post.privacy === "private",
    mood: post.mood ?? "okay",
    hashtags: post.tags
      ? post.tags.split(",").map((t: string) => t.trim().replace(/^#+/, '')).filter(Boolean)
      : [],
    likes: 0,
    comments: 0,
    created_at: dateStr,
    updated_at: dateStr,
  };
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<any[]>("/api/posts/");
      setEntries((data || []).map(mapPost));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch entries";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: {
    title: string;
    content: string;
    is_private: boolean;
      mood?: "great" | "good" | "okay" | "low" | "difficult";
    hashtags?: string[];
  }) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create entries",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        content: entry.content,
        mood: entry.mood ?? "okay",
        privacy: entry.is_private ? "private" : "public",
        tags: entry.hashtags?.join(",") ?? "",
      };

      const data = await apiFetch<any>("/api/posts/", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const newEntry = mapPost({ ...data, owner: user });
      setEntries((prev) => [newEntry, ...prev]);

      toast({
        title: "Success",
        description: "Journal entry created successfully",
      });

      return newEntry;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create entry";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const updateEntry = async (
    id: string,
    updates: {
      title?: string;
      content?: string;
      is_private?: boolean;
          mood?: "great" | "good" | "okay" | "low" | "difficult";
      hashtags?: string[];
    }
  ) => {
    if (!user) return;
    try {
      const payload: Record<string, any> = {};
      if (updates.content !== undefined) payload.content = updates.content;
      if (updates.mood !== undefined) payload.mood = updates.mood;
      if (updates.is_private !== undefined)
        payload.privacy = updates.is_private ? "private" : "public";
      if (updates.hashtags !== undefined)
        payload.tags = updates.hashtags.join(",");

      const data = await apiFetch<any>(`/api/posts/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const updated = mapPost(data);
      setEntries((prev) =>
        prev.map((e) => (e.id === String(id) ? updated : e))
      );

      toast({
        title: "Success",
        description: "Journal entry updated successfully",
      });

      return updated;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update entry";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;
    try {
      await apiFetch(`/api/posts/${id}`, { method: "DELETE" });
      setEntries((prev) => prev.filter((e) => e.id !== String(id)));

      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete entry";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [user]);

  return {
    entries,
    loading,
    error,
    createEntry,
    updateEntry,
    deleteEntry,
    refreshEntries: fetchEntries,
  };
}
