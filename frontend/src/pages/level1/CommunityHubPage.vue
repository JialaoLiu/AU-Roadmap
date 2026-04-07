<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCommunityStore } from '@/stores/community';
import {
  getAlumniProfiles, getAlumniProfile,
  sendConnectionRequest, respondToConnection,
  getMessages, sendMessage, markAsRead,
  getAllThreads, getThread, createThread, createReply, deleteThread, deleteReply,
} from '@/api/community';

const authStore = useAuthStore();
const communityStore = useCommunityStore();

// Tab management
const activeTab = ref('feed');
const tabs = [
  { key: 'feed', label: 'Feed', icon: 'forum' },
  { key: 'people', label: 'People', icon: 'group' },
  { key: 'messages', label: 'Messages', icon: 'mail' },
  { key: 'network', label: 'Network', icon: 'hub' },
];

// ==================== FEED TAB ====================
const threads = ref([]);
const threadsLoading = ref(true);
const activeThreadId = ref(null);
const activeThreadData = ref(null);
const threadLoading = ref(false);
const showNewThread = ref(false);
const newTitle = ref('');
const newContent = ref('');
const newCategory = ref('general');
const replyContent = ref('');
const posting = ref(false);
const feedCategory = ref('all');

const categories = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'career', label: 'Career' },
  { key: 'academic', label: 'Academic' },
  { key: 'social', label: 'Social' },
];

async function fetchThreads() {
  threadsLoading.value = true;
  try {
    const params = {};
    if (feedCategory.value !== 'all') params.category = feedCategory.value;
    const res = await getAllThreads(params);
    threads.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    threadsLoading.value = false;
  }
}

async function openThread(thread) {
  if (activeThreadId.value === thread.id) {
    activeThreadId.value = null;
    activeThreadData.value = null;
    return;
  }
  activeThreadId.value = thread.id;
  threadLoading.value = true;
  try {
    const res = await getThread(thread.id);
    activeThreadData.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    threadLoading.value = false;
  }
}

async function submitThread() {
  if (!newTitle.value.trim() || !newContent.value.trim()) return;
  posting.value = true;
  try {
    await createThread({ title: newTitle.value, content: newContent.value, category: newCategory.value });
    newTitle.value = '';
    newContent.value = '';
    newCategory.value = 'general';
    showNewThread.value = false;
    await fetchThreads();
  } catch (err) {
    console.error(err);
  } finally {
    posting.value = false;
  }
}

async function submitReply() {
  if (!replyContent.value.trim() || !activeThreadId.value) return;
  posting.value = true;
  try {
    await createReply(activeThreadId.value, replyContent.value);
    replyContent.value = '';
    const res = await getThread(activeThreadId.value);
    activeThreadData.value = res.data.data;
    const t = threads.value.find(t => t.id === activeThreadId.value);
    if (t) t.reply_count = activeThreadData.value.replies.length;
  } catch (err) {
    console.error(err);
  } finally {
    posting.value = false;
  }
}

async function handleDeleteThread(threadId) {
  try {
    await deleteThread(threadId);
    activeThreadId.value = null;
    activeThreadData.value = null;
    await fetchThreads();
  } catch (err) {
    console.error(err);
  }
}

async function handleDeleteReply(replyId) {
  try {
    await deleteReply(replyId);
    const res = await getThread(activeThreadId.value);
    activeThreadData.value = res.data.data;
    const t = threads.value.find(t => t.id === activeThreadId.value);
    if (t) t.reply_count = activeThreadData.value.replies.length;
  } catch (err) {
    console.error(err);
  }
}

// ==================== PEOPLE TAB ====================
const alumni = ref([]);
const alumniLoading = ref(false);
const searchQuery = ref('');
const selectedAlumni = ref(null);

async function fetchAlumni() {
  alumniLoading.value = true;
  try {
    const params = {};
    if (searchQuery.value) params.search = searchQuery.value;
    const res = await getAlumniProfiles(params);
    alumni.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    alumniLoading.value = false;
  }
}

async function viewProfile(a) {
  try {
    const res = await getAlumniProfile(a.id);
    selectedAlumni.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
}

async function handleConnect(alumniUser) {
  try {
    await sendConnectionRequest(alumniUser.id);
    alumniUser.connection_status = 'pending';
  } catch (err) {
    console.error(err);
  }
}

// ==================== MESSAGES TAB ====================
const activeConversation = ref(null);
const chatMessages = ref([]);
const chatLoading = ref(false);
const newMessage = ref('');
const sendingMessage = ref(false);

async function openConversation(conv) {
  activeConversation.value = conv;
  chatLoading.value = true;
  try {
    const res = await getMessages(conv.partner_id);
    chatMessages.value = res.data.data;
    conv.unread_count = 0;
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
    // Update last message in conversation list
    activeConversation.value.last_message = res.data.data.content;
    activeConversation.value.last_message_at = res.data.data.created_at;
  } catch (err) {
    console.error(err);
  } finally {
    sendingMessage.value = false;
  }
}

// ==================== NETWORK TAB ====================
async function handleRespondConnection(connectionId, action) {
  try {
    await respondToConnection(connectionId, action);
    await communityStore.fetchPendingRequests();
    await communityStore.fetchConnections();
  } catch (err) {
    console.error(err);
  }
}

// ==================== SHARED ====================
function getInitials(item) {
  return (item.first_name?.[0] || '') + (item.last_name?.[0] || '');
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function roleLabel(role) {
  if (role === 'student') return 'Student';
  if (role === 'admin') return 'Admin';
  if (role === 'alumni') return 'Alumni';
  if (role === 'prospective') return 'Prospective';
  return role;
}

function canDelete(item) {
  return authStore.user?.id === item.user_id || authStore.isAdmin;
}

watch(feedCategory, fetchThreads);

onMounted(async () => {
  fetchThreads();
  fetchAlumni();
  if (authStore.isAuthenticated) {
    communityStore.fetchConnections();
    communityStore.fetchPendingRequests();
    communityStore.fetchConversations();
  }
});
</script>

<template>
  <div class="community-hub">
    <!-- Header -->
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">groups</span>
        <div>
          <h1>Community Hub</h1>
          <p class="page-subtitle">Connect with alumni, discuss topics, and grow your network</p>
        </div>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ 'tab-btn--active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="material-symbols-outlined">{{ tab.icon }}</span>
        {{ tab.label }}
        <span v-if="tab.key === 'messages' && communityStore.unreadCount" class="tab-badge">{{ communityStore.unreadCount }}</span>
        <span v-if="tab.key === 'network' && communityStore.pendingCount" class="tab-badge">{{ communityStore.pendingCount }}</span>
      </button>
    </div>

    <!-- ==================== FEED TAB ==================== -->
    <div v-if="activeTab === 'feed'" class="tab-content">
      <div class="feed-controls">
        <div class="category-filter">
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="cat-btn"
            :class="{ 'cat-btn--active': feedCategory === cat.key }"
            @click="feedCategory = cat.key"
          >{{ cat.label }}</button>
        </div>
        <button v-if="authStore.isAuthenticated" class="btn-primary" @click="showNewThread = !showNewThread">
          <span class="material-symbols-outlined">{{ showNewThread ? 'close' : 'add' }}</span>
          {{ showNewThread ? 'Cancel' : 'New Post' }}
        </button>
      </div>

      <!-- New Thread Form -->
      <Transition name="slide">
        <div v-if="showNewThread" class="new-thread-form">
          <input v-model="newTitle" type="text" placeholder="Post title..." class="form-input" maxlength="200" />
          <textarea v-model="newContent" placeholder="What would you like to discuss?" class="form-textarea" rows="3"></textarea>
          <div class="form-row">
            <select v-model="newCategory" class="form-select">
              <option value="general">General</option>
              <option value="career">Career</option>
              <option value="academic">Academic</option>
              <option value="social">Social</option>
            </select>
            <button class="btn-primary" :disabled="!newTitle.trim() || !newContent.trim() || posting" @click="submitThread">
              <span class="material-symbols-outlined">send</span>
              {{ posting ? 'Posting...' : 'Post' }}
            </button>
          </div>
        </div>
      </Transition>

      <div v-if="threadsLoading" class="loading-state"><div class="loading-spinner"></div></div>

      <div v-else-if="threads.length" class="threads-list">
        <div
          v-for="t in threads"
          :key="t.id"
          class="thread-item"
          :class="{ 'thread-item--active': activeThreadId === t.id, 'thread-item--pinned': t.is_pinned }"
        >
          <div class="thread-header" @click="openThread(t)">
            <div class="avatar avatar--sm">{{ getInitials(t) }}</div>
            <div class="thread-main">
              <div class="thread-title-row">
                <span v-if="t.is_pinned" class="material-symbols-outlined pin-icon">push_pin</span>
                <h3>{{ t.title }}</h3>
              </div>
              <div class="thread-meta">
                <span class="thread-author">{{ t.first_name }} {{ t.last_name }}</span>
                <span class="role-tag" :class="'role--' + t.user_role">{{ roleLabel(t.user_role) }}</span>
                <span v-if="t.category" class="cat-tag">{{ t.category }}</span>
                <span class="thread-time">{{ timeAgo(t.created_at) }}</span>
              </div>
            </div>
            <div class="thread-stats">
              <span class="material-symbols-outlined">chat_bubble_outline</span>
              <span>{{ t.reply_count }}</span>
            </div>
          </div>

          <Transition name="expand">
            <div v-if="activeThreadId === t.id" class="thread-expanded">
              <div v-if="threadLoading" class="loading-state" style="padding: var(--space-md)"><div class="loading-spinner"></div></div>
              <template v-else-if="activeThreadData">
                <div class="thread-body">
                  <p>{{ activeThreadData.thread.content }}</p>
                  <button v-if="canDelete(activeThreadData.thread)" class="btn-icon btn-icon--danger abs-top-right" @click.stop="handleDeleteThread(t.id)">
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <div class="replies-section">
                  <div v-for="r in activeThreadData.replies" :key="r.id" class="reply-item">
                    <div class="avatar avatar--xs">{{ getInitials(r) }}</div>
                    <div class="reply-content">
                      <div class="reply-meta">
                        <span class="reply-author">{{ r.first_name }} {{ r.last_name }}</span>
                        <span class="role-tag" :class="'role--' + r.user_role">{{ roleLabel(r.user_role) }}</span>
                        <span class="reply-time">{{ timeAgo(r.created_at) }}</span>
                        <button v-if="canDelete(r)" class="btn-icon btn-icon--danger btn-icon--sm" @click="handleDeleteReply(r.id)">
                          <span class="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                      <p>{{ r.content }}</p>
                    </div>
                  </div>
                  <div v-if="!activeThreadData.replies.length" class="no-replies">No replies yet. Be the first to respond!</div>
                </div>

                <div v-if="authStore.isAuthenticated" class="reply-form">
                  <textarea v-model="replyContent" placeholder="Write a reply..." class="form-textarea" rows="2"></textarea>
                  <button class="btn-primary btn-primary--icon" :disabled="!replyContent.trim() || posting" @click="submitReply">
                    <span class="material-symbols-outlined">send</span>
                  </button>
                </div>
              </template>
            </div>
          </Transition>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="material-symbols-outlined empty-icon">forum</span>
        <h2>No Discussions Yet</h2>
        <p>Start a conversation with your community!</p>
      </div>
    </div>

    <!-- ==================== PEOPLE TAB ==================== -->
    <div v-if="activeTab === 'people'" class="tab-content">
      <div class="search-bar">
        <span class="material-symbols-outlined search-icon">search</span>
        <input v-model="searchQuery" type="text" placeholder="Search alumni by name, company, or role..." class="search-input" @input="fetchAlumni" />
      </div>

      <div v-if="alumniLoading" class="loading-state"><div class="loading-spinner"></div></div>

      <div v-else-if="alumni.length" class="people-grid">
        <div v-for="a in alumni" :key="a.id" class="person-card" @click="viewProfile(a)">
          <div class="person-card__top">
            <div v-if="a.avatar_url" class="avatar avatar--lg">
              <img :src="a.avatar_url" :alt="a.first_name" />
            </div>
            <div v-else class="avatar avatar--lg avatar--initials">{{ getInitials(a) }}</div>
            <span v-if="a.is_featured" class="featured-badge">
              <span class="material-symbols-outlined">star</span>
            </span>
          </div>
          <h3>{{ a.first_name }} {{ a.last_name }}</h3>
          <p v-if="a.current_role" class="person-role">{{ a.current_role }}</p>
          <p v-if="a.current_company" class="person-company">{{ a.current_company }}</p>
          <div class="person-meta">
            <span v-if="a.location">
              <span class="material-symbols-outlined">location_on</span>
              {{ a.location }}
            </span>
            <span>
              <span class="material-symbols-outlined">school</span>
              Class of {{ a.graduation_year }}
            </span>
          </div>
          <button
            v-if="authStore.isAuthenticated && a.id !== authStore.user?.id"
            class="btn-connect"
            :class="{
              'btn-connect--pending': a.connection_status === 'pending',
              'btn-connect--connected': a.connection_status === 'accepted'
            }"
            :disabled="a.connection_status === 'pending' || a.connection_status === 'accepted'"
            @click.stop="handleConnect(a)"
          >
            <span class="material-symbols-outlined">
              {{ a.connection_status === 'accepted' ? 'check_circle' : a.connection_status === 'pending' ? 'hourglass_top' : 'person_add' }}
            </span>
            {{ a.connection_status === 'accepted' ? 'Following' : a.connection_status === 'pending' ? 'Pending' : 'Follow' }}
          </button>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="material-symbols-outlined empty-icon">group</span>
        <h2>No Alumni Found</h2>
        <p>Try adjusting your search filters.</p>
      </div>

      <!-- Alumni Detail Modal -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="selectedAlumni" class="modal-overlay" @click.self="selectedAlumni = null">
            <div class="modal-content">
              <div class="modal-header">
                <div class="modal-header__profile">
                  <div v-if="selectedAlumni.avatar_url" class="avatar avatar--modal">
                    <img :src="selectedAlumni.avatar_url" :alt="selectedAlumni.first_name" />
                  </div>
                  <div v-else class="avatar avatar--modal avatar--initials">{{ getInitials(selectedAlumni) }}</div>
                  <div>
                    <h2>{{ selectedAlumni.first_name }} {{ selectedAlumni.last_name }}</h2>
                    <p v-if="selectedAlumni.current_role" class="modal-role">{{ selectedAlumni.current_role }}</p>
                    <p v-if="selectedAlumni.connection_count != null" class="modal-connections">
                      <span class="material-symbols-outlined">people</span>
                      {{ selectedAlumni.connection_count }} connections
                    </p>
                  </div>
                </div>
                <button class="btn-icon" @click="selectedAlumni = null">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="modal-info-grid">
                  <div v-if="selectedAlumni.current_company" class="modal-info-item">
                    <span class="material-symbols-outlined">business</span>
                    <div><span class="info-label">Company</span><span class="info-value">{{ selectedAlumni.current_company }}</span></div>
                  </div>
                  <div v-if="selectedAlumni.location" class="modal-info-item">
                    <span class="material-symbols-outlined">location_on</span>
                    <div><span class="info-label">Location</span><span class="info-value">{{ selectedAlumni.location }}</span></div>
                  </div>
                  <div class="modal-info-item">
                    <span class="material-symbols-outlined">school</span>
                    <div><span class="info-label">Graduated</span><span class="info-value">{{ selectedAlumni.graduation_year }}</span></div>
                  </div>
                  <div v-if="selectedAlumni.program_name" class="modal-info-item">
                    <span class="material-symbols-outlined">menu_book</span>
                    <div><span class="info-label">Program</span><span class="info-value">{{ selectedAlumni.program_name }}</span></div>
                  </div>
                </div>
                <div v-if="selectedAlumni.bio" class="modal-section">
                  <h3>About</h3>
                  <p>{{ selectedAlumni.bio }}</p>
                </div>
                <div v-if="selectedAlumni.success_story" class="modal-section">
                  <h3>My Story</h3>
                  <p class="success-story">{{ selectedAlumni.success_story }}</p>
                </div>
                <a v-if="selectedAlumni.linkedin_url" :href="selectedAlumni.linkedin_url" target="_blank" rel="noopener" class="linkedin-btn">
                  <span class="material-symbols-outlined">open_in_new</span>
                  View LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>

    <!-- ==================== MESSAGES TAB ==================== -->
    <div v-if="activeTab === 'messages'" class="tab-content">
      <div v-if="!authStore.isAuthenticated" class="empty-state">
        <span class="material-symbols-outlined empty-icon">lock</span>
        <h2>Sign in Required</h2>
        <p>You need to be logged in to view messages.</p>
      </div>
      <div v-else class="messages-layout">
        <div class="conversations-panel">
          <h3 class="panel-title">Conversations</h3>
          <div v-if="communityStore.conversations.length" class="conversation-list">
            <div
              v-for="conv in communityStore.conversations"
              :key="conv.partner_id"
              class="conversation-item"
              :class="{ 'conversation-item--active': activeConversation?.partner_id === conv.partner_id }"
              @click="openConversation(conv)"
            >
              <div v-if="conv.avatar_url" class="avatar avatar--sm">
                <img :src="conv.avatar_url" :alt="conv.first_name" />
              </div>
              <div v-else class="avatar avatar--sm avatar--initials">{{ getInitials(conv) }}</div>
              <div class="conv-info">
                <div class="conv-name">{{ conv.first_name }} {{ conv.last_name }}</div>
                <div class="conv-preview">{{ conv.last_message }}</div>
              </div>
              <div class="conv-right">
                <span class="conv-time">{{ timeAgo(conv.last_message_at) }}</span>
                <span v-if="conv.unread_count" class="unread-badge">{{ conv.unread_count }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state-sm">
            <span class="material-symbols-outlined">chat</span>
            <p>No conversations yet</p>
          </div>
        </div>

        <div class="chat-panel">
          <template v-if="activeConversation">
            <div class="chat-header">
              <div v-if="activeConversation.avatar_url" class="avatar avatar--sm">
                <img :src="activeConversation.avatar_url" :alt="activeConversation.first_name" />
              </div>
              <div v-else class="avatar avatar--sm avatar--initials">{{ getInitials(activeConversation) }}</div>
              <div>
                <h3>{{ activeConversation.first_name }} {{ activeConversation.last_name }}</h3>
                <p v-if="activeConversation.current_role" class="chat-role">{{ activeConversation.current_role }}</p>
              </div>
            </div>
            <div v-if="chatLoading" class="loading-state"><div class="loading-spinner"></div></div>
            <div v-else class="chat-messages">
              <div
                v-for="msg in chatMessages"
                :key="msg.id"
                class="chat-msg"
                :class="{ 'chat-msg--own': msg.sender_id === authStore.user?.id }"
              >
                <div class="msg-bubble">
                  <p>{{ msg.content }}</p>
                  <span class="msg-time">{{ timeAgo(msg.created_at) }}</span>
                </div>
              </div>
            </div>
            <div class="chat-input">
              <textarea
                v-model="newMessage"
                placeholder="Type a message..."
                class="form-textarea"
                rows="1"
                @keydown.enter.exact.prevent="handleSendMessage"
              ></textarea>
              <button class="btn-primary btn-primary--icon" :disabled="!newMessage.trim() || sendingMessage" @click="handleSendMessage">
                <span class="material-symbols-outlined">send</span>
              </button>
            </div>
          </template>
          <div v-else class="empty-state-sm">
            <span class="material-symbols-outlined">chat_bubble</span>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ==================== NETWORK TAB ==================== -->
    <div v-if="activeTab === 'network'" class="tab-content">
      <div v-if="!authStore.isAuthenticated" class="empty-state">
        <span class="material-symbols-outlined empty-icon">lock</span>
        <h2>Sign in Required</h2>
        <p>You need to be logged in to view your network.</p>
      </div>
      <template v-else>
        <!-- Pending Requests -->
        <div v-if="communityStore.pendingRequests.length" class="network-section">
          <h2 class="section-title">
            <span class="material-symbols-outlined">notifications</span>
            Pending Requests ({{ communityStore.pendingCount }})
          </h2>
          <div class="request-list">
            <div v-for="req in communityStore.pendingRequests" :key="req.connection_id" class="request-card">
              <div v-if="req.avatar_url" class="avatar avatar--sm">
                <img :src="req.avatar_url" :alt="req.first_name" />
              </div>
              <div v-else class="avatar avatar--sm avatar--initials">{{ getInitials(req) }}</div>
              <div class="request-info">
                <h4>{{ req.first_name }} {{ req.last_name }}</h4>
                <p v-if="req.current_role">{{ req.current_role }}<span v-if="req.current_company"> at {{ req.current_company }}</span></p>
              </div>
              <div class="request-actions">
                <button class="btn-accept" @click="handleRespondConnection(req.connection_id, 'accept')">
                  <span class="material-symbols-outlined">check</span> Accept
                </button>
                <button class="btn-reject" @click="handleRespondConnection(req.connection_id, 'reject')">
                  <span class="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- My Connections -->
        <div class="network-section">
          <h2 class="section-title">
            <span class="material-symbols-outlined">people</span>
            My Connections ({{ communityStore.connectionCount }})
          </h2>
          <div v-if="communityStore.connections.length" class="connections-grid">
            <div v-for="conn in communityStore.connections" :key="conn.connection_id" class="connection-card">
              <div v-if="conn.avatar_url" class="avatar avatar--md">
                <img :src="conn.avatar_url" :alt="conn.first_name" />
              </div>
              <div v-else class="avatar avatar--md avatar--initials">{{ getInitials(conn) }}</div>
              <h4>{{ conn.first_name }} {{ conn.last_name }}</h4>
              <p v-if="conn.current_role" class="conn-role">{{ conn.current_role }}</p>
              <p v-if="conn.current_company" class="conn-company">{{ conn.current_company }}</p>
              <span class="role-tag" :class="'role--' + conn.role">{{ roleLabel(conn.role) }}</span>
            </div>
          </div>
          <div v-else class="empty-state">
            <span class="material-symbols-outlined empty-icon">hub</span>
            <h2>No Connections Yet</h2>
            <p>Visit the People tab to find alumni and build your network!</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.community-hub { padding: var(--space-lg); }

/* Page Header */
.page-header { margin-bottom: var(--space-lg); }
.page-header__left { display: flex; align-items: center; gap: var(--space-md); }
.page-icon { font-size: 32px; color: var(--color-primary); }
.page-header h1 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); }
.page-subtitle { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 2px; }

/* Tab Bar */
.tab-bar {
  display: flex; gap: var(--space-xs);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-xs);
  margin-bottom: var(--space-lg);
}
.tab-btn {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: none; border: none; border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 500;
  color: var(--color-text-secondary); cursor: pointer;
  transition: all var(--transition-fast); position: relative;
}
.tab-btn:hover { background: var(--color-bg-secondary); color: var(--color-text-primary); }
.tab-btn--active { background: var(--color-primary); color: var(--color-white); }
.tab-btn .material-symbols-outlined { font-size: 20px; }
.tab-badge {
  position: absolute; top: 2px; right: 4px;
  background: var(--color-secondary); color: white;
  font-size: 10px; font-weight: 700;
  min-width: 16px; height: 16px; padding: 0 4px;
  border-radius: var(--border-radius-full);
  display: flex; align-items: center; justify-content: center;
}

/* Shared Components */
.avatar {
  border-radius: 50%; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar--xs { width: 32px; height: 32px; font-size: 10px; }
.avatar--sm { width: 40px; height: 40px; font-size: var(--font-size-xs); }
.avatar--md { width: 48px; height: 48px; font-size: var(--font-size-sm); }
.avatar--lg { width: 72px; height: 72px; font-size: var(--font-size-xl); }
.avatar--modal { width: 56px; height: 56px; font-size: var(--font-size-lg); }
.avatar--initials {
  background: rgba(20, 15, 80, 0.08); color: var(--color-primary); font-weight: 700;
}

.btn-primary {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary); color: var(--color-white);
  border: none; border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 500;
  cursor: pointer; transition: background var(--transition-fast);
}
.btn-primary:hover { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary .material-symbols-outlined { font-size: 18px; }
.btn-primary--icon { padding: var(--space-sm); }

.btn-icon {
  background: none; border: none; cursor: pointer;
  color: var(--color-text-light); padding: 4px;
  border-radius: var(--border-radius-sm);
}
.btn-icon:hover { background: var(--color-bg-tertiary); color: var(--color-text-primary); }
.btn-icon--danger:hover { color: #c62828; background: rgba(198,40,40,0.06); }
.btn-icon--sm .material-symbols-outlined { font-size: 16px; }
.abs-top-right { position: absolute; top: var(--space-sm); right: var(--space-md); }

.form-input {
  width: 100%; padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
  font-size: var(--font-size-md); font-weight: 600;
  margin-bottom: var(--space-sm); outline: none;
}
.form-input:focus { border-color: var(--color-primary); }
.form-textarea {
  width: 100%; padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-family: inherit;
  resize: vertical; outline: none;
}
.form-textarea:focus { border-color: var(--color-primary); }
.form-select {
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); outline: none;
}
.form-row { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-sm); }

.role-tag {
  padding: 1px 8px; border-radius: var(--border-radius-full);
  font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;
}
.role--student { background: rgba(20, 15, 80, 0.08); color: var(--color-primary); }
.role--admin { background: rgba(198, 40, 40, 0.08); color: #c62828; }
.role--alumni { background: rgba(46, 125, 50, 0.08); color: #2e7d32; }
.role--prospective { background: rgba(245, 124, 0, 0.08); color: #f57c00; }

.section-title {
  display: flex; align-items: center; gap: var(--space-sm);
  font-size: var(--font-size-md); font-weight: 600;
  color: var(--color-text-primary); margin-bottom: var(--space-lg);
}
.section-title .material-symbols-outlined { font-size: 22px; color: var(--color-primary); }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: var(--space-3xl); text-align: center; }
.empty-icon { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.empty-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.empty-state p { color: var(--color-text-secondary); }

.empty-state-sm {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: var(--space-xl); text-align: center; color: var(--color-text-light);
  height: 100%;
}
.empty-state-sm .material-symbols-outlined { font-size: 36px; margin-bottom: var(--space-sm); }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--color-border);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ==================== FEED TAB ==================== */
.feed-controls {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: var(--space-lg);
}
.category-filter { display: flex; gap: var(--space-xs); }
.cat-btn {
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--border-radius-full);
  background: var(--color-white); color: var(--color-text-secondary);
  font-size: var(--font-size-xs); font-weight: 500; cursor: pointer;
  transition: all var(--transition-fast);
}
.cat-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
.cat-btn--active { background: var(--color-primary); color: white; border-color: var(--color-primary); }

.cat-tag {
  padding: 1px 6px; border-radius: var(--border-radius-full);
  font-size: 10px; font-weight: 500;
  background: var(--color-bg-tertiary); color: var(--color-text-secondary);
}

.new-thread-form {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.threads-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.thread-item {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); overflow: hidden;
  transition: all var(--transition-fast);
}
.thread-item:hover { border-color: var(--color-primary); }
.thread-item--active { border-color: var(--color-primary); box-shadow: var(--shadow-sm); }
.thread-item--pinned { border-left: 3px solid var(--color-primary); }

.thread-header {
  display: flex; align-items: center; gap: var(--space-md);
  padding: var(--space-md) var(--space-lg); cursor: pointer;
}
.thread-main { flex: 1; min-width: 0; }
.thread-title-row { display: flex; align-items: center; gap: var(--space-xs); }
.pin-icon { font-size: 16px; color: var(--color-primary); }
.thread-main h3 {
  font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.thread-meta {
  display: flex; align-items: center; gap: var(--space-sm);
  margin-top: 2px; font-size: var(--font-size-xs);
}
.thread-author { font-weight: 500; color: var(--color-text-secondary); }
.thread-time { color: var(--color-text-light); }
.thread-stats {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--font-size-xs); color: var(--color-text-light);
}
.thread-stats .material-symbols-outlined { font-size: 18px; }

.thread-expanded { border-top: 1px solid var(--color-border); }
.thread-body {
  padding: var(--space-md) var(--space-lg); position: relative;
}
.thread-body p {
  font-size: var(--font-size-sm); color: var(--color-text-secondary);
  line-height: 1.6; white-space: pre-wrap;
}

.replies-section { padding: 0 var(--space-lg) var(--space-md); }
.reply-item {
  display: flex; gap: var(--space-sm);
  padding: var(--space-sm) 0;
  border-top: 1px solid var(--color-bg-secondary);
}
.reply-content { flex: 1; min-width: 0; }
.reply-meta {
  display: flex; align-items: center; gap: var(--space-xs);
  margin-bottom: 2px; font-size: var(--font-size-xs);
}
.reply-author { font-weight: 500; color: var(--color-text-secondary); }
.reply-time { color: var(--color-text-light); }
.reply-content p {
  font-size: var(--font-size-sm); color: var(--color-text-primary);
  line-height: 1.5; white-space: pre-wrap;
}
.no-replies {
  text-align: center; padding: var(--space-md);
  font-size: var(--font-size-sm); color: var(--color-text-light);
}

.reply-form {
  display: flex; gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg) var(--space-lg);
}
.reply-form .form-textarea { flex: 1; }

/* ==================== PEOPLE TAB ==================== */
.search-bar {
  display: flex; align-items: center; gap: var(--space-sm);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-sm) var(--space-lg);
  margin-bottom: var(--space-lg);
}
.search-icon { color: var(--color-text-light); font-size: 22px; }
.search-input {
  flex: 1; border: none; outline: none;
  font-size: var(--font-size-sm); color: var(--color-text-primary);
}

.people-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
.person-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  text-align: center; cursor: pointer;
  transition: all var(--transition-fast);
}
.person-card:hover { border-color: var(--color-primary); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.person-card__top { position: relative; display: flex; justify-content: center; margin-bottom: var(--space-md); }
.featured-badge {
  position: absolute; top: -4px; right: calc(50% - 44px);
  background: var(--color-accent); color: white;
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.featured-badge .material-symbols-outlined { font-size: 14px; }
.person-card h3 { font-size: var(--font-size-md); font-weight: 600; color: var(--color-text-primary); }
.person-role { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.person-company { font-size: var(--font-size-sm); font-weight: 500; color: var(--color-primary); margin-bottom: var(--space-sm); }
.person-meta {
  display: flex; justify-content: center; gap: var(--space-md);
  font-size: var(--font-size-xs); color: var(--color-text-light); margin-bottom: var(--space-md);
}
.person-meta span { display: flex; align-items: center; gap: 2px; }
.person-meta .material-symbols-outlined { font-size: 14px; }

.btn-connect {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border: 1px solid var(--color-primary); border-radius: var(--border-radius-full);
  background: transparent; color: var(--color-primary);
  font-size: var(--font-size-xs); font-weight: 500; cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-connect:hover { background: var(--color-primary); color: white; }
.btn-connect .material-symbols-outlined { font-size: 16px; }
.btn-connect--pending { border-color: var(--color-warning); color: var(--color-warning); cursor: default; }
.btn-connect--pending:hover { background: transparent; color: var(--color-warning); }
.btn-connect--connected { border-color: var(--color-success); color: var(--color-success); cursor: default; }
.btn-connect--connected:hover { background: transparent; color: var(--color-success); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 300; padding: var(--space-lg);
}
.modal-content {
  background: var(--color-white); border-radius: var(--border-radius-lg);
  max-width: 520px; width: 100%; max-height: 80vh;
  overflow-y: auto; box-shadow: var(--shadow-xl);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: var(--space-lg) var(--space-xl); border-bottom: 1px solid var(--color-border);
}
.modal-header__profile { display: flex; align-items: center; gap: var(--space-md); }
.modal-header h2 { font-size: var(--font-size-lg); font-weight: 700; color: var(--color-text-primary); }
.modal-role { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.modal-connections {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--font-size-xs); color: var(--color-text-light); margin-top: 2px;
}
.modal-connections .material-symbols-outlined { font-size: 14px; }
.modal-body { padding: var(--space-lg) var(--space-xl); }
.modal-info-grid { display: flex; flex-wrap: wrap; gap: var(--space-lg); margin-bottom: var(--space-xl); }
.modal-info-item { display: flex; align-items: center; gap: var(--space-sm); }
.modal-info-item .material-symbols-outlined { font-size: 20px; color: var(--color-primary); }
.info-label { display: block; font-size: var(--font-size-xs); color: var(--color-text-light); }
.info-value { display: block; font-size: var(--font-size-sm); font-weight: 500; color: var(--color-text-primary); }
.modal-section { margin-bottom: var(--space-lg); }
.modal-section h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.modal-section p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; }
.success-story {
  background: var(--color-bg-secondary); padding: var(--space-md);
  border-radius: var(--border-radius-md); border-left: 3px solid var(--color-primary);
}
.linkedin-btn {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary); color: var(--color-white);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 500;
  transition: background var(--transition-fast); text-decoration: none;
}
.linkedin-btn:hover { background: var(--color-primary-light); }
.linkedin-btn .material-symbols-outlined { font-size: 18px; }

/* ==================== MESSAGES TAB ==================== */
.messages-layout {
  display: grid; grid-template-columns: 320px 1fr;
  border: 1px solid var(--color-border); border-radius: var(--border-radius-lg);
  background: var(--color-white); min-height: 500px; overflow: hidden;
}
.conversations-panel {
  border-right: 1px solid var(--color-border); overflow-y: auto;
}
.panel-title {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
}
.conversation-list { }
.conversation-item {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  cursor: pointer; transition: background var(--transition-fast);
  border-bottom: 1px solid var(--color-bg-secondary);
}
.conversation-item:hover { background: var(--color-bg-secondary); }
.conversation-item--active { background: var(--color-bg-tertiary); }
.conv-info { flex: 1; min-width: 0; }
.conv-name { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.conv-preview {
  font-size: var(--font-size-xs); color: var(--color-text-light);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.conv-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.conv-time { font-size: 10px; color: var(--color-text-light); }
.unread-badge {
  background: var(--color-primary); color: white;
  font-size: 10px; font-weight: 700;
  min-width: 18px; height: 18px; padding: 0 4px;
  border-radius: var(--border-radius-full);
  display: flex; align-items: center; justify-content: center;
}

.chat-panel { display: flex; flex-direction: column; }
.chat-header {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}
.chat-header h3 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.chat-role { font-size: var(--font-size-xs); color: var(--color-text-light); }

.chat-messages {
  flex: 1; overflow-y: auto; padding: var(--space-lg);
  display: flex; flex-direction: column; gap: var(--space-sm);
}
.chat-msg { display: flex; }
.chat-msg--own { justify-content: flex-end; }
.msg-bubble {
  max-width: 70%; padding: var(--space-sm) var(--space-md);
  border-radius: var(--border-radius-lg); font-size: var(--font-size-sm);
  background: var(--color-bg-secondary); color: var(--color-text-primary);
}
.chat-msg--own .msg-bubble { background: var(--color-primary); color: white; }
.msg-bubble p { line-height: 1.5; }
.msg-time { display: block; font-size: 10px; margin-top: 4px; opacity: 0.6; }

.chat-input {
  display: flex; gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--color-border);
}
.chat-input .form-textarea { flex: 1; resize: none; }

/* ==================== NETWORK TAB ==================== */
.network-section { margin-bottom: var(--space-2xl); }
.request-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.request-card {
  display: flex; align-items: center; gap: var(--space-md);
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); padding: var(--space-md) var(--space-lg);
}
.request-info { flex: 1; }
.request-info h4 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.request-info p { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
.request-actions { display: flex; gap: var(--space-sm); }
.btn-accept {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: var(--color-primary); color: white;
  border: none; border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs); font-weight: 500; cursor: pointer;
}
.btn-accept .material-symbols-outlined { font-size: 16px; }
.btn-reject {
  padding: var(--space-xs);
  background: none; border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-light); cursor: pointer;
}
.btn-reject:hover { border-color: #c62828; color: #c62828; }
.btn-reject .material-symbols-outlined { font-size: 18px; }

.connections-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); }
.connection-card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  text-align: center;
}
.connection-card h4 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); margin-top: var(--space-sm); }
.conn-role { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
.conn-company { font-size: var(--font-size-xs); font-weight: 500; color: var(--color-primary); margin-bottom: var(--space-xs); }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
.expand-enter-active, .expand-leave-active { transition: all 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal-content, .modal-leave-active .modal-content { transition: transform 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95); }

/* Responsive */
@media (max-width: 1024px) {
  .people-grid { grid-template-columns: repeat(2, 1fr); }
  .connections-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .tab-bar { overflow-x: auto; }
  .people-grid { grid-template-columns: 1fr; }
  .connections-grid { grid-template-columns: 1fr; }
  .messages-layout { grid-template-columns: 1fr; }
  .conversations-panel { max-height: 250px; }
  .feed-controls { flex-direction: column; gap: var(--space-sm); align-items: stretch; }
  .category-filter { overflow-x: auto; }
}
</style>
