const express = require('express');
const router = express.Router();
const {
  listPrograms,
  getProgramDetail,
  getProgramCourses,
  getProgramRoadmap,
  getProgramAlumni,
  getProgramIndustry,
  getProgramCareers,
  getProgramResources,
} = require('../controllers/programController');

router.get('/', listPrograms);
router.get('/:id', getProgramDetail);
router.get('/:id/courses', getProgramCourses);
router.get('/:id/roadmap', getProgramRoadmap);
router.get('/:id/alumni', getProgramAlumni);
router.get('/:id/industry', getProgramIndustry);
router.get('/:id/careers', getProgramCareers);
router.get('/:id/resources', getProgramResources);

module.exports = router;
