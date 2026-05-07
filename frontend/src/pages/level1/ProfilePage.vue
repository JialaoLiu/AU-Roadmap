<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { uploadAvatar } from '@/api/auth';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();
const uploading = ref(false);
const avatarPreview = ref(authStore.user?.avatar_url || null);
const fileInput = ref(null);
const selectedFile = ref(null);

const profileDetails = computed(() => [
  {
    label: 'Full Name',
    value: `${authStore.user?.first_name || ''} ${authStore.user?.last_name || ''}`.trim() || '-',
    icon: 'badge',
  },
  {
    label: 'University Email',
    value: authStore.user?.email || '-',
    icon: 'mail',
  },
  {
    label: 'Student ID',
    value: authStore.user?.student_id || '-',
    icon: 'id_card',
  },
  {
    label: 'Account Type',
    value: authStore.user?.role ? authStore.user.role.charAt(0).toUpperCase() + authStore.user.role.slice(1) : '-',
    icon: 'school',
  },
]);

function getInitials() {
  const f = authStore.user?.first_name?.[0] || '';
  const l = authStore.user?.last_name?.[0] || '';
  return (f + l).toUpperCase();
}

function onFileChange(e) {
  const file = e.target.files[0];
  selectedFile.value = file || null;
  if (!file) return;
  avatarPreview.value = URL.createObjectURL(file);
}

async function handleAvatarUpload() {
  const file = selectedFile.value;
  if (!file) return;

  uploading.value = true;
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await uploadAvatar(formData);
    authStore.user = { ...authStore.user, avatar_url: res.data.data.avatar_url };
    toast.success('Avatar updated');
  } catch (err) {
    toast.error(err.response?.data?.error?.message || 'Failed to upload avatar');
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div class="profile-page">
    <div class="page-header">
      <div class="page-header__left">
        <span class="material-symbols-outlined page-icon">account_circle</span>
        <div>
          <h1>My Profile</h1>
          <p class="page-subtitle">View your university account information and manage your profile photo</p>
        </div>
      </div>
    </div>

    <div class="profile-layout">
      <div class="avatar-card">
        <div class="avatar-display">
          <img v-if="avatarPreview" :src="avatarPreview" class="avatar-img" alt="Avatar" />
          <div v-else class="avatar-initials">{{ getInitials() }}</div>
        </div>

        <p class="avatar-name">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
        <p class="avatar-role">{{ authStore.user?.role }}</p>
        <p v-if="authStore.user?.student_id" class="avatar-id">ID: {{ authStore.user.student_id }}</p>

        <div class="avatar-upload">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="file-input-hidden"
            @change="onFileChange"
          />
          <button class="btn btn-secondary btn-sm" @click="fileInput.click()">
            <span class="material-symbols-outlined">upload</span>
            Choose Photo
          </button>
          <button
            v-if="selectedFile"
            class="btn btn-primary btn-sm"
            :disabled="uploading"
            @click="handleAvatarUpload"
          >
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </button>
        </div>
        <p class="avatar-hint">JPG, PNG, GIF or WebP · Max 5MB</p>
      </div>

      <div class="details-column">
        <div class="info-card">
          <h2 class="section-title">University Account</h2>
          <div class="details-grid">
            <div v-for="item in profileDetails" :key="item.label" class="detail-card">
              <div class="detail-icon">
                <span class="material-symbols-outlined">{{ item.icon }}</span>
              </div>
              <div>
                <p class="detail-label">{{ item.label }}</p>
                <p class="detail-value">{{ item.value }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="info-card info-card--muted">
          <h2 class="section-title">About This Profile</h2>
          <div class="info-list">
            <p>If any of this information is incorrect, please contact your administrator or student services.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  padding: var(--space-lg);
}

.page-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: var(--space-xl);
}

.page-header__left {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.page-icon {
  font-size: 32px;
  color: var(--color-primary);
}

.page-header h1 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: var(--space-xl);
  align-items: start;
}

.avatar-card,
.info-card {
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-xl);
  padding: var(--space-xl);
}

.avatar-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-sm);
}

.avatar-display {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-border);
  margin-bottom: var(--space-xs);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  width: 100%;
  height: 100%;
  background: var(--color-primary);
  color: var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-2xl);
  font-weight: 700;
}

.avatar-name {
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
}

.avatar-role {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.avatar-id {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.avatar-upload {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
  justify-content: center;
  margin-top: var(--space-sm);
}

.file-input-hidden {
  display: none;
}

.btn-sm {
  padding: 6px 12px;
  font-size: var(--font-size-xs);
  gap: 4px;
}

.btn-sm .material-symbols-outlined {
  font-size: 16px;
}

.avatar-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-light);
}

.details-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.detail-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: linear-gradient(180deg, #fbfbfd, #f5f7fb);
  border: 1px solid rgba(20, 15, 80, 0.08);
}

.detail-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 15, 80, 0.08);
  color: var(--color-primary);
  flex-shrink: 0;
}

.detail-icon .material-symbols-outlined {
  font-size: 22px;
}

.detail-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-light);
}

.detail-value {
  margin-top: 5px;
  font-size: var(--font-size-md);
  font-weight: 600;
  color: var(--color-text-primary);
  word-break: break-word;
}

.info-card--muted {
  background: linear-gradient(180deg, #fbfbfd, #f5f7fb);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
