import BaseService from './base.service';
import { API_ENDPOINTS } from '../config/api.config';
import {
  Message,
  Conversation,
  PaginatedResponse,
} from '../types/api.types';

class MessagesService extends BaseService {
  // Get all conversations for the current user
  async getConversations(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Conversation>> {
    return this.get<PaginatedResponse<Conversation>>(API_ENDPOINTS.MESSAGES.CONVERSATIONS, {
      params,
    });
  }

  // Get messages for a specific booking
  async getMessagesByBooking(
    bookingId: number,
    params?: {
      page?: number;
      limit?: number;
    }
  ): Promise<PaginatedResponse<Message>> {
    return this.get<PaginatedResponse<Message>>(API_ENDPOINTS.MESSAGES.BY_BOOKING(bookingId), {
      params,
    });
  }

  // Send a new message
  async sendMessage(data: {
    bookingId: number;
    message: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
  }): Promise<Message> {
    return this.post<Message>(API_ENDPOINTS.MESSAGES.SEND, data);
  }

  // Mark a message as read
  async markAsRead(messageId: number): Promise<Message> {
    return this.patch<Message>(API_ENDPOINTS.MESSAGES.MARK_READ(messageId));
  }

  // Mark all messages in a booking conversation as read
  async markAllAsRead(bookingId: number): Promise<void> {
    return this.patch<void>(`${API_ENDPOINTS.MESSAGES.BY_BOOKING(bookingId)}/read-all`);
  }

  // Get unread message count
  async getUnreadCount(): Promise<{ count: number }> {
    return this.get<{ count: number }>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/unread-count`);
  }

  // Delete a message (soft delete)
  async deleteMessage(messageId: number): Promise<void> {
    return this.delete<void>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/${messageId}`);
  }

  // Upload file for message attachment
  async uploadMessageFile(file: File): Promise<{
    url: string;
    fileName: string;
    fileSize: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.post(`${API_ENDPOINTS.UPLOAD.IMAGE}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Get message history between two users for a specific listing
  async getMessageHistory(data: {
    userId: number;
    listingId: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Message>> {
    return this.get<PaginatedResponse<Message>>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/history`, {
      params: data,
    });
  }

  // Search messages
  async searchMessages(params: {
    query: string;
    bookingId?: number;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Message>> {
    return this.get<PaginatedResponse<Message>>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/search`, {
      params,
    });
  }

  // Report a message (for inappropriate content)
  async reportMessage(messageId: number, reason: string): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/${messageId}/report`, {
      reason,
    });
  }

  // Block messages from a user
  async blockUser(userId: number): Promise<void> {
    return this.post<void>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/block/${userId}`);
  }

  // Unblock messages from a user
  async unblockUser(userId: number): Promise<void> {
    return this.delete<void>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/block/${userId}`);
  }

  // Get blocked users list
  async getBlockedUsers(): Promise<{ users: number[] }> {
    return this.get<{ users: number[] }>(`${API_ENDPOINTS.MESSAGES.CONVERSATIONS}/blocked`);
  }
}

export const messagesService = new MessagesService();
export default messagesService;