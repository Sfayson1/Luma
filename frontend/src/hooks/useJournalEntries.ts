import { useState, useEffect } from "react";
import { supabase } from "../integrations/supabase/client";
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
  is_anonymous?: boolean;
  mood: "great" | "good" | "okay" | "low" | "difficult";
  hashtags: string[];
  likes: number;
  comments: number;
  created_at: string;
  updated_at: string;
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch entries
  const fetchEntries = async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEntries(
        (data || []).map((entry) => ({
          ...entry,
          content: entry.content ?? "",
          author: entry.author ?? "Anonymous",
          hashtags: entry.hashtags ?? [],
        }))
      );
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

  // Create new entry
  const createEntry = async (entry: {
    title: string;
    content: string;
    is_private: boolean;
    is_anonymous?: boolean;
    mood?: "great" | "good" | "okay" | "low" | "difficult";
    hashtags?: string[];
  }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create entries",
          variant: "destructive",
        });
        return;
      }

      const newEntry = {
        ...entry,
        user_id: user.id,
        author: user.user_metadata?.name || user.email || "Anonymous",
        mood: entry.mood || "okay",
        hashtags: entry.hashtags || [],
        likes: 0,
        comments: 0,
        is_anonymous: entry.is_anonymous ?? false,
      };

      const { data, error } = await supabase
        .from("journal_entries")
        .insert([newEntry])
        .select()
        .single();

      if (error) throw error;

      // Add to local state for immediate UI update
      setEntries((prev) => [
        {
          ...data,
          content: data.content ?? "",
          author: data.author ?? "Anonymous",
          hashtags: data.hashtags ?? [],
        },
        ...prev,
      ]);

      toast({
        title: "Success",
        description: "Journal entry created successfully",
      });

      return data;
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

  // Update entry
  const updateEntry = async (
    id: string,
    updates: {
      title?: string;
      content?: string;
      is_private?: boolean;
      is_anonymous?: boolean;
      mood?: "great" | "good" | "okay" | "low" | "difficult";
      hashtags?: string[];
    }
  ) => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user?.id)
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setEntries((prev) => [
        {
            ...(data as JournalEntry),
            content: data.content ?? "",
            author: data.author ?? "Anonymous",
            hashtags: data.hashtags ?? [],
        },
        ...prev,
      ]);

      toast({
        title: "Success",
        description: "Journal entry updated successfully",
      });

      return data;
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

  // Delete entry
  const deleteEntry = async (id: string) => {
    if (!user?.id) return;
    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      // Remove from local state
      setEntries((prev) => prev.filter((entry) => entry.id !== id));

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
