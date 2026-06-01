import { ref, watch } from 'vue';
import {
  createReply,
  createThread,
  deleteReply,
  deleteThread,
  getAllThreads,
  getThread,
  uploadPostImage,
} from '@/api/community';

export function useCommunityFeed() {
  const threads = ref([]);
  const threadsLoading = ref(true);
  const activeThreadId = ref(null);
  const activeThreadData = ref(null);
  const threadLoading = ref(false);
  const showNewThread = ref(false);
  const newTitle = ref('');
  const newContent = ref('');
  const newCategory = ref('general');
  const imageFile = ref(null);
  const imagePreview = ref('');
  const imageInput = ref(null);
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
      let imageUrl = null;
      const localPreviewUrl = imagePreview.value;

      if (imageFile.value) {
        const formData = new FormData();
        formData.append('image', imageFile.value);
        const uploadRes = await uploadPostImage(formData);
        imageUrl = uploadRes.data.data.image_url;
      }

      const createRes = await createThread({
        title: newTitle.value,
        content: newContent.value,
        category: newCategory.value,
        image_url: imageUrl,
      });

      const createdThread = createRes.data.data;
      if (localPreviewUrl) {
        createdThread.image_url = localPreviewUrl;
      }

      if (feedCategory.value === 'all' || feedCategory.value === createdThread.category) {
        threads.value.unshift(createdThread);
      }

      newTitle.value = '';
      newContent.value = '';
      newCategory.value = 'general';
      clearThreadImage({ revokePreview: !localPreviewUrl });
      showNewThread.value = false;
    } catch (err) {
      console.error(err);
    } finally {
      posting.value = false;
    }
  }

  function handleThreadImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      clearThreadImage();
      return;
    }

    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }

  function clearThreadImage(options = {}) {
    const { revokePreview = true } = options;
    imageFile.value = null;
    if (revokePreview && imagePreview.value) {
      URL.revokeObjectURL(imagePreview.value);
    }
    imagePreview.value = '';
    if (imageInput.value) {
      imageInput.value.value = '';
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
      const t = threads.value.find((thread) => thread.id === activeThreadId.value);
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
      const t = threads.value.find((thread) => thread.id === activeThreadId.value);
      if (t) t.reply_count = activeThreadData.value.replies.length;
    } catch (err) {
      console.error(err);
    }
  }

  watch(feedCategory, fetchThreads);

  return {
    threads,
    threadsLoading,
    activeThreadId,
    activeThreadData,
    threadLoading,
    showNewThread,
    newTitle,
    newContent,
    newCategory,
    imageFile,
    imagePreview,
    imageInput,
    replyContent,
    posting,
    feedCategory,
    categories,
    fetchThreads,
    openThread,
    submitThread,
    handleThreadImageChange,
    clearThreadImage,
    submitReply,
    handleDeleteThread,
    handleDeleteReply,
  };
}
