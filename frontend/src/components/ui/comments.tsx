export type CommentRow = {
  id: string;
  entry_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_anonymous: boolean;
  created_at: string;
};

export function CommentsSection(_props: { entryId: string; entryOwnerId: string }) {
  return (
    <div className="mt-4 rounded-md p-4 text-sm text-[hsl(var(--color-muted-foreground))]" style={{ border: '1px solid hsl(var(--color-border))' }}>
      Comments coming soon.
    </div>
  );
}
