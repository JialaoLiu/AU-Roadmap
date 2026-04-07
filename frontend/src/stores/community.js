import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  getConnections as fetchConnectionsApi,
  getPendingRequests as fetchRequestsApi,
  getConversations as fetchConversationsApi,
} from '@/api/community';

export const useCommunityStore = defineStore('community', () => {
  const connections = ref([]);
  const pendingRequests = ref([]);
  const conversations = ref([]);

  const unreadCount = computed(() =>
    conversations.value.reduce((sum, c) => sum + (c.unread_count || 0), 0)
  );

  const connectionCount = computed(() => connections.value.length);
  const pendingCount = computed(() => pendingRequests.value.length);

  async function fetchConnections() {
    try {
      const res = await fetchConnectionsApi();
      connections.value = res.data.data;
    } catch (err) {
      console.error('Failed to fetch connections:', err);
    }
  }

  async function fetchPendingRequests() {
    try {
      const res = await fetchRequestsApi();
      pendingRequests.value = res.data.data;
    } catch (err) {
      console.error('Failed to fetch pending requests:', err);
    }
  }

  async function fetchConversations() {
    try {
      const res = await fetchConversationsApi();
      conversations.value = res.data.data;
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }

  return {
    connections,
    pendingRequests,
    conversations,
    unreadCount,
    connectionCount,
    pendingCount,
    fetchConnections,
    fetchPendingRequests,
    fetchConversations,
  };
});
