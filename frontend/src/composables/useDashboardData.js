import { ref } from 'vue';
import {
  getProgramDetail,
  getProgramRoadmap,
} from '@/api/programs';

export function useDashboardData(authStore) {
  const loading = ref(true);
  const program = ref(null);
  const roadmapSummary = ref(null);

  async function fetchDashboardData() {
    const programId = authStore.user?.program_id;
    if (!programId) {
      loading.value = false;
      return;
    }

    try {
      const [programRes, roadmapRes] = await Promise.all([
        getProgramDetail(programId),
        getProgramRoadmap(programId),
      ]);
      program.value = programRes.data.data;
      roadmapSummary.value = roadmapRes.data.data;
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    program,
    roadmapSummary,
    fetchDashboardData,
  };
}
