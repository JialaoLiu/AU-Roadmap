const { getStats } = require('./admin/statsController');
const { createProgram, updateProgram, deleteProgram } = require('./admin/programController');
const {
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseToProgram,
  removeCourseFromProgram,
  addPrerequisite,
  removePrerequisite,
} = require('./admin/coursesController');
const { listAlumni, createAlumni, updateAlumni, deleteAlumni } = require('./admin/alumniController');
const {
  listIndustryPartners,
  createIndustryPartner,
  updateIndustryPartner,
  deleteIndustryPartner,
} = require('./admin/industryController');
const {
  createCareerOutcome,
  updateCareerOutcome,
  deleteCareerOutcome,
  createCareerPath,
  updateCareerPath,
  deleteCareerPath,
} = require('./admin/careersController');
const { listUsers, changeUserRole, deleteUser } = require('./admin/usersController');

module.exports = {
  getStats,
  createProgram, updateProgram, deleteProgram,
  listCourses, createCourse, updateCourse, deleteCourse,
  addCourseToProgram, removeCourseFromProgram,
  addPrerequisite, removePrerequisite,
  listAlumni, createAlumni, updateAlumni, deleteAlumni,
  listIndustryPartners, createIndustryPartner, updateIndustryPartner, deleteIndustryPartner,
  createCareerOutcome, updateCareerOutcome, deleteCareerOutcome,
  createCareerPath, updateCareerPath, deleteCareerPath,
  listUsers, changeUserRole, deleteUser,
};
