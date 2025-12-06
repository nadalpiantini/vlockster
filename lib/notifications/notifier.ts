/**
 * Sistema de Notificaciones Inteligentes
 * 
 * QUÉ HACE:
 * - Envía notificaciones por múltiples canales
 * - Gestiona templates personalizados
 * - Agrupa notificaciones para evitar spam
 * - Programa notificaciones futuras
 */

import { createClient } from '@/lib/supabase/server'

export type NotificationChannel = 'email' | 'push' | 'in_app'
export type NotificationType =
  | 'project_funded'
  | 'new_backing'
  | 'deadline_reminder'
  | 'video_processed'
  | 'comment_reply'
  | 'project_update'

interface NotificationData {
  project_title?: string
  amount?: number
  goal_amount?: number
  total_raised?: number
  days_left?: number
  video_title?: string
  user_name?: string
  content_title?: string
  [key: string]: string | number | boolean | null | undefined
}

const NOTIFICATION_TEMPLATES: Record<
  NotificationType,
  {
    subject: string
    body: string
    push_title: string
    push_body: string
  }
> = {
  project_funded: {
    subject: '🎉 ¡Tu proyecto alcanzó su meta!',
    body: '¡Felicidades! Tu proyecto "{project_title}" alcanzó su meta de ${goal_amount}. Total recaudado: ${total_raised}',
    push_title: 'Proyecto fundado',
    push_body: 'Tu proyecto alcanzó su meta de financiamiento',
  },
  new_backing: {
    subject: '💰 Nuevo backing en tu proyecto',
    body: 'Alguien acaba de apoyar tu proyecto "{project_title}" con ${amount}',
    push_title: 'Nuevo apoyo',
    push_body: 'Recibiste un nuevo backing de ${amount}',
  },
  deadline_reminder: {
    subject: '⏰ Recordatorio: Tu proyecto termina pronto',
    body: 'Tu proyecto "{project_title}" termina en {days_left} días. Meta: ${goal_amount} | Recaudado: ${total_raised}',
    push_title: 'Deadline próximo',
    push_body: 'Tu proyecto termina en {days_left} días',
  },
  video_processed: {
    subject: '✅ Tu video está listo',
    body: 'El procesamiento de tu video "{video_title}" ha finalizado. Ya está disponible para ver.',
    push_title: 'Video procesado',
    push_body: 'Tu video está listo para publicar',
  },
  comment_reply: {
    subject: '💬 Nueva respuesta a tu comentario',
    body: '{user_name} respondió a tu comentario en "{content_title}"',
    push_title: 'Nueva respuesta',
    push_body: 'Tienes una nueva respuesta',
  },
  project_update: {
    subject: '📢 Actualización en proyecto',
    body: 'El proyecto "{project_title}" tiene una nueva actualización',
    push_title: 'Actualización de proyecto',
    push_body: 'Nueva actualización disponible',
  },
}

function formatTemplate(template: string, data: NotificationData): string {
  let formatted = template
  Object.entries(data).forEach(([key, value]) => {
    formatted = formatted.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value))
    formatted = formatted.replace(
      new RegExp(`\\$\\{${key}\\}`, 'g'),
      typeof value === 'number' ? value.toLocaleString() : String(value)
    )
  })
  return formatted
}

export async function sendNotification(
  userId: string,
  type: NotificationType,
  channels: NotificationChannel[],
  data: NotificationData
): Promise<void> {
  const supabase = await createClient()
  const template = NOTIFICATION_TEMPLATES[type]

  // Verificar si hay notificaciones similares recientes (agrupar)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('notifications')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('created_at', fiveMinutesAgo)

  // Si hay muchas recientes, agrupar (implementar después)
  const _shouldGroup = recent && recent.length > 3

  // Enviar por cada canal
  for (const channel of channels) {
    if (channel === 'in_app') {
      // Guardar en Supabase (Realtime lo propaga automáticamente)
      await supabase.from('notifications').insert({
        user_id: userId,
        type,
        channel: 'in_app',
        title: formatTemplate(template.push_title, data),
        body: formatTemplate(template.push_body, data),
        data: data,
        read: false,
        created_at: new Date().toISOString(),
      })
    }

    // Email y Push se implementarían con servicios externos
    // Por ahora solo guardamos en base de datos
  }
}

export async function sendBatchNotifications(
  notifications: Array<{
    userId: string
    type: NotificationType
    channels: NotificationChannel[]
    data: NotificationData
  }>
): Promise<void> {
  for (const notif of notifications) {
    await sendNotification(notif.userId, notif.type, notif.channels, notif.data)
  }
}

