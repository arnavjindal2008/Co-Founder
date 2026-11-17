import { useState } from 'react';
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  MessageCircle,
  CheckCheck,
  ArrowLeft,
} from 'lucide-react';

function Messages() {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Aarav Sharma',
      role: 'Full Stack Developer',
      avatar: 'AS',
      color: 'bg-indigo-100 text-indigo-600',
      lastMessage: 'I would love to discuss your idea!',
      time: '10:45 AM',
      online: true,
      unread: 2,
      messages: [
        {
          id: 1,
          text: 'Hey! I saw your project on CoFounder.',
          time: '10:30 AM',
          sent: false,
        },
        {
          id: 2,
          text: 'I am interested in joining your team.',
          time: '10:35 AM',
          sent: false,
        },
        {
          id: 3,
          text: 'That sounds great! Tell me more about your experience.',
          time: '10:40 AM',
          sent: true,
        },
        {
          id: 4,
          text: 'I would love to discuss your idea!',
          time: '10:45 AM',
          sent: false,
        },
      ],
    },
    {
      id: 2,
      name: 'Priya Mehta',
      role: 'UI/UX Designer',
      avatar: 'PM',
      color: 'bg-pink-100 text-pink-600',
      lastMessage: 'I have shared my portfolio.',
      time: 'Yesterday',
      online: true,
      unread: 0,
      messages: [
        {
          id: 1,
          text: 'Hello! I am interested in your startup.',
          time: 'Yesterday',
          sent: false,
        },
        {
          id: 2,
          text: 'I have shared my portfolio.',
          time: 'Yesterday',
          sent: false,
        },
      ],
    },
    {
      id: 3,
      name: 'Rohan Verma',
      role: 'Marketing Specialist',
      avatar: 'RV',
      color: 'bg-amber-100 text-amber-600',
      lastMessage: 'Let us connect this week.',
      time: 'Monday',
      online: false,
      unread: 0,
      messages: [
        {
          id: 1,
          text: 'Let us connect this week.',
          time: 'Monday',
          sent: false,
        },
      ],
    },
  ]);

  const activeChat = conversations.find(
    (chat) => chat.id === selectedChat
  );

  function handleSendMessage(e) {
    e.preventDefault();

    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sent: true,
    };

    setConversations((previous) =>
      previous.map((chat) =>
        chat.id === selectedChat
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage.text,
              time: 'Now',
            }
          : chat
      )
    );

    setMessage('');
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:ml-64">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Connect and communicate with your potential co-founders.
          </p>
        </div>

        <div className="grid h-[calc(100vh-170px)] min-h-[550px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-3">
          {/* Conversations */}
          <div
            className={`${
              activeChat ? 'hidden md:flex' : 'flex'
            } flex-col border-r border-slate-200 md:col-span-1`}
          >
            <div className="border-b border-slate-100 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Conversations
                </h2>
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                  {conversations.length} Chats
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5">
                <Search size={18} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                    selectedChat === chat.id
                      ? 'bg-indigo-50'
                      : 'bg-white'
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${chat.color}`}
                    >
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {chat.name}
                      </h3>
                      <span className="shrink-0 text-xs text-slate-400">
                        {chat.time}
                      </span>
                    </div>
                    <p className="mb-1 text-xs text-slate-500">
                      {chat.role}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {chat.lastMessage}
                    </p>
                  </div>

                  {chat.unread > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs text-white">
                      {chat.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat */}
          {activeChat ? (
            <div
              className={`${
                activeChat ? 'flex' : 'hidden'
              } flex-col md:col-span-2`}
            >
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-slate-100 p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="text-slate-500 md:hidden"
                  >
                    <ArrowLeft size={20} />
                  </button>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${activeChat.color}`}
                  >
                    {activeChat.avatar}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {activeChat.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {activeChat.online ? 'Online' : activeChat.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-500">
                  <button className="hidden rounded-lg p-2 hover:bg-slate-100 sm:block">
                    <Phone size={19} />
                  </button>
                  <button className="hidden rounded-lg p-2 hover:bg-slate-100 sm:block">
                    <Video size={19} />
                  </button>
                  <button className="rounded-lg p-2 hover:bg-slate-100">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50 p-5">
                <div className="text-center">
                  <span className="rounded-full bg-white px-4 py-1.5 text-xs text-slate-400 shadow-sm">
                    Today
                  </span>
                </div>

                {activeChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sent ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sent
                          ? 'rounded-br-sm bg-indigo-600 text-white'
                          : 'rounded-bl-sm border border-slate-100 bg-white text-slate-800'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">
                        {msg.text}
                      </p>

                      <div
                        className={`mt-2 flex items-center justify-end gap-1 text-[10px] ${
                          msg.sent
                            ? 'text-indigo-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {msg.time}
                        {msg.sent && <CheckCheck size={13} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-100 bg-white p-4"
              >
                <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-2">
                  <button
                    type="button"
                    className="p-2 text-slate-400 hover:text-indigo-600"
                  >
                    <Paperclip size={20} />
                  </button>

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="hidden flex-col items-center justify-center text-center md:col-span-2 md:flex">
              <MessageCircle size={45} className="mb-4 text-indigo-300" />
              <h3 className="font-semibold text-slate-800">
                Select a conversation
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Choose someone to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;