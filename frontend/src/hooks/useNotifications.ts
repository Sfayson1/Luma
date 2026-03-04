import { useState } from 'react'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'like' | 'comment' | 'follow' | 'achievement' | 'reminder' | 'system'
  read: boolean
  data: Record<string, any>
  created_at: string
  updated_at: string
}

export function useNotifications() {
  const [notifications] = useState<Notification[]>([])

  return {
    notifications,
    loading: false,
    unreadCount: 0,
    markAsRead: async (_id: string) => {},
    markAllAsRead: async () => {},
    deleteNotification: async (_id: string) => {},
    createTestNotification: async () => {},
    refreshNotifications: async () => {},
  }
}
