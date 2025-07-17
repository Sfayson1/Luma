import React, { useState } from "react";
import { supabase } from "../supabaseClient";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: string) => void;
  user: { id: string };
  currentPrompt?: { id: number };
};

export default function JournalEntryModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  currentPrompt,
}: Props) {
  const [entry, setEntry] = useState("");
  const [mood, setMood] = useState("");
  const [privacy, setPrivacy] = useState("private");
  const [tags, setTags] = useState("");
  const [linkPrompt, setLinkPrompt] = useState(true);
  const [promptId] = useState<number | null>(currentPrompt?.id ?? null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const postData = {
      content: entry,
      mood: mood || null,
      privacy: privacy,
      tags: tags || null,
      owner_id: user.id,
      prompt_id: linkPrompt && promptId ? promptId : null,
      // Store current UTC time, but it will display in user's timezone
      created_at: new Date().toISOString(),
    };

    console.log("Submitting post data:", postData);

    const { error } = await supabase.from("posts").insert([postData]);

    if (error) {
      console.error("Failed to insert post:", error);
    } else {
      // Reset form and close
      setEntry("");
      setMood("");
      setPrivacy("private");
      setTags("");
      onClose();
      onSubmit(entry);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          New Journal Entry
        </h2>

        {/* Link to prompt */}
        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={linkPrompt}
              onChange={(e) => setLinkPrompt(e.target.checked)}
              className="focus:ring-[#A78BFA]"
            />
            <span className="text-sm text-gray-600">
              Link to today's prompt
              {currentPrompt && linkPrompt && (
                <span className="text-[#A78BFA] ml-1">
                  (Prompt #{currentPrompt.id})
                </span>
              )}
            </span>
          </label>
        </div>

        {/* Main content */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Journal Entry *
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 h-40 resize-none focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
            placeholder="Write your thoughts..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            required
          />
        </div>

        {/* Mood */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mood (optional)
          </label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
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
            <option value="other">Other</option>
          </select>
        </div>

        {/* Privacy */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Privacy
          </label>
          <select
            value={privacy}
            onChange={(e) => setPrivacy(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
          >
            <option value="private">🔒 Private</option>
            <option value="friends">👥 Friends Only</option>
            <option value="public">🌍 Public</option>
          </select>
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="work, family, goals, reflection..."
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate tags with commas
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!entry.trim()}
            className="px-6 py-2 rounded-lg bg-[#A78BFA] text-white hover:bg-[#93C5FD] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Entry
          </button>
        </div>
      </div>
    </div>
  );
}
