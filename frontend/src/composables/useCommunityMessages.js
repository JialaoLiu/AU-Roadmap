import { ref } from 'vue';
import {
  getMessages,
  sendMessage,
} from '@/api/community';

export function useCommunityMessages() {
  const activeConversation = ref(null);
  const chatMessages = ref([]);
  const chatLoading = ref(false);
  const newMessage = ref('');
  const sendingMessage = ref(false);

  async function openConversation(conversation) {
    activeConversation.value = conversation;
    chatLoading.value = true;
    try {
      const res = await getMessages(conversation.partner_id);
      chatMessages.value = res.data.data;
      conversation.unread_count = 0;
    } catch (err) {
      console.error(err);
    } finally {
      chatLoading.value = false;
    }
  }

  async function handleSendMessage() {
    if (!newMessage.value.trim() || !activeConversation.value) return;
    sendingMessage.value = true;
    try {
      const res = await sendMessage(activeConversation.value.partner_id, newMessage.value);
      chatMessages.value.push(res.data.data);
      newMessage.value = '';
      activeConversation.value.last_message = res.data.data.content;
      activeConversation.value.last_message_at = res.data.data.created_at;
    } catch (err) {
      console.error(err);
    } finally {
      sendingMessage.value = false;
    }
  }

  return {
    activeConversation,
    chatMessages,
    chatLoading,
    newMessage,
    sendingMessage,
    openConversation,
    handleSendMessage,
  };
}
