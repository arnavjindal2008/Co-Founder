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

function getProfile(user) {
  if (!user) return {};

  const profile = user.profiles || user.profile;

  if (Array.isArray(profile)) {
    return profile[0] || {};
  }

  return profile || {};
}

function getUserName(user) {
  const profile = getProfile(user);

  return (
    profile.full_name ||
    user?.full_name ||
    user?.name ||
    user?.email ||
    'CoFounder'
  );
}

function getInitials(user) {
  return getUserName(user)
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getTime(date) {
  if (!date) return '';

  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Messages() {
  const { user, token } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef(null);
  const selectedChatRef = useRef(null);

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const activeChat = conversations.find(
    (conversation) =>
      String(conversation.id) === String(selectedChat)
  );

  const activeUser = activeChat?.otherUser;
  const activeProfile = getProfile(activeUser);

  const filteredConversations = conversations.filter((conversation) =>
    getUserName(conversation.otherUser)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Load conversations
  const loadConversations = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/conversations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load conversations');
      }

      const list = data.conversations || [];

      setConversations(list);

      setSelectedChat((current) => {
        if (
          current &&
          list.some(
            (conversation) =>
              String(conversation.id) === String(current)
          )
        ) {
          return current;
        }

        return list.length ? list[0].id : null;
      });
    } catch (err) {
      console.error('Conversation loading error:', err);
      setError(err.message || 'Could not load conversations');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Keep selected conversation available to socket listener
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedChat || !token) {
      setMessages([]);
      return;
    }

    let cancelled = false;

    const loadMessages = async () => {
      setMessagesLoading(true);

      try {
        const response = await fetch(
          `/api/messages/${selectedChat}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Could not load messages');
        }

        if (!cancelled) {
          setMessages(data.messages || []);
        }

        // Mark received messages as read
        await fetch(`/api/messages/${selectedChat}/read`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error('Message loading error:', err);
        if (!cancelled) {
          setError(err.message || 'Could not load messages');
        }
      } finally {
        if (!cancelled) {
          setMessagesLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [selectedChat, token]);

  // Real-time incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const conversationId = newMessage.conversation_id;

      // Update the active chat if this message belongs to it
      if (
        String(conversationId) ===
        String(selectedChatRef.current)
      ) {
        setMessages((previous) => {
          const alreadyExists = previous.some(
            (message) => String(message.id) === String(newMessage.id)
          );

          if (alreadyExists) return previous;

          return [...previous, newMessage];
        });

        // Mark incoming message as read
        if (String(newMessage.sender_id) !== String(user?.id)) {
          fetch(`/api/messages/${conversationId}/read`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).catch(console.error);
        }
      }

      // Update conversation preview
      setConversations((previous) =>
        previous.map((conversation) =>
          String(conversation.id) === String(conversationId)
            ? {
                ...conversation,
                lastMessage: newMessage,
                updated_at: newMessage.created_at,
              }
            : conversation
        )
      );
    };

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [socket, token, user?.id]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, selectedChat]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const content = messageText.trim();

    if (!content || !selectedChat || sending) return;

    setSending(true);
    setError('');

    try {
      const response = await fetch(
        `/api/messages/${selectedChat}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({ content }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Message could not be sent');
      }

      const sentMessage = data.data;

      setMessages((previous) => {
        const alreadyExists = previous.some(
          (message) => String(message.id) === String(sentMessage.id)
        );

        if (alreadyExists) return previous;

        return [...previous, sentMessage];
      });

      setConversations((previous) =>
        previous.map((conversation) =>
          String(conversation.id) === String(selectedChat)
            ? {
                ...conversation,
                lastMessage: sentMessage,
                updated_at: sentMessage.created_at,
              }
            : conversation
        )
      );

      setMessageText('');
    } catch (err) {
      console.error('Send message error:', err);
      setError(err.message || 'Message could not be sent');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <div className="flex h-screen min-w-0 flex-col overflow-hidden lg:ml-64">
        <div className="shrink-0">
          <DashboardNavbar />
        </div>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 md:p-6">
          {/* Page heading */}
          <div className="mb-5 shrink-0">
            <h1 className="text-2xl font-bold text-slate-900">
              Messages
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Chat with your accepted connections.
            </p>
          </div>

          {/* Chat container */}
          <div className="flex min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Conversations sidebar */}
            <section
              className={`w-full shrink-0 flex-col border-r border-slate-200 md:flex md:w-[320px] lg:w-[390px] ${
                selectedChat ? 'hidden md:flex' : 'flex'
              }`}
            >
              <div className="shrink-0 border-b border-slate-100 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">
                    Conversations
                  </h2>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                    {conversations.length} Chats
                  </span>
                </div>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full rounded-xl bg-slate-100 py-3 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-6 text-center text-sm text-slate-500">
                    Loading conversations...
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center p-8 text-center">
                    <MessageCircle
                      size={32}
                      className="mb-3 text-slate-300"
                    />
                    <p className="font-medium text-slate-700">
                      No conversations yet
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Connect with someone to start chatting.
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = conversation.otherUser;
                    const profile = getProfile(otherUser);
                    const isActive =
                      String(selectedChat) === String(conversation.id);

                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedChat(conversation.id)}
                        className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-indigo-50 ${
                          isActive ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <div className="flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-bold text-indigo-600">
                          {profile.profile_picture ? (
                            <img
                              src={profile.profile_picture}
                              alt={getUserName(otherUser)}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(otherUser)
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate font-semibold text-slate-900">
                              {getUserName(otherUser)}
                            </p>

                            <span className="shrink-0 text-xs text-slate-400">
                              {getTime(
                                conversation.lastMessage?.created_at ||
                                conversation.updated_at
                              )}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {profile.headline || 'CoFounder'}
                          </p>

                          <p className="mt-1 truncate text-sm text-slate-500">
                            {conversation.lastMessage?.content ||
                              'Start a conversation'}
                          </p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </section>

            {/* Active chat */}
            <section
              className={`min-w-0 flex-1 flex-col ${
                selectedChat ? 'flex' : 'hidden md:flex'
              }`}
            >
              {!selectedChat || !activeChat ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center">
                  <MessageCircle
                    size={48}
                    className="mb-4 text-indigo-300"
                  />
                  <h3 className="text-lg font-semibold text-slate-800">
                    Select a conversation
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose someone to start messaging.
                  </p>
                </div>
              ) : (
                <>
                  {/* Fixed chat header */}
                  <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-white p-4 md:p-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="mr-1 rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                      >
                        <ArrowLeft size={20} />
                      </button>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 font-bold text-indigo-600">
                        {activeProfile.profile_picture ? (
                          <img
                            src={activeProfile.profile_picture}
                            alt={getUserName(activeUser)}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(activeUser)
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate font-bold text-slate-900">
                          {getUserName(activeUser)}
                        </h2>
                        <p className="truncate text-sm text-slate-500">
                          {activeProfile.headline ||
                            activeUser?.email ||
                            'CoFounder'}
                        </p>
                      </div>
                    </div>

                    <span className="ml-2 shrink-0 text-xs font-medium text-green-600">
                      Connected
                    </span>
                  </div>

                  {/* Only this section scrolls */}
                  <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50 p-4 md:p-6">
                    {messagesLoading ? (
                      <div className="m-auto text-sm text-slate-500">
                        Loading messages...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="m-auto text-center">
                        <MessageCircle
                          size={36}
                          className="mx-auto mb-3 text-slate-300"
                        />
                        <p className="font-medium text-slate-700">
                          No messages yet
                        </p>
                        <p className="mt-1 text-sm text-slate-400">
                          Send the first message!
                        </p>
                      </div>
                    ) : (
                      <div className="mt-auto flex flex-col gap-4">
                        {messages.map((message) => {
                          const isMine =
                            String(message.sender_id) === String(user?.id);

                          return (
                            <div
                              key={message.id}
                              className={`flex ${
                                isMine ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[80%] break-words rounded-2xl px-4 py-3 shadow-sm md:max-w-[65%] ${
                                  isMine
                                    ? 'rounded-br-md bg-indigo-600 text-white'
                                    : 'rounded-bl-md border border-slate-100 bg-white text-slate-800'
                                }`}
                              >
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                  {message.content}
                                </p>

                                <p
                                  className={`mt-2 text-right text-[11px] ${
                                    isMine
                                      ? 'text-indigo-200'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {getTime(message.created_at)}
                                </p>
                              </div>
                            </div>
                          );
                        })}

                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Fixed message composer */}
                  <form
                    onSubmit={handleSendMessage}
                    className="shrink-0 border-t border-slate-100 bg-white p-4"
                  >
                    <div className="flex items-center gap-3 rounded-xl bg-slate-100 p-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message..."
                        maxLength={5000}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                      />

                      <button
                        type="submit"
                        disabled={!messageText.trim() || sending}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Send size={20} />
                      </button>
                    </div>

                    {error && (
                      <p className="mt-2 text-xs text-red-500">
                        {error}
                      </p>
                    )}
                  </form>
                </>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
