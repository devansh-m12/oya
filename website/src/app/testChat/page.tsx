'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function TestChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('chatMessages');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState('casino-butler');

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user' as const, content: input };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, persona: selectedPersona }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      const data = await res.json();
      const assistantMsg: Message = { role: 'assistant' as const, content: data.response || 'Sorry, I could not process that.' };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = { role: 'assistant' as const, content: 'An error occurred while processing your message.' };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white p-6 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Test Chat</h1>
            <Select value={selectedPersona} onValueChange={setSelectedPersona}>
              <SelectTrigger className="w-[180px] bg-white text-black">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casino-butler">Casino Butler</SelectItem>
                <SelectItem value="general">General Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
              const ready = mounted;
              const connected = ready && !!account;
              return (
                <div className="flex items-center gap-2">
                  {(() => {
                    if (!connected) {
                      return (
                        <Button
                          onClick={openConnectModal}
                          type="button"
                          className="bg-white text-black hover:bg-gray-100"
                        >
                          Connect Wallet
                        </Button>
                      );
                    }
                    if (chain?.unsupported) {
                      return (
                        <Button
                          onClick={openChainModal}
                          type="button"
                          className="bg-yellow-500 text-white hover:bg-yellow-600"
                        >
                          Wrong network
                        </Button>
                      );
                    }
                    return (
                      <>
                        <Button
                          onClick={openChainModal}
                          type="button"
                          variant="ghost"
                          className="text-white hover:bg-gray-800"
                        >
                          {chain?.hasIcon && (
                            <div
                              style={{
                                background: chain.iconBackground,
                                width: 12,
                                height: 12,
                                borderRadius: 999,
                                overflow: 'hidden',
                                marginRight: 4,
                              }}
                            >
                              {chain.iconUrl && (
                                <img
                                  alt={chain.name ?? 'Chain icon'}
                                  src={chain.iconUrl}
                                  style={{ width: 12, height: 12 }}
                                />
                              )}
                            </div>
                          )}
                          {chain?.name}
                        </Button>
                        <Button
                          onClick={openAccountModal}
                          type="button"
                          variant="ghost"
                          className="text-white hover:bg-gray-800"
                        >
                          {account.displayName}
                          {account.displayBalance
                            ? ` (${account.displayBalance})`
                            : ''}
                        </Button>
                      </>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 p-6 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-6 mb-6">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-6 py-4 rounded-2xl shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-black text-white ml-8' 
                    : 'bg-gray-100 text-gray-900 mr-8'
                } whitespace-pre-wrap break-words`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] px-6 py-4 rounded-2xl bg-gray-100 text-gray-900 mr-8">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Assistant is typing...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Input Area */}
      <footer className="bg-gray-50 p-6 border-t border-gray-200">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 min-h-[50px] resize-none rounded-xl border-gray-300 focus:border-black focus:ring-1 focus:ring-black"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            className="bg-black hover:bg-gray-800 text-white rounded-xl px-8 h-[50px] shadow-md"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Send
          </Button>
        </div>
      </footer>
    </div>
  );
}