import prisma from '../config/prisma.js';

// Create a new conversation or return an existing one.
export const createConversation = async (req, res) => {
    try {
        const currentUserId = Number(req.user.id);
        const otherUserId = Number(req.params.userId);

        if (!Number.isInteger(otherUserId) || otherUserId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID.'
            });
        }

        if (currentUserId === otherUserId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot create a conversation with yourself.'
            });
        }

        // Confirm that the other user exists.
        const otherUser = await prisma.users.findUnique({
            where: { id: otherUserId },
            select: { id: true }
        });

        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // A conversation is allowed only between accepted connections.
        const connection = await prisma.connections.findFirst({
            where: {
                status: 'accepted',
                OR: [
                    {
                        requester_id: currentUserId,
                        recipient_id: otherUserId
                    },
                    {
                        requester_id: otherUserId,
                        recipient_id: currentUserId
                    }
                ]
            }
        });

        if (!connection) {
            return res.status(403).json({
                success: false,
                message: 'You can only chat with accepted connections.'
            });
        }

        // Keep user_one_id smaller than user_two_id.
        const userOneId = Math.min(currentUserId, otherUserId);
        const userTwoId = Math.max(currentUserId, otherUserId);

        const conversation = await prisma.conversations.upsert({
            where: {
                user_one_id_user_two_id: {
                    user_one_id: userOneId,
                    user_two_id: userTwoId
                }
            },
            update: {},
            create: {
                user_one_id: userOneId,
                user_two_id: userTwoId
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Conversation ready.',
            conversation
        });

    } catch (error) {
        console.error('Create conversation error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to create conversation.'
        });
    }
};


// Get all conversations belonging to the logged-in user.
export const getMyConversations = async (req, res) => {
    try {
        const currentUserId = Number(req.user.id);

        const conversations = await prisma.conversations.findMany({
            where: {
                OR: [
                    { user_one_id: currentUserId },
                    { user_two_id: currentUserId }
                ]
            },
            include: {
                users_conversations_user_one_idTousers: {
                    select: {
                        id: true,
                        email: true,
                        profiles: {
                            select: {
                                full_name: true,
                                profile_picture: true,
                                headline: true
                            }
                        }
                    }
                },
                users_conversations_user_two_idTousers: {
                    select: {
                        id: true,
                        email: true,
                        profiles: {
                            select: {
                                full_name: true,
                                profile_picture: true,
                                headline: true
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 1
                },
                _count: {
                    select: {
                        messages: true
                    }
                }
            },
            orderBy: {
                updated_at: 'desc'
            }
        });

        const formattedConversations = conversations.map((conversation) => {
            const otherUser =
                conversation.user_one_id === currentUserId
                    ? conversation.users_conversations_user_two_idTousers
                    : conversation.users_conversations_user_one_idTousers;

            return {
                id: conversation.id,
                otherUser,
                lastMessage: conversation.messages[0] || null,
                totalMessages: conversation._count.messages,
                updated_at: conversation.updated_at
            };
        });

        return res.status(200).json({
            success: true,
            conversations: formattedConversations
        });

    } catch (error) {
        console.error('Get conversations error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch conversations.'
        });
    }
};
