import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '../Button/Button.js';
import { Input } from '../Input/Input.js';
import { ScrollArea } from '../ScrollArea/ScrollArea.js';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: ReactNode;
}

export interface ChatSurfaceProps {
  messages: ChatMessage[];
  onSend?: (text: string) => void;
  placeholder?: string;
  /** Disable the composer while a reply is in flight. */
  busy?: boolean;
  className?: string;
}

/**
 * Conversation surface: a scrolling message list above a composer. The core interaction for talking
 * to a Sovereign (DAEMON). Controlled messages; the composer manages its own draft state.
 */
export function ChatSurface({
  messages,
  onSend,
  placeholder = 'Message your Sovereign…',
  busy = false,
  className,
}: ChatSurfaceProps) {
  const [value, setValue] = useState('');
  const classes = ['iv-chat-surface', className].filter(Boolean).join(' ');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = value.trim();
    if (!text || busy) return;
    onSend?.(text);
    setValue('');
  };

  return (
    <div className={classes}>
      <ScrollArea className="iv-chat-surface__messages">
        {messages.map((message) => (
          <div key={message.id} className={`iv-chat-msg iv-chat-msg--${message.role}`}>
            <div className="iv-chat-msg__bubble">{message.content}</div>
          </div>
        ))}
      </ScrollArea>
      <form className="iv-chat-surface__composer" onSubmit={handleSubmit}>
        <div className="iv-chat-surface__field">
          <Input
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
            placeholder={placeholder}
            disabled={busy}
            aria-label="Message"
          />
        </div>
        <Button type="submit" variant="primary" disabled={busy || value.trim().length === 0}>
          Send
        </Button>
      </form>
    </div>
  );
}
