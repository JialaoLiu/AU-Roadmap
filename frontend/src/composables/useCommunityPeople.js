import { ref } from 'vue';
import {
  getAlumniProfile,
  getAlumniProfiles,
  sendConnectionRequest,
} from '@/api/community';

export function useCommunityPeople() {
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

  async function viewProfile(alumniUser) {
    try {
      const res = await getAlumniProfile(alumniUser.id);
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

  function closeProfile() {
    selectedAlumni.value = null;
  }

  return {
    alumni,
    alumniLoading,
    searchQuery,
    selectedAlumni,
    fetchAlumni,
    viewProfile,
    handleConnect,
    closeProfile,
  };
}
