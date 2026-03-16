<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getThreads, getThread, createThread, createReply, deleteThread, deleteReply } from '@/api/discussions';

const authStore = useAuthStore();

const threads = ref([]);
const threadsLoading = ref(true);
const activeThread = ref(null);
const activeThreadData = ref(null);
const threadLoading = ref(false);
const showNewThread = ref(false);
const newTitle = ref('');
const newContent = ref('');
const replyContent = ref('');
const posting = ref(false);

const programId = computed(() => authStore.user?.program_id);

async function fetchThreads() {
  if (!programId.value) { threadsLoading.value = false; return; }
  threadsLoading.value = true;
  try {
    const res = await getThreads(programId.value);
    threads.value = res.data.data;
  } catch (err) {
    console.error(err);
  } finally {
    threadsLoading.value = false;
  }
}

async function openThread(thread) {
  if (activeThread.value === thread.id) {
    activeThread.value = null;
    activeThreadData.value = null;
    return;
  }
  activeThread.value = thread.id;
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
    await createThread(programId.value, { title: newTitle.value, content: newContent.value });
    newTitle.value = '';
    newContent.value = '';
    showNewThread.value = false;
    await fetchThreads();
  } catch (err) {
    console.error(err);
  } finally {
    posting.value = false;
  }
}

async function submitReply() {
  if (!replyContent.value.trim() || !activeThread.value) return;
  posting.value = true;
  try {
    await createReply(activeThread.value, { content: replyContent.value });
    replyContent.value = '';
    const res = await getThread(activeThread.value);
    activeThreadData.value = res.data.data;
    const t = threads.value.find(t => t.id === activeThread.value);
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
    activeThread.value = null;
    activeThreadData.value = null;
    await fetchThreads();
  } catch (err) {
    console.error(err);
  }
}

async function handleDeleteReply(replyId) {
  try {
    await deleteReply(replyId);
    const res = await getThread(activeThread.value);
    activeThreadData.value = res.data.data;
    const t = threads.value.find(t => t.id === activeThread.value);
    if (t) t.reply_count = activeThreadData.value.replies.length;
  } catch (err) {
    console.error(err);
  }
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
  return role;
}

function canDelete(item) {
  return authStore.user?.id === item.user_id || authStore.isAdmin;
}

onMounted(fetchThreads);
</script>

<template>
  <div class="discussion-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">forum</span>
        <div>
          <h1>Discussion</h1>
          <p class="page-subtitle">Connect with fellow students and alumni</p>
        </div>
      </div>
      <button v-if="authStore.isAuthenticated" class="btn-new-thread" @click="showNewThread = !showNewThread">
        <span class="material-symbols-outlined">{{ showNewThread ? 'close' : 'add' }}</span>
        {{ showNewThread ? 'Cancel' : 'New Post' }}
      </button>
    </div>

    <!-- New Thread Form -->
    <Transition name="slide">
      <div v-if="showNewThread" class="new-thread-form">
        <input v-model="newTitle" type="text" placeholder="Post title..." class="thread-input" maxlength="200" />
        <textarea v-model="newContent" placeholder="What would you like to discuss?" class="thread-textarea" rows="3"></textarea>
        <div class="form-actions">
          <button class="btn-submit" :disabled="!newTitle.trim() || !newContent.trim() || posting" @click="submitThread">
            <span class="material-symbols-outlined">send</span>
            {{ posting ? 'Posting...' : 'Post' }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="threadsLoading" class="loading-state"><div class="loading-spinner"></div></div>

    <!-- Threads List -->
    <div v-else-if="threads.length" class="threads-list">
      <div v-for="t in threads" :key="t.id" class="thread-item" :class="{ 'thread-item--active': activeThread === t.id, 'thread-item--pinned': t.is_pinned }">
        <div class="thread-header" @click="openThread(t)">
          <div class="thread-author-avatar">
            {{ (t.first_name?.[0] || '') + (t.last_name?.[0] || '') }}
          </div>
          <div class="thread-main">
            <div class="thread-title-row">
              <span v-if="t.is_pinned" class="material-symbols-outlined pin-icon">push_pin</span>
              <h3>{{ t.title }}</h3>
            </div>
            <div class="thread-meta">
              <span class="thread-author">{{ t.first_name }} {{ t.last_name }}</span>
              <span class="role-tag" :class="'role--' + t.user_role">{{ roleLabel(t.user_role) }}</span>
              <span class="thread-time">{{ timeAgo(t.created_at) }}</span>
            </div>
          </div>
          <div class="thread-stats">
            <span class="material-symbols-outlined">chat_bubble_outline</span>
            <span>{{ t.reply_count }}</span>
          </div>
        </div>

        <!-- Expanded Thread -->
        <Transition name="expand">
          <div v-if="activeThread === t.id" class="thread-expanded">
            <div v-if="threadLoading" class="loading-state" style="padding: var(--space-md);"><div class="loading-spinner"></div></div>
            <template v-else-if="activeThreadData">
              <div class="thread-body">
                <p>{{ activeThreadData.thread.content }}</p>
                <button v-if="canDelete(activeThreadData.thread)" class="btn-delete" @click.stop="handleDeleteThread(t.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>

              <!-- Replies -->
              <div class="replies-section">
                <div v-for="r in activeThreadData.replies" :key="r.id" class="reply-item">
                  <div class="reply-avatar">
                    {{ (r.first_name?.[0] || '') + (r.last_name?.[0] || '') }}
                  </div>
                  <div class="reply-content">
                    <div class="reply-meta">
                      <span class="reply-author">{{ r.first_name }} {{ r.last_name }}</span>
                      <span class="role-tag" :class="'role--' + r.user_role">{{ roleLabel(r.user_role) }}</span>
                      <span class="reply-time">{{ timeAgo(r.created_at) }}</span>
                      <button v-if="canDelete(r)" class="btn-delete-sm" @click="handleDeleteReply(r.id)">
                        <span class="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                    <p>{{ r.content }}</p>
                  </div>
                </div>

                <div v-if="!activeThreadData.replies.length" class="no-replies">
                  No replies yet. Be the first to respond!
                </div>
              </div>

              <!-- Reply Form -->
              <div v-if="authStore.isAuthenticated" class="reply-form">
                <textarea v-model="replyContent" placeholder="Write a reply..." class="reply-textarea" rows="2"></textarea>
                <button class="btn-reply" :disabled="!replyContent.trim() || posting" @click="submitReply">
                  <span class="material-symbols-outlined">send</span>
                </button>
              </div>
            </template>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <span class="material-symbols-outlined empty-icon">forum</span>
      <h2>No Discussions Yet</h2>
      <p>Start a conversation with your fellow students and alumni!</p>
    </div>
  </div>
</template>

<style scoped>
.discussion-page { padding: var(--space-lg); }

.page-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: var(--space-xl);
}
.page-header__left { display: flex; align-items: center; gap: var(--space-md); }
.page-icon { font-size: 32px; color: var(--color-primary); }
.page-header h1 { font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text-primary); }
.page-subtitle { font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: 2px; }

.btn-new-thread {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary); color: var(--color-white);
  border: none; border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 500;
  cursor: pointer; transition: background var(--transition-fast);
}
.btn-new-thread:hover { opacity: 0.9; }
.btn-new-thread .material-symbols-outlined { font-size: 18px; }

/* New Thread Form */
.new-thread-form {
  background: var(--color-white); border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg); padding: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.thread-input {
  width: 100%; padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
  font-size: var(--font-size-md); font-weight: 600;
  margin-bottom: var(--space-sm); outline: none;
}
.thread-input:focus { border-color: var(--color-primary); }

.thread-textarea, .reply-textarea {
  width: 100%; padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--color-border); border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-family: inherit;
  resize: vertical; outline: none;
}
.thread-textarea:focus, .reply-textarea:focus { border-color: var(--color-primary); }

.form-actions { display: flex; justify-content: flex-end; margin-top: var(--space-sm); }

.btn-submit {
  display: inline-flex; align-items: center; gap: var(--space-xs);
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-primary); color: var(--color-white);
  border: none; border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm); font-weight: 500;
  cursor: pointer;
}
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-submit .material-symbols-outlined { font-size: 16px; }

/* Threads List */
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
  padding: var(--space-md) var(--space-lg);
  cursor: pointer;
}

.thread-author-avatar {
  width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(20, 15, 80, 0.08); color: var(--color-primary);
  font-size: var(--font-size-xs); font-weight: 700;
}

.thread-main { flex: 1; min-width: 0; }
.thread-title-row { display: flex; align-items: center; gap: var(--space-xs); }
.pin-icon { font-size: 16px; color: var(--color-primary); }
.thread-main h3 {
  font-size: var(--font-size-sm); font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.thread-meta {
  display: flex; align-items: center; gap: var(--space-sm);
  margin-top: 2px; font-size: var(--font-size-xs);
}
.thread-author { font-weight: 500; color: var(--color-text-secondary); }
.thread-time { color: var(--color-text-light); }

.role-tag {
  padding: 1px 8px; border-radius: var(--border-radius-full);
  font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px;
}
.role--student { background: rgba(20, 15, 80, 0.08); color: var(--color-primary); }
.role--admin { background: rgba(198, 40, 40, 0.08); color: #c62828; }
.role--alumni { background: rgba(46, 125, 50, 0.08); color: #2e7d32; }
.role--prospective { background: rgba(245, 124, 0, 0.08); color: #f57c00; }

.thread-stats {
  display: flex; align-items: center; gap: 4px;
  font-size: var(--font-size-xs); color: var(--color-text-light);
}
.thread-stats .material-symbols-outlined { font-size: 18px; }

/* Expanded Thread */
.thread-expanded { border-top: 1px solid var(--color-border); }

.thread-body {
  padding: var(--space-md) var(--space-lg);
  position: relative;
}
.thread-body p {
  font-size: var(--font-size-sm); color: var(--color-text-secondary);
  line-height: 1.6; white-space: pre-wrap;
}

.btn-delete, .btn-delete-sm {
  background: none; border: none; cursor: pointer;
  color: var(--color-text-light); padding: 4px;
  border-radius: var(--border-radius-sm);
}
.btn-delete:hover, .btn-delete-sm:hover { color: #c62828; background: rgba(198,40,40,0.06); }
.btn-delete { position: absolute; top: var(--space-sm); right: var(--space-md); }
.btn-delete .material-symbols-outlined { font-size: 20px; }
.btn-delete-sm { margin-left: auto; }
.btn-delete-sm .material-symbols-outlined { font-size: 16px; }

/* Replies */
.replies-section { padding: 0 var(--space-lg) var(--space-md); }

.reply-item {
  display: flex; gap: var(--space-sm);
  padding: var(--space-sm) 0;
  border-top: 1px solid var(--color-bg-secondary);
}

.reply-avatar {
  width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(20, 15, 80, 0.06); color: var(--color-primary);
  font-size: 10px; font-weight: 700;
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

/* Reply Form */
.reply-form {
  display: flex; gap: var(--space-sm);
  padding: var(--space-sm) var(--space-lg) var(--space-lg);
}
.reply-form .reply-textarea { flex: 1; }

.btn-reply {
  align-self: flex-end;
  padding: var(--space-sm); background: var(--color-primary);
  color: var(--color-white); border: none; border-radius: var(--border-radius-md);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.btn-reply:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-reply .material-symbols-outlined { font-size: 20px; }

/* Empty / Loading */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: var(--space-3xl); text-align: center; }
.empty-icon { font-size: 48px; color: var(--color-text-light); margin-bottom: var(--space-md); }
.empty-state h2 { color: var(--color-text-primary); margin-bottom: var(--space-sm); }
.empty-state p { color: var(--color-text-secondary); }

.loading-state { display: flex; justify-content: center; padding: var(--space-3xl); }
.loading-spinner {
  width: 40px; height: 40px; border: 3px solid var(--color-border);
  border-top-color: var(--color-primary); border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
.expand-enter-active, .expand-leave-active { transition: all 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: var(--space-sm); }
}
</style>
