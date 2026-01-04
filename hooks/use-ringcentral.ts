"use client"

import { useState, useEffect, useCallback } from 'react'
import type { CallLogResponse, MessageResponse, ExtensionResponse, ActivityRecord } from '@/lib/types'

export function useCallLog() {
  const [data, setData] = useState<CallLogResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ringcentral/call-log')
      if (response.status === 401) {
        setError('Not connected')
        return
      }
      if (!response.ok) throw new Error('Failed to fetch')
      const json = await response.json()
      setData(json)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useMessages() {
  const [data, setData] = useState<MessageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ringcentral/messages')
      if (response.status === 401) {
        setError('Not connected')
        return
      }
      if (!response.ok) throw new Error('Failed to fetch')
      const json = await response.json()
      setData(json)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useExtensions() {
  const [data, setData] = useState<ExtensionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/ringcentral/extensions')
      if (response.status === 401) {
        setError('Not connected')
        return
      }
      if (!response.ok) throw new Error('Failed to fetch')
      const json = await response.json()
      setData(json)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

// Transform RingCentral data to dashboard activity format
export function transformToActivityRecords(
  callLog: CallLogResponse | null,
  messages: MessageResponse | null
): ActivityRecord[] {
  const activities: ActivityRecord[] = []

  // Transform call log records
  if (callLog?.records) {
    callLog.records.forEach((call) => {
      const contact = call.direction === 'Inbound'
        ? call.from?.name || call.from?.phoneNumber || 'Unknown'
        : call.to?.name || call.to?.phoneNumber || 'Unknown'

      const minutes = Math.floor(call.duration / 60)
      const seconds = call.duration % 60
      const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`

      let status: ActivityRecord['status'] = 'Completed'
      if (call.result === 'Missed') status = 'Missed'
      else if (call.result === 'Voicemail') status = 'Pending'

      activities.push({
        id: call.id,
        employee: 'Current User', // Would need extension lookup for multi-user
        extension: call.extension?.id || '101',
        channel: 'Voice',
        direction: call.direction,
        status,
        contact,
        duration,
        timestamp: new Date(call.startTime).toLocaleString(),
      })
    })
  }

  // Transform message records
  if (messages?.records) {
    messages.records.forEach((msg) => {
      const contact = msg.direction === 'Inbound'
        ? msg.from?.name || msg.from?.phoneNumber || 'Unknown'
        : msg.to?.[0]?.name || msg.to?.[0]?.phoneNumber || 'Unknown'

      let status: ActivityRecord['status'] = 'Completed'
      if (msg.messageStatus === 'Queued') status = 'Pending'
      else if (msg.messageStatus === 'SendingFailed' || msg.messageStatus === 'DeliveryFailed') status = 'Missed'

      activities.push({
        id: msg.id,
        employee: 'Current User',
        extension: '101',
        channel: 'SMS',
        direction: msg.direction,
        status,
        contact,
        duration: '-',
        timestamp: new Date(msg.creationTime).toLocaleString(),
      })
    })
  }

  // Sort by timestamp descending
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return activities
}
