import prisma from '../config/prisma.js';

// Get messages in a conversation.
export const getMessages = async (req, res) => {
    try {
        const currentUserId = Number(req.user.id);
        const conversationId = Number(req.params.conversationId);

        if (!Number.isInteger(conversationId) || conversationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid conversation ID.'
            });
        }

        const conversation = await prisma.conversations.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { user_one_id: currentUserId },
                    { user_two_id: currentUserId }
                ]
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found.'
            });
        }

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 50, 1),
            100
        );

        const messages = await prisma.messages.findMany({
            where: { conversation_id: conversationId },
            orderBy: { created_at: 'desc' },
            take: limit,
            include: {
                users: {
                    select: {
                        id: true,
                        profiles: {
                            select: {
                                full_name: true,
                                profile_picture: true
                            }
                        }
                    }
                }
            }
        });

        return res.status(200).json({
            success: true,
            messages: messages.reverse()
        });

    } catch (error) {
        console.error('Get messages error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to fetch messages.'
        });
    }
};


// Send and broadcast a message.
export const sendMessage = async (req, res) => {
    try {
        const currentUserId = Number(req.user.id);
        const conversationId = Number(req.params.conversationId);
        const content = req.body.content?.trim();

        if (!Number.isInteger(conversationId) || conversationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid conversation ID.'
            });
        }

        if (!content || content.length > 5000) {
            return res.status(400).json({
                success: false,
                message: 'Message must contain between 1 and 5000 characters.'
            });
        }

        const conversation = await prisma.conversations.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { user_one_id: currentUserId },
                    { user_two_id: currentUserId }
                ]
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found.'
            });
        }

        const recipientId =
            conversation.user_one_id === currentUserId
                ? conversation.user_two_id
                : conversation.user_one_id;

        const message = await prisma.$transaction(async (tx) => {
            const createdMessage = await tx.messages.create({
                data: {
                    conversation_id: conversationId,
                    sender_id: currentUserId,
                    content
                },
                include: {
                    users: {
                        select: {
                            id: true,
                            profiles: {
                                select: {
                                    full_name: true,
                                    profile_picture: true
                                }
                            }
                        }
                    }
                }
            });

            await tx.conversations.update({
                where: { id: conversationId },
                data: { updated_at: new Date() }
            });

            return createdMessage;
        });

        // Send the persisted message to all recipient devices.
        const io = req.app.get('io');

        if (io) {
            io.to(`user:${recipientId}`).emit('message:new', message);

            // Sync other tabs/devices belonging to the sender too.
            io.to(`user:${currentUserId}`).emit('message:new', message);
        }

        return res.status(201).json({
            success: true,
            message: 'Message sent successfully.',
            data: message
        });

    } catch (error) {
        console.error('Send message error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to send message.'
        });
    }
};


// Mark messages received from the other user as read.
export const markMessagesAsRead = async (req, res) => {
    try {
        const currentUserId = Number(req.user.id);
        const conversationId = Number(req.params.conversationId);

        if (!Number.isInteger(conversationId) || conversationId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid conversation ID.'
            });
        }

        const conversation = await prisma.conversations.findFirst({
            where: {
                id: conversationId,
                OR: [
                    { user_one_id: currentUserId },
                    { user_two_id: currentUserId }
                ]
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Conversation not found.'
            });
        }

        const result = await prisma.messages.updateMany({
            where: {
                conversation_id: conversationId,
                sender_id: { not: currentUserId },
                read_at: null
            },
            data: {
                read_at: new Date()
            }
        });

        const io = req.app.get('io');

        if (io) {
            const otherUserId =
                conversation.user_one_id === currentUserId
                    ? conversation.user_two_id
                    : conversation.user_one_id;

            io.to(`user:${otherUserId}`).emit('messages:read', {
                conversationId,
                readBy: currentUserId
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Messages marked as read.',
            updatedCount: result.count
        });

    } catch (error) {
        console.error('Mark messages as read error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to mark messages as read.'
        });
    }
};
