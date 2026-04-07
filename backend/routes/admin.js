const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const admin = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(roleGuard('admin'));

// Stats
router.get('/stats', admin.getStats);

// Programs
router.post('/programs', admin.createProgram);
router.put('/programs/:id', admin.updateProgram);
router.delete('/programs/:id', admin.deleteProgram);

// Courses
router.get('/courses', admin.listCourses);
router.post('/courses', admin.createCourse);
router.put('/courses/:id', admin.updateCourse);
router.delete('/courses/:id', admin.deleteCourse);

// Program-Course Mapping
router.post('/programs/:programId/courses', admin.addCourseToProgram);
router.delete('/programs/:programId/courses/:courseId', admin.removeCourseFromProgram);

// Prerequisites
router.post('/prerequisites', admin.addPrerequisite);
router.delete('/prerequisites/:courseId/:prereqId', admin.removePrerequisite);

// Alumni
router.get('/alumni', admin.listAlumni);
router.post('/alumni', admin.createAlumni);
router.put('/alumni/:id', admin.updateAlumni);
router.delete('/alumni/:id', admin.deleteAlumni);

// Industry Partners
router.get('/industry', admin.listIndustryPartners);
router.post('/industry', admin.createIndustryPartner);
router.put('/industry/:id', admin.updateIndustryPartner);
router.delete('/industry/:id', admin.deleteIndustryPartner);

// Career Outcomes
router.post('/careers/outcomes', admin.createCareerOutcome);
router.put('/careers/outcomes/:id', admin.updateCareerOutcome);
router.delete('/careers/outcomes/:id', admin.deleteCareerOutcome);

// Career Paths
router.post('/careers/paths', admin.createCareerPath);
router.put('/careers/paths/:id', admin.updateCareerPath);
router.delete('/careers/paths/:id', admin.deleteCareerPath);

// Users
router.get('/users', admin.listUsers);
router.put('/users/:id/role', admin.changeUserRole);
router.delete('/users/:id', admin.deleteUser);

module.exports = router;
