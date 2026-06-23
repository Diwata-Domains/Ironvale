import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { ChatSurface } from '../index.js'
import type { ChatMessage } from '../index.js'

const meta = {
  title: 'Shell/ChatSurface',
  component: ChatSurface,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Conversation surface for talking to a Sovereign (DAEMON): a scrolling message list above a composer. Controlled `messages`; the composer manages its own draft.',
      },
    },
  },
  args: { messages: [] },
} satisfies Meta<typeof ChatSurface>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
      { id: '1', role: 'assistant', content: 'Morning. 2 critical Grain packets and a neglected Sanctum domain.' },
      { id: '2', role: 'user', content: "What's most urgent?" },
      { id: '3', role: 'assistant', content: 'TASK-0115 — the CCX23 data-lake setup is blocking Scry.' },
    ])
    return (
      <div style={{ height: '480px', maxWidth: '40rem', margin: '0 auto', border: '1px solid var(--ae-color-border)' }}>
        <ChatSurface
          messages={messages}
          onSend={(text) =>
            setMessages((prev) => [...prev, { id: String(prev.length + 1), role: 'user', content: text }])
          }
        />
      </div>
    )
  },
}
