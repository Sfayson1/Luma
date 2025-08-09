import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Textarea } from './textarea';
import { Switch } from './switch';
import { Label } from './label';
import { PenTool, Eye, EyeOff } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';

interface CreateJournalProps {
  onSubmit: (entry: { title: string; content: string; isPrivate: boolean; isAnonymous: boolean; mood: 'great' | 'good' | 'okay' | 'low' | 'difficult'; hashtags: string[] }) => void;
}

export const CreateJournal = ({ onSubmit }: CreateJournalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [mood, setMood] = useState<'great' | 'good' | 'okay' | 'low' | 'difficult'>('okay');
  const [hashtagsInput, setHashtagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const tags = Array.from(new Set(
        hashtagsInput
          .split(/[\s,]+/)
          .map(t => t.trim())
          .filter(Boolean)
          .map(t => (t.startsWith('#') ? t : `#${t}`))
      ));
      onSubmit({ title: title.trim(), content: content.trim(), isPrivate, isAnonymous, mood, hashtags: tags });
      setTitle('');
      setContent('');
      setHashtagsInput('');
    }
  };

  return (
    <Card className="sticky top-6 shadow-[var(--shadow-gentle)] border-[hsl(var(--color-border)_/_0.5)] bg-[linear-gradient(to_bottom_right,hsl(var(--color-background)),hsl(var(--color-gentle)))]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[hsl(var(--color-foreground))]">
          <PenTool className="h-5 w-5 text-[hsl(var(--color-primary))]" />
          Create Journal Entry
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="What's on your mind today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-[hsl(var(--color-border)_/_0.5)] focus:ring-[hsl(var(--color-primary)_/_0.2)] focus:border-[hsl(var(--color-primary))] transition-[var(--transition-gentle)]"
            />
          </div>

          <div>
            <Textarea
              placeholder="Express your thoughts and feelings..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="border-[hsl(var(--color-border)_/_0.5)] focus:ring-[hsl(var(--color-primary)_/_0.2)] focus:border-[hsl(var(--color-primary))] transition-[var(--transition-gentle)] resize-none"
            />
          </div>

          <div className="p-3 bg-[hsl(var(--color-serenity)_/_0.5)] rounded-lg border border-[hsl(var(--color-border)_/_0.3)]">
            <Label htmlFor="mood" className="text-sm font-medium mb-2 block">Mood</Label>
            <Select value={mood} onValueChange={(v) => setMood(v as any)}>
              <SelectTrigger id="mood">
                <SelectValue placeholder="Select your mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="great">Great</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="okay">Okay</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="difficult">Difficult</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 bg-[hsl(var(--color-serenity)_/_0.5)] rounded-lg border border-[hsl(var(--color-border)_/_0.3)]">
            <Label htmlFor="hashtags" className="text-sm font-medium mb-2 block">Hashtags</Label>
            <Input
              id="hashtags"
              placeholder="#gratitude, #selfcare"
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              className="border-[hsl(var(--color-border)_/_0.5)] focus:ring-[hsl(var(--color-primary)_/_0.2)] focus:border-[hsl(var(--color-primary))] transition-[var(--transition-gentle)]"
            />
            <p className="text-xs text-[hsl(var(--color-muted-foreground))] mt-2">Separate with commas or spaces. We'll add the # automatically.</p>
          </div>

          <div className="flex items-center justify-between p-3 bg-[hsl(var(--color-serenity)_/_0.5)] rounded-lg border border-[hsl(var(--color-border)_/_0.3)]">
            <div className="flex items-center gap-2">
              {isPrivate ? (
                <EyeOff className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
              ) : (
                <Eye className="h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
              )}
              <Label htmlFor="privacy-toggle" className="text-sm font-medium cursor-pointer">
                {isPrivate ? 'Private (only you can see this)' : 'Public (visible to community)'}
              </Label>
            </div>
            <Switch
              id="privacy-toggle"
              checked={isPrivate}
              onCheckedChange={setIsPrivate}
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-[hsl(var(--color-serenity)_/_0.7)] rounded-lg border border-[hsl(var(--color-border)_/_0.3)]">
            <div className="flex items-center gap-2">
              <Label htmlFor="anonymous-toggle" className="text-sm font-medium cursor-pointer">
                Post anonymously
              </Label>
              <span className="text-sm text-[hsl(var(--color-muted-foreground))]">
                Hide your name and avatar on public feeds.
              </span>
            </div>
            <Switch
              id="anonymous-toggle"
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[linear-gradient(to_right,hsl(var(--color-primary)),hsl(var(--color-healing)))] hover:bg-[linear-gradient(to_right,hsl(var(--color-primary)_/_0.9),hsl(var(--color-healing)_/_0.9))] text-[hsl(var(--color-primary-foreground))] shadow-[var(--shadow-gentle)] hover:shadow-[var(--shadow-warm)] transition-[var(--transition-gentle)] disabled:opacity-50"
            disabled={!title.trim() || !content.trim()}
          >
            Share Your Journey
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
