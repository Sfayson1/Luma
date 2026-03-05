// src/demo/useDemoPosts.ts
// Drop-in replacement for whatever hook/service currently calls /api/posts/
// Returns the same shape your real API does, but from local state.
// Writes (create, update, delete) mutate state only — nothing hits the network.

import { useState } from "react";
import { DEMO_POSTS, DEMO_PROMPT, Post, computeDemoAnalytics } from "./mockData";

let nextId = DEMO_POSTS.length + 1;

export function useDemoPosts() {
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);

  const getPosts = () => posts;

  const getPost = (id: number) => posts.find((p) => p.id === id) ?? null;

  const createPost = (data: { title: string; content: string; mood: Post['mood']; tags: string[] }) => {
    const newPost: Post = {
      id: nextId++,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id: number, data: Partial<Pick<Post, "title" | "content" | "mood" | "tags">>) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...data, updated_at: new Date().toISOString() } : p
      )
    );
  };

  const deletePost = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const getPrompt = () => DEMO_PROMPT;

  const analytics = computeDemoAnalytics(posts);

  return {
    posts,
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    getPrompt,
    analytics,
  };
}
