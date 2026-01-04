// RingCentral API Types

export interface CallLogRecord {
  id: string
  uri: string
  sessionId: string
  startTime: string
  duration: number
  type: 'Voice' | 'Fax'
  direction: 'Inbound' | 'Outbound'
  action: string
  result: 'Accepted' | 'Missed' | 'Voicemail' | 'Rejected' | 'Reply' | 'Received' | 'Call connected'
  to?: {
    phoneNumber?: string
    name?: string
    location?: string
  }
  from?: {
    phoneNumber?: string
    name?: string
    location?: string
  }
  recording?: {
    id: string
    uri: string
    contentUri: string
  }
  extension?: {
    id: string
    uri: string
  }
}

export interface CallLogResponse {
  records: CallLogRecord[]
  paging: {
    page: number
    perPage: number
    pageStart: number
    pageEnd: number
  }
  navigation: {
    firstPage?: { uri: string }
    nextPage?: { uri: string }
    previousPage?: { uri: string }
    lastPage?: { uri: string }
  }
}

export interface MessageRecord {
  id: string
  uri: string
  type: 'SMS' | 'Pager' | 'Fax' | 'Voicemail'
  creationTime: string
  readStatus: 'Read' | 'Unread'
  direction: 'Inbound' | 'Outbound'
  subject?: string
  messageStatus: 'Queued' | 'Sent' | 'Delivered' | 'DeliveryFailed' | 'SendingFailed' | 'Received'
  to?: Array<{
    phoneNumber?: string
    name?: string
    location?: string
  }>
  from?: {
    phoneNumber?: string
    name?: string
    location?: string
  }
}

export interface MessageResponse {
  records: MessageRecord[]
  paging: {
    page: number
    perPage: number
    pageStart: number
    pageEnd: number
  }
}

export interface ExtensionRecord {
  id: string
  uri: string
  extensionNumber: string
  name: string
  type: 'User' | 'Department' | 'Announcement' | 'Voicemail'
  status: 'Enabled' | 'Disabled' | 'NotActivated'
  contact?: {
    firstName?: string
    lastName?: string
    email?: string
    businessPhone?: string
  }
}

export interface ExtensionResponse {
  records: ExtensionRecord[]
  paging: {
    page: number
    perPage: number
    pageStart: number
    pageEnd: number
  }
}

// Dashboard activity record type
export interface ActivityRecord {
  id: string
  employee: string
  extension: string
  channel: 'Voice' | 'SMS' | 'WhatsApp' | 'Facebook' | 'Instagram' | 'Twitter' | 'LinkedIn' | 'Email'
  direction: 'Inbound' | 'Outbound'
  status: 'Completed' | 'Missed' | 'Pending' | 'In Progress'
  contact: string
  duration: string
  timestamp: string
}
