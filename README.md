# RingCentral Activity Tracker

A Next.js dashboard application for tracking employee activity across multiple RingCentral communication channels including voice calls, SMS/MMS, email, WhatsApp, and social media platforms.

## Features

- **Dashboard Overview** - Real-time activity metrics and trends
- **Call Logs** - Track inbound/outbound calls with recordings
- **Analytics** - Employee performance and channel distribution insights
- **Employee Management** - View employee status and activity metrics
- **Voice Calls** - Detailed call monitoring with hourly distribution
- **Messages** - SMS/MMS conversation tracking
- **Social Media** - Multi-platform social monitoring (Facebook, Instagram, Twitter, LinkedIn)
- **WhatsApp Business** - Dedicated WhatsApp conversation management
- **Email** - Email inbox and tracking

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router
- **UI Components**: shadcn/ui (dashboard-01 block)
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Tabler Icons React
- **TypeScript**: Full type safety

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── dashboard/
│   ├── page.tsx              # Main dashboard
│   ├── call-logs/            # Call logs page
│   ├── analytics/            # Analytics page
│   ├── employees/            # Employee directory
│   ├── voice-calls/          # Voice calls monitoring
│   ├── messages/             # SMS/MMS messages
│   ├── social-media/         # Social media tracking
│   ├── whatsapp/             # WhatsApp conversations
│   └── email/                # Email management
components/
├── ui/                       # shadcn/ui components
├── app-sidebar.tsx           # Main navigation sidebar
├── site-header.tsx           # Dashboard header
├── section-cards.tsx         # Metrics cards
├── chart-area-interactive.tsx # Interactive charts
└── data-table.tsx            # Activity data table
```

## API Integration

This dashboard is designed to integrate with:
- **RingCentral Call Log API** - For voice call tracking
- **RingCentral Message Store API** - For SMS/MMS messages
- **RingCX Digital API** - For email and social media interactions

Currently using placeholder data. API keys and integration will be added in future updates.

## License

MIT
