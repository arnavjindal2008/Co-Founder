import { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardNavbar from '../components/DashboardNavbar';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
  Search,
  Send,
  MessageCircle,
  ArrowLeft,
} from 'lucide-react';

const API = '/api';

function getProfile(user) {
  if (!user?.profiles) return {};
  return Array.isArray(user.profiles)
    ? user.profiles[0] || {}
    : user.profiles;
}

function getUserName(user) {
  const profile = getProfile(user);
  return profile.full_name || user?.email || 'CoFounder';
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function formatTime(date) {
  if (!date) return '';

  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Messages() {
  const { token, user } = useAuth();
  const { socket, connected } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const activeConversationRef = useRef(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // Load all conversations.
  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      setError('');

      const response = await fetch(`${API}/conversations`, {
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load conversations.');
      }

      const list = data.conversations || [];
      setConversations(list);

      setSelectedChat((current) => {
        if (current && list.some((item) => item.id === current)) {
          return current;
        }

        return list.length > 0 ? list[0].id : null;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingConversations(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadConversations();
  }, [token, loadConversations]);

  // Load message history whenever a conversation is selected.
  useEffect(() => {
    activeConversationRef.current = selectedChat;

    if (!selectedChat) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        setError('');

        const response = await fetch(
          `${API}/messages/${selectedChat}`,
          { headers }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to load messages.');
        }

        if (!cancelled) {
          setMessages(data.messages || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoadingMessages(false);
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedChat, token]);

  // Listen for messages delivered through Socket.IO.
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const conversationId = Number(newMessage.conversation_id);

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                lastMessage: newMessage,
                updated_at: newMessage.created_at,
              }
            : conversation
        )
      );

      if (activeConversationRef.current === conversationId) {
        setMessages((previous) => {
          const alreadyExists = previous.some(
            (item) => item.id === newMessage.id
          );

          return alreadyExists
            ? previous
            : [...previous, newMessage];
        });
      }
    };

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [socket]);

  // Scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  // Send a message through the REST API.
  const handleSendMessage = async (event) => {
    event.preventDefault();

    const content = message.trim();

    if (!content || !selectedChat || sending) return;

    try {
      setSending(true);
      setError('');

      const response = await fetch(
        `${API}/messages/${selectedChat}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }

      const sentMessage = data.data;

      // Add the saved message immediately.
      // Socket.IO may also deliver it, so check for duplicates.
      setMessages((previous) => {
        if (previous.some((item) => item.id === sentMessage.id)) {
          return previous;
        }

        return [...previous, sentMessage];
      });

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === selectedChat
            ? {
                ...conversation,
                lastMessage: sentMessage,
                updated_at: sentMessage.created_at,
              }
            : conversation
        )
      );

      setMessage('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) => {
    const name = getUserName(conversation.otherUser).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const activeChat = conversations.find(
    (conversation) => conversation.id === selectedChat
  );

  const activeUser = activeChat?.otherUser;
  const activeName = getUserName(activeUser);
  const activeProfile = getProfile(activeUser);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:ml-64">
      <Sidebar />
      <DashboardNavbar />

      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Messages
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Chat with your accepted connections.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid h-[calc(100vh-170px)] min-h-[550px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-3">
          {/* Conversation list */}
          <div
            className={`${
              activeChat ? 'hidden md:flex' : 'flex'
            } flex-col border-r border-slate-200`}
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
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <p className="p-5 text-center text-sm text-slate-500">
                  Loading conversations...
                </p>
              ) : filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageCircle
                    size={35}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <p className="text-sm font-medium text-slate-700">
                    No conversations yet
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Connect with someone to start chatting.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherUser = conversation.otherUser;
                  const name = getUserName(otherUser);
                  const profile = getProfile(otherUser);
                  const lastMessage = conversation.lastMessage;

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                        selectedChat === conversation.id
                          ? 'bg-indigo-50'
                          : 'bg-white'
                      }`}
                    >
                      {profile.profile_picture ? (
                        <img
                          src={profile.profile_picture}
                          alt={name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                          {getInitials(name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2">
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {name}
                          </h3>

                          <span className="shrink-0 text-xs text-slate-400">
                            {lastMessage
                              ? formatTime(lastMessage.created_at)
                              : ''}
                          </span>
                        </div>

                        <p className="mb-1 text-xs text-slate-500">
                          {profile.headline || 'CoFounder'}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {lastMessage?.content || 'Start a conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active conversation */}
          {activeChat ? (
            <div className="flex flex-col md:col-span-2">
              <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                <button
                  onClick={() => setSelectedChat(null)}
                  className="text-slate-500 md:hidden"
                >
                  <ArrowLeft size={20} />
                </button>

                {activeProfile.profile_picture ? (
                  <img
                    src={activeProfile.profile_picture}
                    alt={activeName}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
                    {getInitials(activeName)}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-slate-900">
                    {activeName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeProfile.headline || 'CoFounder'}
                  </p>
                </div>

                <span className={`ml-auto text-xs ${
                  connected ? 'text-green-600' : 'text-slate-400'
                }`}>
                  {connected ? 'Connected' : 'Reconnecting...'}
                </span>
              </div>

              {/* Message history */}
              <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-5">
                {loadingMessages ? (
                  <p className="text-center text-sm text-slate-500">
                    Loading messages...
                  </p>
                ) : messages.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <MessageCircle
                      size={40}
                      className="mb-3 text-indigo-300"
                    />
                    <p className="font-medium text-slate-700">
                      Start your conversation
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Send your first message below.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const sent =
                      Number(msg.sender_id) === Number(user?.id);

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          sent ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            sent
                              ? 'rounded-br-sm bg-indigo-600 text-white'
                              : 'rounded-bl-sm border border-slate-100 bg-white text-slate-800'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                            {msg.content}
                          </p>

                          <p
                            className={`mt-2 text-right text-[10px] ${
                              sent ? 'text-indigo-200' : 'text-slate-400'
                            }`}
                          >
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-100 bg-white p-4"
              >
                <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your message..."
                    maxLength={5000}
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none"
                    disabled={sending}
                  />

                  <button
                    type="submit"
                    disabled={!message.trim() || sending || !connected}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>

                <p className="mt-2 text-right text-xs text-slate-400">
                  {message.length}/5000
                </p>
              </form>
            </div>
          ) : (
            <div className="hidden flex-col items-center justify-center text-center md:flex md:col-span-2">
              <MessageCircle
                size={45}
                className="mb-4 text-indigo-300"
              />
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
