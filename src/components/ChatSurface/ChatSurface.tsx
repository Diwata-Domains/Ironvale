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
  /**
   * Controlled composer value. When provided together with `onValueChange`, the caller owns the
   * draft (e.g. to inject voice-transcribed text); otherwise the composer manages its own state.
   */
  value?: string;
  onValueChange?: (value: string) => void;
  /** Optional element rendered in the composer row, before Send (e.g. a voice-record button). */
  composerAccessory?: ReactNode;
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
  value: valueProp,
  onValueChange,
  composerAccessory,
}: ChatSurfaceProps) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : internalValue;
  const setValue = (next: string) => {
    if (isControlled) onValueChange?.(next);
    else setInternalValue(next);
  };
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
        {composerAccessory}
        <Button type="submit" variant="primary" disabled={busy || value.trim().length === 0}>
          Send
        </Button>
      </form>
    </div>
  );
}
