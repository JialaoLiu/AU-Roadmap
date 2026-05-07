<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useCommunityStore } from '@/stores/community';
import {
  getAlumniProfiles, getAlumniProfile,
  sendConnectionRequest, respondToConnection,
  getMessages, sendMessage,
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

const tabDescriptions = {
  feed: 'Review current discussions, ask questions, and share advice with the community.',
  people: 'Browse alumni profiles and identify people relevant to your goals.',
  messages: 'Continue direct conversations with your network.',
  network: 'Review connection requests and manage your network.',
};

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

const summaryCards = computed(() => [
  {
    label: 'Connections',
    value: communityStore.connectionCount,
    helper: 'People in your network',
    icon: 'group',
  },
  {
    label: 'Unread',
    value: communityStore.unreadCount,
    helper: 'Messages to review',
    icon: 'mail',
    highlight: Boolean(communityStore.unreadCount),
  },
  {
    label: 'Discussions',
    value: threads.value.length,
    helper: 'Active community threads',
    icon: 'forum',
  },
]);

const activeTabDescription = computed(() => tabDescriptions[activeTab.value] || '');

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

function coverColorClass(index) {
  const classes = ['cov-0', 'cov-1', 'cov-2', 'cov-3', 'cov-4', 'cov-5'];
  return classes[index % 6];
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
    <section class="community-hero">
      <div class="community-hero__copy">
        <div class="hero-eyebrow">Student Community</div>
        <div class="page-header">
          <span class="material-symbols-outlined page-icon">groups</span>
          <div>
            <h1>Community Hub</h1>
            <p class="page-subtitle">Connect with alumni, join discussions, and build your network.</p>
          </div>
        </div>
      </div>

      <div class="hero-stats">
        <div
          v-for="card in summaryCards"
          :key="card.label"
          class="hero-stat"
          :class="{ 'hero-stat--highlight': card.highlight }"
        >
          <div class="hero-stat__icon">
            <span class="material-symbols-outlined">{{ card.icon }}</span>
          </div>
          <div class="hero-stat__body">
            <div class="hero-stat__label">{{ card.label }}</div>
            <div class="hero-stat__value">{{ card.value }}</div>
            <div class="hero-stat__helper">{{ card.helper }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="hub-shell">
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

      <p class="tab-description">{{ activeTabDescription }}</p>

      <!-- ==================== FEED TAB ==================== -->
      <div v-if="activeTab === 'feed'" class="tab-content feed-layout">
        <div class="feed-main">

          <!-- Compose Card -->
          <div v-if="authStore.isAuthenticated" class="card compose-card">
            <div class="compose-box">
              <div class="compose-av">{{ getInitials(authStore.user || {}) }}</div>
              <div>
                <div class="compose-label">Create a discussion</div>
                <div class="compose-input" @click="showNewThread = !showNewThread">
                  {{ showNewThread ? 'Close draft' : 'Ask a question, share advice, or start a discussion...' }}
                </div>
              </div>
            </div>
            <Transition name="slide">
              <div v-if="showNewThread" class="compose-form">
                <input v-model="newTitle" type="text" placeholder="Post title..." class="form-input" maxlength="200" />
                <textarea v-model="newContent" placeholder="What would you like to discuss?" class="form-textarea" rows="3"></textarea>
                <div class="compose-form-footer">
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
            <div class="compose-footer">
              <span class="compose-action"><span class="material-symbols-outlined">work</span> Career</span>
              <span class="compose-action"><span class="material-symbols-outlined">school</span> Academic</span>
              <span class="compose-action"><span class="material-symbols-outlined">celebration</span> Social</span>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="filter-row">
            <button
              v-for="cat in categories"
              :key="cat.key"
              class="chip"
              :class="{ 'chip--active': feedCategory === cat.key }"
              @click="feedCategory = cat.key"
            >{{ cat.label }}</button>
          </div>

          <div v-if="threadsLoading" class="loading-state"><div class="loading-spinner"></div></div>

          <!-- Posts List -->
          <div v-else-if="threads.length" class="posts-list">
            <div
              v-for="t in threads"
              :key="t.id"
              class="card post-card"
              :class="{ 'post-card--pinned': t.is_pinned }"
            >
              <div class="post-topline">
                <span v-if="t.category" class="post-tag" :class="'tag-' + t.category">{{ t.category }}</span>
                <span v-if="t.is_pinned" class="post-pin">
                  <span class="material-symbols-outlined">push_pin</span>
                  Pinned
                </span>
              </div>

              <div class="post-head" @click="openThread(t)">
                <div class="post-av">{{ getInitials(t) }}</div>
                <div class="post-meta">
                  <div class="post-name">{{ t.first_name }} {{ t.last_name }}</div>
                  <div class="post-role-line">
                    <span class="role-tag" :class="'role--' + t.user_role">{{ roleLabel(t.user_role) }}</span>
                    <span class="post-time">{{ timeAgo(t.created_at) }}</span>
                  </div>
                </div>
              </div>

              <div class="post-body">
                <h3 class="post-title" @click="openThread(t)">{{ t.title }}</h3>
              </div>

              <div class="post-actions">
                <button class="post-action" @click="openThread(t)">
                  <span class="material-symbols-outlined">chat_bubble_outline</span>
                  {{ t.reply_count }} {{ t.reply_count === 1 ? 'Reply' : 'Replies' }}
                </button>
                <button v-if="canDelete(t)" class="post-action post-action--danger" @click.stop="handleDeleteThread(t.id)">
                  <span class="material-symbols-outlined">delete</span>
                  Delete
                </button>
              </div>

              <Transition name="expand">
                <div v-if="activeThreadId === t.id" class="thread-expanded">
                  <div v-if="threadLoading" class="loading-state" style="padding: 16px"><div class="loading-spinner"></div></div>
                  <template v-else-if="activeThreadData">
                    <div class="thread-body">
                      <p>{{ activeThreadData.thread.content }}</p>
                    </div>
                    <div class="replies-section">
                      <div v-for="r in activeThreadData.replies" :key="r.id" class="reply-item">
                        <div class="avatar avatar--xs avatar--initials">{{ getInitials(r) }}</div>
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

        <aside class="feed-side">
          <div class="card side-card">
            <h3>Using This Space</h3>
            <p>Use the community space to ask practical questions, reconnect with alumni, and continue relevant conversations.</p>
            <div class="side-actions">
              <button class="side-link" @click="activeTab = 'people'">
                <span class="material-symbols-outlined">group</span>
                Explore people
              </button>
              <button class="side-link" @click="activeTab = 'network'">
                <span class="material-symbols-outlined">hub</span>
                Review network
              </button>
              <button class="side-link" @click="activeTab = 'messages'">
                <span class="material-symbols-outlined">mail</span>
                Open messages
              </button>
            </div>
          </div>

          <div class="card side-card side-card--muted">
            <h3>Good Practice</h3>
            <ul class="side-list">
              <li>Keep titles short and specific so others can scan quickly.</li>
              <li>Use the category chips to focus on academic, career, or social topics.</li>
              <li>Move to messages once a public thread turns into a one-to-one conversation.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>

    <!-- ==================== PEOPLE TAB ==================== -->
    <div v-if="activeTab === 'people'" class="tab-content">
      <div class="card people-toolbar-card">
        <div class="people-toolbar">
          <div class="search-wrap">
            <span class="material-symbols-outlined search-icon-abs">search</span>
            <input v-model="searchQuery" type="text" placeholder="Search alumni by name, company, or role..." class="people-search" @input="fetchAlumni" />
          </div>
        </div>
      </div>

      <div v-if="alumniLoading" class="loading-state"><div class="loading-spinner"></div></div>

      <div v-else-if="alumni.length" class="people-grid">
        <div v-for="(a, i) in alumni" :key="a.id" class="people-card" @click="viewProfile(a)">
          <div class="people-body">
            <span v-if="a.is_featured" class="featured-badge">
              <span class="material-symbols-outlined">star</span>
            </span>
            <div class="people-av" :class="!a.avatar_url ? coverColorClass(i) : 'people-av--img'">
              <img v-if="a.avatar_url" :src="a.avatar_url" :alt="a.first_name" />
              <template v-else>{{ getInitials(a) }}</template>
            </div>
            <div class="people-name">{{ a.first_name }} {{ a.last_name }}</div>
            <div v-if="a.current_role" class="people-role">{{ a.current_role }}</div>
            <div v-if="a.current_company" class="people-company">{{ a.current_company }}</div>
            <div class="people-prog">
              <span class="material-symbols-outlined" style="font-size:12px;vertical-align:middle">school</span>
              Class of {{ a.graduation_year }}
            </div>
            <button
              v-if="authStore.isAuthenticated && a.id !== authStore.user?.id"
              class="connect-btn"
              :class="{
                'connect-btn--pending': a.connection_status === 'pending',
                'connect-btn--connected': a.connection_status === 'accepted'
              }"
              :disabled="a.connection_status === 'pending' || a.connection_status === 'accepted'"
              @click.stop="handleConnect(a)"
            >
              <span class="material-symbols-outlined" style="font-size:14px">
                {{ a.connection_status === 'accepted' ? 'check_circle' : a.connection_status === 'pending' ? 'hourglass_top' : 'person_add' }}
              </span>
              {{ a.connection_status === 'accepted' ? 'Connected' : a.connection_status === 'pending' ? 'Pending' : 'Connect' }}
            </button>
          </div>
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
            <div v-for="req in communityStore.pendingRequests" :key="req.connection_id" class="card request-card">
              <div class="avatar avatar--sm avatar--initials">{{ getInitials(req) }}</div>
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
            <div v-for="(conn, i) in communityStore.connections" :key="conn.connection_id" class="card connection-card">
              <div class="conn-body">
                <div class="conn-av" :class="coverColorClass(i)">{{ getInitials(conn) }}</div>
                <h4>{{ conn.first_name }} {{ conn.last_name }}</h4>
                <p v-if="conn.current_role" class="conn-role">{{ conn.current_role }}</p>
                <p v-if="conn.current_company" class="conn-company">{{ conn.current_company }}</p>
                <span class="role-tag" :class="'role--' + conn.role">{{ roleLabel(conn.role) }}</span>
              </div>
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
.community-hub {
  padding: var(--space-lg);
  background:
    radial-gradient(circle at top right, rgba(20, 15, 80, 0.06), transparent 34%),
    linear-gradient(180deg, rgba(250, 250, 253, 0.96), rgba(243, 245, 250, 0.96));
}

.community-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(320px, 1fr);
  gap: var(--space-lg);
  padding: 28px;
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.08), transparent 26%),
    linear-gradient(135deg, #140f50 0%, #1b155d 45%, #27206f 100%);
  box-shadow: 0 22px 40px rgba(20, 15, 80, 0.16);
  margin-bottom: var(--space-lg);
}

.community-hero__copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-sm);
}

.hero-eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.88);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

/* ── Page Header ── */
.page-header { display: flex; align-items: flex-start; gap: 14px; }
.page-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  font-size: 28px;
  color: var(--color-white);
  background: rgba(255, 255, 255, 0.12);
}
.page-header h1 {
  font-size: clamp(2rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--color-white);
  line-height: 1.05;
}
.page-subtitle {
  max-width: 580px;
  font-size: 15px;
  color: rgba(240, 242, 255, 0.76);
  margin-top: 6px;
  line-height: 1.55;
}

.hero-stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  align-content: center;
}

.hero-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.hero-stat--highlight {
  background: rgba(255, 255, 255, 0.13);
}

.hero-stat__icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-white);
}

.hero-stat__icon .material-symbols-outlined { font-size: 22px; }
.hero-stat__label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(233, 236, 255, 0.68);
}
.hero-stat__value {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-white);
  line-height: 1.05;
  margin-top: 2px;
}
.hero-stat__helper {
  font-size: 12px;
  color: rgba(240, 242, 255, 0.74);
  margin-top: 4px;
}

.hub-shell {
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 32px rgba(20, 15, 80, 0.08);
  padding: 22px;
}

/* ── Tab Bar ── */
.tab-bar {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  background: #f2f4fa;
}
.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: transparent;
  border: none;
  border-radius: 14px;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition-fast);
}
.tab-btn:hover {
  background: rgba(20, 15, 80, 0.06);
  color: var(--color-primary);
}
.tab-btn--active {
  background: var(--color-white);
  color: var(--color-primary);
  box-shadow: 0 8px 16px rgba(20, 15, 80, 0.08);
}
.tab-btn .material-symbols-outlined { font-size: 19px; }
.tab-badge {
  background: var(--color-secondary); color: white;
  font-size: 10px; font-weight: 700;
  border-radius: 999px; padding: 1px 6px; min-width: 18px; text-align: center;
}

.tab-description {
  margin: 14px 0 22px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.feed-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(280px, 0.85fr);
  gap: 18px;
  align-items: start;
}

.feed-main,
.feed-side {
  min-width: 0;
}

/* ── Card Base ── */
.card {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: 18px; box-shadow: 0 12px 24px rgba(20, 15, 80, 0.06); overflow: hidden;
  margin-bottom: 14px;
}
.card:hover { box-shadow: 0 16px 32px rgba(20, 15, 80, 0.08); }

/* ── Shared: Avatar ── */
.avatar {
  border-radius: 50%; overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar--xs { width: 32px; height: 32px; font-size: 10px; }
.avatar--sm { width: 40px; height: 40px; font-size: var(--font-size-xs); }
.avatar--modal { width: 56px; height: 56px; font-size: var(--font-size-lg); }
.avatar--initials { background: rgba(20, 15, 80, 0.08); color: var(--color-primary); font-weight: 700; }

/* ── Shared: Buttons ── */
.btn-primary {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary); color: var(--color-white);
  border: none; border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 500;
  cursor: pointer; transition: background var(--transition-fast); font-family: inherit;
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

/* ── Shared: Forms ── */
.form-input {
  width: 100%; padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 600; font-family: inherit;
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

/* ── Shared: Role Tags ── */
.role-tag {
  padding: 1px 8px; border-radius: var(--border-radius-full);
  font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;
}
.role--student { background: rgba(20, 15, 80, 0.08); color: var(--color-primary); }
.role--admin { background: rgba(198, 40, 40, 0.08); color: #c62828; }
.role--alumni { background: rgba(46, 125, 50, 0.08); color: #2e7d32; }
.role--prospective { background: rgba(245, 124, 0, 0.08); color: #f57c00; }

/* ── Shared: Section Title ── */
.section-title {
  display: flex; align-items: center; gap: var(--space-sm);
  font-size: var(--font-size-md); font-weight: 600;
  color: var(--color-text-primary); margin-bottom: var(--space-lg);
}
.section-title .material-symbols-outlined { font-size: 22px; color: var(--color-primary); }

/* ── Shared: States ── */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: var(--space-3xl); text-align: center; }
.empty-icon { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.empty-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.empty-state p { color: var(--color-text-secondary); }

.empty-state-sm {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: var(--space-xl); text-align: center; color: var(--color-text-light); height: 100%;
}
.empty-state-sm .material-symbols-outlined { font-size: 36px; margin-bottom: var(--space-sm); }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--color-border);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Cover Color Classes (navy palette) ── */
.cov-0 { background: linear-gradient(135deg, rgb(20,15,80), #2a2270); }
.cov-1 { background: linear-gradient(135deg, #2a2270, #3d3599); }
.cov-2 { background: linear-gradient(135deg, #3d3599, #4a4080); }
.cov-3 { background: linear-gradient(135deg, var(--color-secondary), #c0392b); }
.cov-4 { background: linear-gradient(135deg, #4a4080, #6b5ea8); }
.cov-5 { background: linear-gradient(135deg, #0d0a38, rgb(20,15,80)); }

/* ==================== FEED TAB ==================== */
/* Compose box */
.compose-card {
  padding: 10px;
}
.compose-box {
  padding: 10px 12px;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 12px;
  align-items: center;
}
.compose-av {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--color-primary); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; flex-shrink: 0;
}
.compose-label {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}
.compose-input {
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  color: var(--color-text-secondary);
  background: linear-gradient(180deg, #fafbff, #f4f6fb);
  cursor: pointer;
  font-family: inherit;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}
.compose-input:hover {
  border-color: rgba(20, 15, 80, 0.22);
  transform: translateY(-1px);
}
.compose-form { padding: 6px 12px 12px; }
.compose-form-footer {
  display: flex; justify-content: space-between; align-items: center;
  margin-top: var(--space-sm);
}
.compose-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 12px 6px 64px;
  border-top: 1px solid rgba(20, 15, 80, 0.06);
}
.compose-action {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px;
  color: var(--color-text-secondary);
  padding: 6px 10px;
  border-radius: 999px;
  cursor: pointer;
  background: #f6f7fb;
}
.compose-action:hover { background: var(--color-bg-secondary); color: var(--color-primary); }
.compose-action .material-symbols-outlined { font-size: 18px; }

/* Category filter chips */
.filter-row {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.chip {
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(20, 15, 80, 0.1);
  background: var(--color-white);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.chip:hover:not(.chip--active) { border-color: var(--color-primary); color: var(--color-primary); }
.chip--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 8px 16px rgba(20, 15, 80, 0.14);
}

/* Post cards */
.posts-list { display: flex; flex-direction: column; }
.post-card {
  cursor: default;
  padding: 18px;
}
.post-card--pinned { border-color: rgba(20, 15, 80, 0.14); }

.post-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.post-head {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}
.post-av {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(20,15,80,0.08); color: var(--color-primary);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; flex-shrink: 0;
}
.post-meta { flex: 1; min-width: 0; }
.post-name { font-size: 14px; font-weight: 600; color: var(--color-text-primary); display: flex; align-items: center; gap: 4px; }
.post-pin {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-primary);
  background: rgba(20, 15, 80, 0.06);
  border-radius: 999px;
  padding: 5px 10px;
}
.post-pin .material-symbols-outlined { font-size: 14px; }
.post-role-line { display: flex; align-items: center; gap: 6px; margin-top: 3px; }
.post-time { font-size: 11px; color: var(--color-text-light); }
.post-tag {
  font-size: 11px;
  padding: 5px 10px;
  border-radius: 999px;
  font-weight: 700;
  flex-shrink: 0;
  text-transform: capitalize;
}
.tag-career { background: #dbeafe; color: #1d4ed8; }
.tag-general { background: #f1f3f5; color: #495057; }
.tag-academic { background: #d1fae5; color: #065f46; }
.tag-social { background: #ede9fe; color: #5b21b6; }

.post-body { padding: 14px 0 12px; }
.post-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.35;
  cursor: pointer;
}

.post-actions {
  display: flex;
  padding-top: 10px;
  border-top: 1px solid rgba(20, 15, 80, 0.08);
  gap: 8px;
}
.post-action {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; font-weight: 500; color: var(--color-text-secondary);
  padding: 7px 12px; border-radius: 999px; cursor: pointer;
  background: none; border: none; font-family: inherit; transition: all 0.15s;
}
.post-action:hover { background: var(--color-bg-secondary); color: var(--color-primary); }
.post-action .material-symbols-outlined { font-size: 18px; }
.post-action--danger:hover { color: #c62828; background: rgba(198,40,40,0.06); }

/* Expanded thread */
.thread-expanded { border-top: 1px solid var(--color-border); }
.thread-body { padding: var(--space-md) 0; }
.thread-body p { font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; white-space: pre-wrap; }

.replies-section { padding: 0 0 var(--space-md); }
.reply-item { display: flex; gap: var(--space-sm); padding: var(--space-sm) 0; border-top: 1px solid var(--color-bg-secondary); }
.reply-content { flex: 1; min-width: 0; }
.reply-meta { display: flex; align-items: center; gap: var(--space-xs); margin-bottom: 2px; font-size: var(--font-size-xs); }
.reply-author { font-weight: 500; color: var(--color-text-secondary); }
.reply-time { color: var(--color-text-light); }
.reply-content p { font-size: var(--font-size-sm); color: var(--color-text-primary); line-height: 1.5; white-space: pre-wrap; }
.no-replies { text-align: center; padding: var(--space-md); font-size: var(--font-size-sm); color: var(--color-text-light); }

.reply-form { display: flex; gap: var(--space-sm); padding: var(--space-sm) 0 0; }
.reply-form .form-textarea { flex: 1; }

.side-card {
  padding: 20px;
}

.side-card h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.side-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.side-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
}

.side-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid rgba(20, 15, 80, 0.08);
  border-radius: 14px;
  background: #f7f8fc;
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s ease;
}

.side-link:hover {
  border-color: rgba(20, 15, 80, 0.18);
  transform: translateY(-1px);
}

.side-link .material-symbols-outlined {
  font-size: 18px;
  color: var(--color-primary);
}

.side-card--muted {
  background: linear-gradient(180deg, #fbfbfd, #f4f6fb);
}

.side-list {
  margin: 14px 0 0;
  padding-left: 18px;
  color: var(--color-text-secondary);
}

.side-list li {
  margin-bottom: 10px;
  line-height: 1.55;
}

/* ==================== PEOPLE TAB ==================== */
.people-toolbar-card { margin-bottom: 16px; }
.people-toolbar { padding: 12px 16px; }
.search-wrap { position: relative; }
.search-icon-abs {
  position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  color: var(--color-text-light); font-size: 20px;
}
.people-search {
  width: 100%; padding: 9px 14px 9px 36px;
  border: 1px solid var(--color-border); border-radius: 8px;
  font-size: 14px; background: var(--color-bg-secondary); font-family: inherit; outline: none;
}
.people-search:focus { border-color: var(--color-primary); }

.people-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.people-card {
  border: 1px solid var(--color-border); border-radius: 12px;
  overflow: hidden; background: var(--color-white); cursor: pointer;
  transition: box-shadow 0.15s; position: relative;
}
.people-card:hover { box-shadow: var(--shadow-md); }
.featured-badge {
  position: absolute; top: 8px; right: 8px;
  background: var(--color-accent); color: var(--color-primary);
  width: 22px; height: 22px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.featured-badge .material-symbols-outlined { font-size: 13px; }
.people-body { padding: 16px 14px 14px; text-align: center; }
.people-av {
  width: 52px; height: 52px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 18px; color: #fff;
  margin: 0 auto 8px;
  overflow: hidden;
}
.people-av img { width: 100%; height: 100%; object-fit: cover; }
.people-av--img { background: var(--color-bg-secondary); }
.people-name { font-size: 13px; font-weight: 600; color: var(--color-text-primary); }
.people-role { font-size: 11px; color: var(--color-text-secondary); margin-top: 2px; line-height: 1.4; }
.people-company { font-size: 11px; font-weight: 600; color: var(--color-primary); margin-top: 2px; }
.people-prog { font-size: 11px; color: var(--color-text-light); margin: 4px 0 10px; }

.connect-btn {
  width: 100%; padding: 6px; border-radius: 8px;
  font-size: 12px; font-weight: 600; cursor: pointer;
  border: 1.5px solid var(--color-primary); color: var(--color-primary);
  background: var(--color-white); transition: all 0.15s; font-family: inherit;
  display: flex; align-items: center; justify-content: center; gap: 4px;
}
.connect-btn:hover:not(:disabled) { background: var(--color-primary); color: white; }
.connect-btn--pending { border-color: var(--color-text-light); color: var(--color-text-light); cursor: default; }
.connect-btn--connected { background: var(--color-primary); color: white; cursor: default; }

/* ── Alumni Modal ── */
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
  border-radius: var(--border-radius-md); font-size: var(--font-size-sm); font-weight: 500;
  transition: background var(--transition-fast); text-decoration: none;
}
.linkedin-btn:hover { opacity: 0.9; }
.linkedin-btn .material-symbols-outlined { font-size: 18px; }

/* ==================== MESSAGES TAB ==================== */
.messages-layout {
  display: grid; grid-template-columns: 280px 1fr;
  min-height: 500px; overflow: hidden; margin-bottom: 0;
}
.conversations-panel { border-right: 1px solid var(--color-border); overflow-y: auto; }
.panel-title {
  padding: var(--space-md) var(--space-lg);
  font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
}
.conversation-item {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg); cursor: pointer;
  transition: background var(--transition-fast);
  border-bottom: 1px solid var(--color-bg-secondary);
}
.conversation-item:hover { background: var(--color-bg-secondary); }
.conversation-item--active { background: var(--color-bg-tertiary); }
.conv-info { flex: 1; min-width: 0; }
.conv-name { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.conv-preview { font-size: var(--font-size-xs); color: var(--color-text-light); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.conv-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
.conv-time { font-size: 10px; color: var(--color-text-light); }
.unread-badge {
  background: var(--color-secondary); color: white;
  font-size: 10px; font-weight: 700; min-width: 18px; height: 18px; padding: 0 4px;
  border-radius: var(--border-radius-full); display: flex; align-items: center; justify-content: center;
}

.chat-panel { display: flex; flex-direction: column; }
.chat-header {
  display: flex; align-items: center; gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg); border-bottom: 1px solid var(--color-border);
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
  padding: var(--space-md) var(--space-lg); border-top: 1px solid var(--color-border);
}
.chat-input .form-textarea { flex: 1; resize: none; }

/* ==================== NETWORK TAB ==================== */
.network-section { margin-bottom: var(--space-2xl); }
.request-list { display: flex; flex-direction: column; gap: var(--space-sm); }
.request-card {
  display: flex; align-items: center; gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
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
  font-size: var(--font-size-xs); font-weight: 500; cursor: pointer; font-family: inherit;
}
.btn-accept .material-symbols-outlined { font-size: 16px; }
.btn-reject {
  padding: var(--space-xs); background: none; border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md); color: var(--color-text-light); cursor: pointer;
}
.btn-reject:hover { border-color: #c62828; color: #c62828; }
.btn-reject .material-symbols-outlined { font-size: 18px; }

.connections-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-md); }
.connection-card { padding: 0; overflow: hidden; }
.conn-body { padding: 14px 12px 12px; text-align: center; }
.conn-av {
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 15px; color: #fff;
  margin: 0 auto 6px;
}
.connection-card h4 { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); }
.conn-role { font-size: var(--font-size-xs); color: var(--color-text-secondary); }
.conn-company { font-size: var(--font-size-xs); font-weight: 500; color: var(--color-primary); margin-bottom: var(--space-xs); }

/* ── Transitions ── */
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
.expand-enter-active, .expand-leave-active { transition: all 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal-content, .modal-leave-active .modal-content { transition: transform 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.95); }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .community-hero { grid-template-columns: 1fr; }
  .feed-layout { grid-template-columns: 1fr; }
  .people-grid { grid-template-columns: repeat(2, 1fr); }
  .connections-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .community-hub { padding: var(--space-md); }
  .community-hero { padding: 22px 18px; }
  .hub-shell { padding: 18px 16px; }
  .page-header { flex-direction: column; }
  .compose-box { grid-template-columns: 1fr; }
  .compose-footer { padding-left: 12px; }
  .tab-bar { overflow-x: auto; }
  .people-grid { grid-template-columns: repeat(2, 1fr); }
  .connections-grid { grid-template-columns: 1fr 1fr; }
  .messages-layout { grid-template-columns: 1fr; }
  .conversations-panel { max-height: 250px; }
  .filter-row { overflow-x: auto; flex-wrap: nowrap; }
}
</style>
