import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Card, CardContent } from './card';
import { Button } from './button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './alert-dialog';
import { EditJournalModal } from './edit-journal-modal';
import { Sun, Smile, Meh, Cloud, CloudRain, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './dropdown-menu';
import { JournalEntry } from '../../hooks/useJournalEntries';

interface SimpleJournalCardProps {
  entry: JournalEntry & { timestamp: string };
  onEdit?: (id: string, updates: {
    title?: string;
    content?: string;
    is_private?: boolean;
    mood?: 'great' | 'good' | 'okay' | 'low' | 'difficult';
    hashtags?: string[];
  }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  showManagement?: boolean;
  avatarUrl?: string | null;
}

const moodIcons = {
  great: Sun,
  good: Smile,
  okay: Meh,
  low: Cloud,
  difficult: CloudRain
};

const moodColors = {
  great: 'bg-[hsl(142_69%_95%)] text-[hsl(142_69%_40%)] border-[hsl(142_69%_80%)]',
  good: 'bg-[hsl(200_80%_95%)] text-[hsl(200_80%_40%)] border-[hsl(200_80%_80%)]',
  okay: 'bg-[hsl(45_100%_95%)] text-[hsl(45_100%_40%)] border-[hsl(45_100%_80%)]',
  low: 'bg-[hsl(210_16%_95%)] text-[hsl(210_16%_40%)] border-[hsl(210_16%_80%)]',
  difficult: 'bg-[hsl(var(--color-healing)_/_0.1)] text-[hsl(var(--color-healing))] border-[hsl(var(--color-healing)_/_0.3)]'
};

export const SimpleJournalCard = ({ entry, onEdit, onDelete, showManagement = false, avatarUrl }: SimpleJournalCardProps) => {
  const MoodIcon = moodIcons[entry.mood];
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Respect anonymity across all views
  const isAnonymous = entry.is_anonymous;
  const displayName = isAnonymous ? 'Anonymous' : entry.author;
  const initials = isAnonymous ? 'A' : entry.author.split(' ').map(n => n[0]).join('');
  const avatarSrc = isAnonymous ? null : avatarUrl;

  const handleEdit = async (updates: any) => {
    if (onEdit) {
      await onEdit(entry.id, updates);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(entry.id);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <Card style={{ border: '1px solid hsl(var(--color-border))' }} className="w-full bg-[hsl(var(--color-card))] hover:shadow-[var(--shadow-warm)] transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-10 h-10">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc || undefined} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))] text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-[hsl(var(--color-foreground))]">{displayName}</span>
                  <span className="text-sm text-[hsl(var(--color-muted-foreground))]">{entry.timestamp}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`${moodColors[entry.mood]} border flex items-center gap-1`}>
                    <MoodIcon className="h-3 w-3" />
                    {entry.mood}
                  </Badge>

                  {showManagement && (onEdit || onDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[hsl(var(--color-background))] border border-[hsl(var(--color-border))]">
                        {onEdit && (
                          <DropdownMenuItem onClick={() => setEditModalOpen(true)} className="gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => setDeleteDialogOpen(true)}
                            className="gap-2 text-[hsl(var(--color-destructive))] focus:text-[hsl(var(--color-destructive))]"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-[hsl(var(--color-foreground))] mb-2">{entry.title}</h3>

              <div
                className="text-[hsl(var(--color-foreground))] text-sm leading-relaxed mb-3 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />

              {entry.hashtags && entry.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.hashtags.map((tag, index) => (
                    <span key={index} className="text-xs text-[hsl(var(--color-primary))]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {editModalOpen && onEdit && (
        <EditJournalModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          entry={entry}
          onSave={handleEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-[hsl(var(--color-destructive))] hover:bg-[hsl(var(--color-destructive)_/_0.9)]">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
