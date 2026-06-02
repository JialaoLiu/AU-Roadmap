import {
  respondToConnection,
} from '@/api/community';

export function useCommunityConnections(communityStore) {
  async function fetchCommunityNetwork() {
    await Promise.all([
      communityStore.fetchConnections(),
      communityStore.fetchPendingRequests(),
      communityStore.fetchConversations(),
    ]);
  }

  async function handleRespondConnection(connectionId, action) {
    try {
      await respondToConnection(connectionId, action);
      await communityStore.fetchPendingRequests();
      await communityStore.fetchConnections();
    } catch (err) {
      console.error(err);
    }
  }

  return {
    fetchCommunityNetwork,
    handleRespondConnection,
  };
}
