'use client'

import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import type { Route } from 'next'

interface Notification {
  id: string
  type: string
  title: string
  content: string | null
  read: boolean | null
  created_at: string | null
  link: string | null
  user_id: string
}

export function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Obtener notificaciones no leídas
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) {
        // Mapear datos de la base de datos a la interfaz Notification
        const mappedNotifications: Notification[] = data.map((n) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          content: n.content,
          read: n.read,
          created_at: n.created_at,
          link: n.link,
          user_id: n.user_id,
        }))
        setNotifications(mappedNotifications)
        setUnreadCount(mappedNotifications.length)
      }
      setLoading(false)
    }

    fetchNotifications()

    // Suscribirse a nuevas notificaciones en tiempo real
    const supabase = createClient()
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          const newNotification = payload.new as {
            id: string
            type: string
            title: string
            content: string | null
            read: boolean | null
            created_at: string | null
            link: string | null
            user_id: string
          }
          setNotifications((prev) => [newNotification, ...prev])
          setUnreadCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const markAsRead = async (notificationId: string) => {
    const supabase = createClient()
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'project_funded':
        return '🎉'
      case 'new_backing':
        return '💰'
      case 'deadline_reminder':
        return '⏰'
      case 'video_processed':
        return '✅'
      case 'comment_reply':
        return '💬'
      default:
        return '🔔'
    }
  }

  const getNotificationLink = (notification: Notification): Route => {
    // Si hay un link directo en la notificación, usarlo
    if (notification.link) {
      return notification.link as Route
    }
    
    // Fallback a rutas por tipo
    switch (notification.type) {
      case 'project_funded':
      case 'project_backed':
      case 'project_update':
        return '/projects' as Route
      case 'video_processed':
        return '/watch' as Route
      case 'comment_reply':
      case 'post_like':
      case 'comment_like':
        return '/community' as Route
      default:
        return '/dashboard' as Route
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative"
        aria-label={`Notificaciones${unreadCount > 0 ? ` (${unreadCount} no leídas)` : ''}`}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
            aria-hidden="true"
          />
          <Card className="absolute right-0 mt-2 w-80 md:w-96 z-50 max-h-[500px] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg">Notificaciones</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Marcar todas como leídas
                </Button>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-center text-gray-400">
                  Cargando notificaciones...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No tienes notificaciones
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.read) {
                          markAsRead(notification.id)
                        }
                        setShowDropdown(false)
                      }}
                      className={`block p-4 hover:bg-gray-800/50 transition-colors ${
                        !notification.read ? 'bg-gray-900/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl" aria-hidden="true">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium ${
                              !notification.read ? 'text-white' : 'text-gray-300'
                            }`}
                          >
                            {notification.title}
                          </p>
                          {notification.content && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                              {notification.content}
                            </p>
                          )}
                          {notification.created_at && (
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          )}
                        </div>
                        {!notification.read && (
                          <span
                            className="h-2 w-2 bg-red-500 rounded-full flex-shrink-0 mt-2"
                            aria-label="No leída"
                          />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-gray-800">
                  <Link
                    href="/notifications"
                    className="block text-center text-sm text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Ver todas las notificaciones
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

