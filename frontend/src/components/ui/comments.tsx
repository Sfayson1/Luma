import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Save, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type CommentRow = {
  id: string;
  entry_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_anonymous: boolean;
  created_at: string;
};

export function CommentsSection({ entryId, entryOwnerId }: { entryId: string; entryOwnerId: string }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [profilesByUser, setProfilesByUser] = useState<Record<string, { avatar_url: string | null; name: string | null }>>({});

  const canPostAnonymously = user?.id === entryOwnerId;

  const fetchComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("id, entry_id, user_id, parent_id, content, is_anonymous, created_at")
      .eq("entry_id", entryId)
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setComments(data || []);

    // Fetch avatars for non-anonymous commenters
    const ids = Array.from(new Set((data || []).filter((c) => !c.is_anonymous).map((c) => c.user_id)));
    if (ids.length) {
      const { data: profs, error: pErr } = await supabase
        .from("profiles")
        .select("user_id, avatar_url, name")
        .in("user_id", ids);
      if (!pErr && profs) {
        const map: Record<string, { avatar_url: string | null; name: string | null }> = {};
        profs.forEach((p: any) => {
          map[p.user_id] = { avatar_url: p.avatar_url ?? null, name: p.name ?? null };
        });
        setProfilesByUser(map);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryId]);

  const addComment = async () => {
    if (!user) {
      toast({ title: "Sign in required", description: "Log in to comment.", variant: "destructive" });
      return;
    }
    const trimmed = content.trim();
    if (!trimmed) return;

    setSubmitting(true);
    // optimistic
    const optimistic: CommentRow = {
      id: `temp-${Date.now()}`,
      entry_id: entryId,
      user_id: user.id,
      parent_id: null,
      content: trimmed,
      is_anonymous: canPostAnonymously ? anonymous : false,
      created_at: new Date().toISOString(),
    };
    setComments((c) => [...c, optimistic]);
    setContent("");

    const { error } = await supabase.from("comments").insert({
      entry_id: entryId,
      user_id: user.id,
      content: trimmed,
      is_anonymous: canPostAnonymously ? anonymous : false,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      // revert
      setComments((c) => c.filter((cm) => cm.id !== optimistic.id));
    } else {
      fetchComments();
    }
    setSubmitting(false);
  };

  const startEdit = (c: CommentRow) => {
    setEditingId(c.id);
    setEditContent(c.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const trimmed = editContent.trim();
    if (!trimmed) {
      toast({ title: "Empty comment", description: "Write something before saving.", variant: "destructive" });
      return;
    }
    setProcessingId(editingId);
    const { error } = await supabase.from("comments").update({ content: trimmed }).eq("id", editingId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated", description: "Comment updated successfully." });
      await fetchComments();
      cancelEdit();
    }
    setProcessingId(null);
  };

  const deleteComment = async (id: string) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;
    setProcessingId(id);
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Comment deleted." });
      setComments((c) => c.filter((cm) => cm.id !== id));
    }
    setProcessingId(null);
  };

  return (
    <div
      className="mt-4 rounded-md bg-[hsl(var(--color-background))]"
      style={{ border: '1px solid hsl(var(--color-border))' }}
    >
      <div className="p-4">
        <h4 className="text-sm font-semibold text-[hsl(var(--color-foreground))]">Comments</h4>
      </div>
      <Separator />

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-sm text-[hsl(var(--color-muted-foreground))]">Loading comments…</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-[hsl(var(--color-muted-foreground))]">Be the first to comment.</div>
        ) : (
          <ul className="space-y-3">
            {comments.map((c) => {
              const canEdit = user?.id === c.user_id;
              const canDelete = canEdit || user?.id === entryOwnerId;
              const isEditing = editingId === c.id;
              return (
                <li key={c.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    {!c.is_anonymous && profilesByUser[c.user_id]?.avatar_url ? (
                      <AvatarImage
                        src={profilesByUser[c.user_id]?.avatar_url || undefined}
                        alt={(profilesByUser[c.user_id]?.name || "User avatar") as string}
                      />
                    ) : null}
                    <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))] text-xs">
                      {c.is_anonymous ? "A" : (profilesByUser[c.user_id]?.name?.charAt(0).toUpperCase() || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-xs text-[hsl(var(--color-muted-foreground))] mb-1">
                      {c.is_anonymous ? "Anonymous" : c.user_id === user?.id ? "You" : "Member"}
                      <span className="mx-2">•</span>
                      {new Date(c.created_at).toLocaleString()}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))]"
                          style={{ border: '1px solid hsl(var(--color-border))' }}
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={saveEdit}
                            disabled={processingId === c.id || !editContent.trim()}
                            className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]"
                          >
                            <Save className="h-4 w-4 mr-1" /> Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            className="text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                            style={{ border: '1px solid hsl(var(--color-border))' }}
                          >
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-[hsl(var(--color-foreground))] whitespace-pre-wrap">{c.content}</div>
                    )}
                  </div>
                  {(canEdit || canDelete) && !isEditing && (
                    <div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="min-w-[160px] bg-[hsl(var(--color-background))]"
                          style={{ border: '1px solid hsl(var(--color-border))' }}
                        >
                          {canEdit && (
                            <DropdownMenuItem
                              onClick={() => startEdit(c)}
                              className="cursor-pointer text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))]"
                            >
                              <Pencil className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                          )}
                          {canDelete && (
                            <DropdownMenuItem
                              onClick={() => deleteComment(c.id)}
                              className="cursor-pointer text-[hsl(var(--color-destructive))] hover:bg-[hsl(var(--color-destructive)_/_0.1)] focus:text-[hsl(var(--color-destructive))]"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Separator />

      <div className="p-4 space-y-2">
        <Textarea
          placeholder="Write a comment…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))]"
          style={{ border: '1px solid hsl(var(--color-border))' }}
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-[hsl(var(--color-muted-foreground))]">
            {canPostAnonymously ? (
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  style={{ borderColor: 'hsl(var(--color-border))' }}
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                />
                Post anonymously
              </label>
            ) : (
              <span>Only the entry owner may post anonymously.</span>
            )}
          </div>
          <Button
            onClick={addComment}
            disabled={submitting || !content.trim()}
            className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]"
          >
            {submitting ? "Posting…" : "Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}
