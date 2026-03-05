import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { Save, User } from 'lucide-react'

const ProfilePage = () => {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
  })

  const initials = `${formData.first_name} ${formData.last_name}`
    .trim()
    .split(' ')
    .filter(w => w.length > 0)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  const handleSave = async () => {
    setSaving(true)
    try {
      await apiFetch('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify(formData),
      })
      await refreshUser()
      toast({ title: 'Profile updated successfully' })
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--color-foreground))]">Profile Settings</h1>
          <p className="text-[hsl(var(--color-muted-foreground))] mt-2">Manage your account information</p>
        </div>

        <div className="grid gap-6">
          <Card style={{ border: '1px solid hsl(var(--color-border))' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--color-foreground))]">
                <User className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                Profile Picture
              </CardTitle>
              <CardDescription className="text-[hsl(var(--color-muted-foreground))]">
                Your initials are used as your avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Avatar className="h-20 w-20">
                <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))] text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </CardContent>
          </Card>

          <Card style={{ border: '1px solid hsl(var(--color-border))' }}>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--color-foreground))]">Personal Information</CardTitle>
              <CardDescription className="text-[hsl(var(--color-muted-foreground))]">
                Update your name and email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-[hsl(var(--color-foreground))] font-medium">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="First name"
                    style={{ border: '1px solid hsl(var(--color-border))' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-[hsl(var(--color-foreground))] font-medium">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Last name"
                    style={{ border: '1px solid hsl(var(--color-border))' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(var(--color-foreground))] font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email"
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="gap-2 bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))] hover:bg-[hsl(var(--color-primary)_/_0.9)]"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
