import React from "react";
import { ArrowLeft, Mail, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserGuideProps {
  onBack: () => void;
}

export function UserGuide({ onBack }: UserGuideProps) {
  return (
    <div className="max-w-4xl mx-auto bg-[hsl(var(--color-background))] min-h-screen">
      <header className="border-b border-[hsl(var(--color-border))] px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back to Help">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {/* Single H1 for the page */}
          <h1 className="text-xl font-semibold text-[hsl(var(--color-foreground))]">User Guide</h1>
        </div>
      </header>

      <main className="p-6">
        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-center mb-8">
            {/* Use H2 to keep a single H1 on the page */}
            <h2 className="text-4xl font-bold text-[hsl(var(--color-foreground))] mb-4">Luma User Guide</h2>
            <p className="text-xl text-[hsl(var(--color-muted-foreground))]">
              Welcome to Luma, your mindful journaling companion! This guide will help you get the most out of your journaling journey.
            </p>
          </div>

          {/* Table of Contents */}
          <Card className="mb-8 bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--color-foreground))]">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <a href="#getting-started" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Getting Started
                </a>
                <a href="#writing" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Writing Your First Entry
                </a>
                <a href="#mood-tracking" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Mood Tracking
                </a>
                <a href="#tags" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Working with Tags
                </a>
                <a href="#prompts" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Daily Prompts
                </a>
                <a href="#analytics" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Analytics & Insights
                </a>
                <a href="#privacy" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Privacy & Security
                </a>
                <a href="#settings" className="text-[hsl(var(--color-primary))] hover:underline flex items-center gap-1">
                  <ChevronRight className="h-4 w-4" /> Settings & Customization
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Getting Started Section */}
          <section id="getting-started" className="mb-12">
            <h3 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-6">Getting Started</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-3">Creating Your Account</h4>
                <ol className="list-decimal list-inside space-y-2 text-[hsl(var(--color-foreground))]">
                  <li>Visit the Luma app and click <strong>Sign Up</strong></li>
                  <li>Enter your email address and create a secure password</li>
                  <li>Verify your email address</li>
                  <li>Complete your profile setup (optional but recommended)</li>
                </ol>
              </div>
              <div>
                <h4 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-3">First Time Setup</h4>
                <p className="text-[hsl(var(--color-foreground))] mb-3">After signing up, you'll be guided through:</p>
                <ul className="list-disc list-inside space-y-2 text-[hsl(var(--color-foreground))]">
                  <li><strong>Privacy Settings</strong>: Choose default entry privacy (private/public)</li>
                  <li><strong>Writing Goals</strong>: Set your weekly journaling targets</li>
                  <li><strong>Notification Preferences</strong>: Enable writing reminders</li>
                  <li><strong>Theme Selection</strong>: Choose between light/dark mode or system preference</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Writing Section */}
          <section id="writing" className="mb-12">
            <h3 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-6">Writing Your First Entry</h3>
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-3">Creating a New Entry</h4>
                <ol className="list-decimal list-inside space-y-2 text-[hsl(var(--color-foreground))]">
                  <li>Click the <strong>+ New Entry</strong> button on your dashboard</li>
                  <li>Choose to write freely or use a daily prompt</li>
                  <li>Start writing your thoughts, feelings, or experiences</li>
                  <li>Add a mood and tags (optional)</li>
                  <li>Set privacy level (private by default)</li>
                  <li>Click <strong>Save</strong> when finished</li>
                </ol>
              </div>

              <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
                <CardContent className="pt-6">
                  <h5 className="font-semibold text-[hsl(var(--color-foreground))] mb-3">Entry Features</h5>
                  <ul className="list-disc list-inside space-y-1 text-[hsl(var(--color-foreground))]">
                    <li><strong>Auto-save</strong>: Your writing is automatically saved as you type</li>
                    <li><strong>Word Count</strong>: Track your writing progress in real-time</li>
                    <li><strong>Rich Text</strong>: Format your entries with basic text styling</li>
                    <li><strong>Privacy Toggle</strong>: Switch between private and public entries</li>
                    <li><strong>Edit & Delete</strong>: Modify or remove entries anytime</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Mood Tracking Section */}
          <section id="mood-tracking" className="mb-12">
            <h3 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-6">Using Mood Tracking</h3>
            <div className="space-y-6">
              <p className="text-[hsl(var(--color-foreground))]">Luma helps you understand emotional patterns through mood tagging.</p>
              <div>
                <h4 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-3">Available Moods</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--color-accent))]">
                      <span className="text-2xl">😊</span>
                      <div>
                        <p className="font-medium text-[hsl(var(--color-foreground))]">Great</p>
                        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Feeling fantastic, energized, positive</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--color-accent))]">
                      <span className="text-2xl">😌</span>
                      <div>
                        <p className="font-medium text-[hsl(var(--color-foreground))]">Good</p>
                        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Content, balanced, peaceful</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--color-accent))]">
                      <span className="text-2xl">😐</span>
                      <div>
                        <p className="font-medium text-[hsl(var(--color-foreground))]">Okay</p>
                        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Neutral, neither good nor bad</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--color-accent))]">
                      <span className="text-2xl">😔</span>
                      <div>
                        <p className="font-medium text-[hsl(var(--color-foreground))]">Low</p>
                        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Sad, down, unmotivated</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[hsl(var(--color-accent))]">
                      <span className="text-2xl">😰</span>
                      <div>
                        <p className="font-medium text-[hsl(var(--color-foreground))]">Difficult</p>
                        <p className="text-sm text-[hsl(var(--color-muted-foreground))]">Anxious, stressed, struggling</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tags Section */}
          <section id="tags" className="mb-12">
            <h3 className="text-3xl font-bold text-[hsl(var(--color-foreground))] mb-6">Working with Tags</h3>
            <div className="space-y-6">
              <p className="text-[hsl(var(--color-foreground))]">Tags help organize and categorize your journal entries for easy searching and reflection.</p>
              <div>
                <h4 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-3">Types of Tags</h4>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-[hsl(var(--color-accent))] text-[hsl(var(--color-foreground))]">#work</span>
                    <span className="px-3 py-1 rounded-full text-sm bg-[hsl(var(--color-accent))] text-[hsl(var(--color-foreground))]">#relationships</span>
                    <span className="px-3 py-1 rounded-full text-sm bg-[hsl(var(--color-accent))] text-[hsl(var(--color-foreground))]">#health</span>
                    <span className="px-3 py-1 rounded-full text-sm bg-[hsl(var(--color-accent))] text-[hsl(var(--color-foreground))]">#burnout</span>
                    <span className="px-3 py-1 rounded-full text-sm bg-[hsl(var(--color-accent))] text-[hsl(var(--color-foreground))]">#gratitude</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[hsl(var(--color-foreground))]">
                    <li><strong>Predefined Tags</strong>: Common topics like #work, #relationships, #health</li>
                    <li><strong>Custom Tags</strong>: Create your own like #burnout, #gratitude, #goals</li>
                    <li><strong>Mood-Related</strong>: #anxiety, #joy, #stress</li>
                  </ul>
                </div>
              </div>
              <Card className="bg-[hsl(var(--color-background))] border-[hsl(var(--color-border))]">
                <CardContent className="pt-6">
                  <h5 className="font-semibold text-[hsl(var(--color-foreground))] mb-3">Tag Best Practices</h5>
                  <ul className="list-disc list-inside space-y-1 text-[hsl(var(--color-foreground))]">
                    <li>Keep tags short and specific</li>
                    <li>Use consistent naming (e.g., always use #work not #job)</li>
                    <li>Create tags for recurring themes in your life</li>
                    <li>Review and clean up unused tags periodically</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-16 pt-8 border-t border-[hsl(var(--color-border))]">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-[hsl(var(--color-foreground))] mb-4">Need More Help?</h4>
              <p className="text-[hsl(var(--color-muted-foreground))] mb-6">
                Contact our support team - we're here to help you make the most of your journaling experience!
              </p>
              <div className="flex justify-center gap-4">
                <a href="mailto:support@luma.app">
                  <Button className="bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </section>

          <div className="mt-12 p-6 border border-[hsl(var(--color-border))] rounded-lg text-center bg-[hsl(var(--color-accent))]">
            <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
              <em>Remember: Luma is designed to support your mental wellness journey, but it's not a substitute for professional mental health treatment. If you're experiencing a crisis, please contact emergency services or a mental health professional immediately.</em>
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}

export default UserGuide;
