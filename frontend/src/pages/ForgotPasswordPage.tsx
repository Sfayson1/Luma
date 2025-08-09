import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Heart, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate password reset email
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email) {
        setEmailSent(true);
      } else {
        setError('Please enter your email address');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_bottom_right,hsl(var(--color-background)),hsl(var(--color-gentle)),hsl(var(--color-serenity)_/_0.2))] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-[var(--shadow-warm)] border-[hsl(var(--color-border)_/_0.5)] bg-[hsl(var(--color-card)_/_0.8)] backdrop-blur text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-[linear-gradient(to_bottom_right,hsl(var(--color-primary)),hsl(var(--color-healing)))] flex items-center justify-center">
                  <Mail className="h-8 w-8 text-[hsl(var(--color-primary-foreground))]" />
                </div>
              </div>
              <CardTitle className="text-[hsl(var(--color-foreground))]">Check your email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-[hsl(var(--color-muted-foreground))]">
                We've sent password reset instructions to{' '}
                <span className="font-medium text-[hsl(var(--color-foreground))]">{email}</span>
              </p>
              <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setEmailSent(false)}
                  variant="outline"
                  className="w-full border-[hsl(var(--color-primary)_/_0.2)] text-[hsl(var(--color-primary))] hover:bg-[hsl(var(--color-primary)_/_0.05)]"
                >
                  Send again
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  className="w-full bg-[linear-gradient(to_right,hsl(var(--color-primary)),hsl(var(--color-healing)))] hover:bg-[linear-gradient(to_right,hsl(var(--color-primary)_/_0.9),hsl(var(--color-healing)_/_0.9))] text-[hsl(var(--color-primary-foreground))]"
                >
                  Back to sign in
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom_right,hsl(var(--color-background)),hsl(var(--color-gentle)),hsl(var(--color-serenity)_/_0.2))] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-full bg-[linear-gradient(to_bottom_right,hsl(var(--color-primary)),hsl(var(--color-healing)))] flex items-center justify-center">
              <Heart className="h-5 w-5 text-[hsl(var(--color-primary-foreground))]" />
            </div>
            <span className="text-2xl font-bold bg-[linear-gradient(to_right,hsl(var(--color-primary)),hsl(var(--color-healing)))] bg-clip-text text-transparent">
              Luma
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[hsl(var(--color-foreground))] mb-2">Reset your password</h1>
          <p className="text-[hsl(var(--color-muted-foreground))]">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <Card className="shadow-[var(--shadow-warm)] border-[hsl(var(--color-border)_/_0.5)] bg-[hsl(var(--color-card)_/_0.8)] backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-[hsl(var(--color-foreground))]">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert className="border-[hsl(var(--color-destructive)_/_0.5)] text-[hsl(var(--color-destructive))]">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(var(--color-foreground))]">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[hsl(var(--color-muted-foreground))]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-[hsl(var(--color-border)_/_0.5)] focus:ring-[hsl(var(--color-primary)_/_0.2)] focus:border-[hsl(var(--color-primary))]"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[linear-gradient(to_right,hsl(var(--color-primary)),hsl(var(--color-healing)))] hover:bg-[linear-gradient(to_right,hsl(var(--color-primary)_/_0.9),hsl(var(--color-healing)_/_0.9))] text-[hsl(var(--color-primary-foreground))] shadow-[var(--shadow-gentle)] transition-[var(--transition-gentle)]"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset instructions'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center gap-2 text-sm text-[hsl(var(--color-muted-foreground))] hover:text-[hsl(var(--color-foreground))] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
