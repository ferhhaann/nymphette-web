import React, { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

interface Props { regionKey: string }

const ChatbotWidget: React.FC<Props> = ({ regionKey }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; content: string }[]>([
    { role: 'assistant', content: `Hi! Ask me anything about ${regionKey} packages, budget, or best season.` }
  ]);

  const send = () => {
    const q = input.trim(); if (!q) return;
    const reply = `Thanks! I\'ll match you with the best ${regionKey} option and a travel expert will reach out.`;
    setMessages(m => [...m, { role: 'user', content: q }, { role: 'assistant', content: reply }]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {open && (
        <div className="w-80 bg-card border rounded-lg shadow-lg overflow-hidden animate-fade-in">
          <div className="p-3 border-b flex items-center justify-between">
            <div className="flex items-center gap-2"><MessageCircle className="size-4"/><span className="text-sm font-medium">Travel Assistant</span></div>
            <button onClick={()=>setOpen(false)} aria-label="Close"><X className="size-4"/></button>
          </div>
          <div className="p-3 h-64 overflow-y-auto space-y-2">
            {messages.map((m,i)=> (
              <div key={i} className={m.role==='assistant'?"text-sm text-muted-foreground":"text-sm"}>{m.content}</div>
            ))}
          </div>
          <div className="p-2 border-t flex items-center gap-2">
            <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Type your question..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={(e)=>{ if(e.key==='Enter') send(); }} />
            <button onClick={send} className="p-2" aria-label="Send"><Send className="size-4"/></button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} className="rounded-full bg-primary text-primary-foreground shadow-lg p-4">
        <MessageCircle className="size-5"/>
      </button>
    </div>
  );
};

export default ChatbotWidget;
