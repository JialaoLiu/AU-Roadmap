import { ref } from 'vue';
import {
  getProgramAlumni,
  getProgramCareers,
  getProgramCourses,
  getProgramDetail,
} from '@/api/programs';

export function useProgramPreviewData(route) {
  const loading = ref(true);
  const program = ref(null);
  const courses = ref([]);
  const alumni = ref([]);
  const careers = ref({ outcomes: [], paths: [] });

  async function fetchProgramPreviewData() {
    try {
      const id = route.params.id;
      const [progRes, coursesRes, alumniRes, careersRes] = await Promise.all([
        getProgramDetail(id),
        getProgramCourses(id),
        getProgramAlumni(id),
        getProgramCareers(id),
      ]);
      program.value = progRes.data.data;
      courses.value = coursesRes.data.data;
      alumni.value = alumniRes.data.data;
      careers.value = careersRes.data.data;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    program,
    courses,
    alumni,
    careers,
    fetchProgramPreviewData,
  };
}
