import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { RichTextEditor } from './rich-text-editor';
import { JournalEntry } from '../../hooks/useJournalEntries';
import { Save, X } from 'lucide-react';

interface EditJournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: JournalEntry;
  onSave: (updates: {
    title: string;
    content: string;
    is_private: boolean;
    mood: 'great' | 'good' | 'okay' | 'low' | 'difficult';
    hashtags: string[];
  }) => Promise<void>;
}

export const EditJournalModal = ({ open, onOpenChange, entry, onSave }: EditJournalModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_private: true,
    mood: 'okay' as 'great' | 'good' | 'okay' | 'low' | 'difficult',
    hashtags: [] as string[]
  });
  const [hashtagInput, setHashtagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when entry changes
  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title,
        content: entry.content,
        is_private: entry.is_private,
        mood: entry.mood,
        hashtags: entry.hashtags || []
      });
      setHashtagInput((entry.hashtags || []).join(', '));
    }
  }, [entry]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setIsSubmitting(true);
    try {
      const hashtags = hashtagInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await onSave({
        ...formData,
        hashtags
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = hashtagInput.trim();
      if (newTag && !formData.hashtags.includes(newTag)) {
        const updatedTags = [...formData.hashtags, newTag];
        setFormData(prev => ({ ...prev, hashtags: updatedTags }));
        setHashtagInput(updatedTags.join(', '));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your entry a title..."
              required
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              content={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
              placeholder="What's on your mind today?"
            />
          </div>

          {/* Mood and Privacy Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Mood */}
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select
                value={formData.mood}
                onValueChange={(value: 'great' | 'good' | 'okay' | 'low' | 'difficult') =>
                  setFormData(prev => ({ ...prev, mood: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="great">😄 Great</SelectItem>
                  <SelectItem value="good">😊 Good</SelectItem>
                  <SelectItem value="okay">😐 Okay</SelectItem>
                  <SelectItem value="low">😔 Low</SelectItem>
                  <SelectItem value="difficult">😟 Difficult</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Privacy */}
            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch
                  id="privacy"
                  checked={!formData.is_private}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, is_private: !checked }))
                  }
                />
                <span className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  {formData.is_private ? 'Private' : 'Public'}
                </span>
              </div>
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-2">
            <Label htmlFor="hashtags">Tags (comma-separated)</Label>
            <Input
              id="hashtags"
              value={hashtagInput}
              onChange={(e) => setHashtagInput(e.target.value)}
              onKeyDown={handleAddHashtag}
              placeholder="reflection, gratitude, goals..."
            />
            {formData.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))] px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-[hsl(var(--color-primary)_/_0.2)]"
                    onClick={() => {
                      const newTags = formData.hashtags.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, hashtags: newTags }));
                      setHashtagInput(newTags.join(', '));
                    }}
                  >
                    #{tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[hsl(var(--color-border))]">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
