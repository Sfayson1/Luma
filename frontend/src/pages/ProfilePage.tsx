import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Camera, Save, User } from 'lucide-react'

interface Profile {
  id: string
  user_id: string
  name: string | null
  email: string | null
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

const ProfilePage = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    email: ''
  })
  const [uploading, setUploading] = useState(false)
  const fileInputId = 'avatar-upload-input'

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        const profileData = {
          ...data,
          bio: data.bio || null,
          avatar_url: data.avatar_url || null
        }
        setProfile(profileData)
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          email: data.email || user.email || ''
        })
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          user_id: user.id,
          name: user.user_metadata?.name || '',
          email: user.email || '',
          bio: null,
          avatar_url: null
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single()

        if (createError) throw createError

        setProfile(createdProfile)
        setFormData({
          name: createdProfile.name || '',
          bio: createdProfile.bio || '',
          email: createdProfile.email || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    if (!user) return
    try {
      setUploading(true)

      if (!file.type.startsWith('image/')) {
        toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: 'File too large', description: 'Max size is 5MB.', variant: 'destructive' })
        return
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      })
      if (uploadError) throw uploadError

      const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
      const publicUrl = pub?.publicUrl

      if (!publicUrl) throw new Error('Failed to get public URL')

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id)
      if (updateErr) throw updateErr

      setProfile((p) => (p ? { ...p, avatar_url: publicUrl } : p))
      toast({ title: 'Avatar updated' })
    } catch (error) {
      console.error('Avatar upload error:', error)
      toast({ title: 'Error', description: 'Failed to upload avatar', variant: 'destructive' })
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          bio: formData.bio,
          email: formData.email
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })

      // Refresh profile data
      await fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[hsl(var(--color-background))] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[hsl(var(--color-primary))] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[hsl(var(--color-muted-foreground))]">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--color-background))] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[hsl(var(--color-foreground))]">Profile Settings</h1>
          <p className="text-[hsl(var(--color-muted-foreground))] mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid gap-6">
          {/* Avatar Section */}
          <Card style={{ border: '1px solid hsl(var(--color-border))' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[hsl(var(--color-foreground))]">
                <User className="h-5 w-5 text-[hsl(var(--color-primary))]" />
                Profile Picture
              </CardTitle>
              <CardDescription className="text-[hsl(var(--color-muted-foreground))]">
                Your profile picture helps others recognize you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-[hsl(var(--color-primary)_/_0.1)] text-[hsl(var(--color-primary))] text-xl">
                    {formData.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleAvatarUpload(file)
                      e.currentTarget.value = ''
                    }}
                  />
                  <Button
                    variant="outline"
                    className="gap-2 bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] hover:bg-[hsl(var(--color-accent))] hover:text-[hsl(var(--color-accent-foreground))]"
                    onClick={() => document.getElementById(fileInputId)?.click()}
                    disabled={uploading}
                    style={{ border: '1px solid hsl(var(--color-border))' }}
                  >
                    <Camera className="h-4 w-4" />
                    {uploading ? 'Uploading…' : 'Upload Photo'}
                  </Button>
                  <p className="text-sm text-[hsl(var(--color-muted-foreground))] mt-2">
                    PNG or JPG up to 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card style={{ border: '1px solid hsl(var(--color-border))' }}>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--color-foreground))]">Personal Information</CardTitle>
              <CardDescription className="text-[hsl(var(--color-muted-foreground))]">
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[hsl(var(--color-foreground))] font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))]"
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[hsl(var(--color-foreground))] font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))]"
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-[hsl(var(--color-foreground))] font-medium">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                  className="bg-[hsl(var(--color-background))] text-[hsl(var(--color-foreground))] placeholder:text-[hsl(var(--color-muted-foreground))]"
                  style={{ border: '1px solid hsl(var(--color-border))' }}
                />
                <p className="text-sm text-[hsl(var(--color-muted-foreground))]">
                  Share a little about yourself and your journaling journey
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card style={{ border: '1px solid hsl(var(--color-border))' }}>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--color-foreground))]">Account Information</CardTitle>
              <CardDescription className="text-[hsl(var(--color-muted-foreground))]">
                Your account details and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[hsl(var(--color-muted-foreground))]">Member since</p>
                  <p className="font-medium text-[hsl(var(--color-foreground))]">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-[hsl(var(--color-muted-foreground))]">Last updated</p>
                  <p className="font-medium text-[hsl(var(--color-foreground))]">
                    {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
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
