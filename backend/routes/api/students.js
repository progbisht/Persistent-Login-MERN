const express = require('express');
const router = express.Router();
const studentsController = require('../../controllers/studentsController');
const rolesList = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');


// for performing CRUD operation on students database
router.route('/').get(studentsController.getStudents)
        .post(verifyRoles(rolesList.Admin, rolesList.Editor), studentsController.createStudent)
        .put(verifyRoles(rolesList.Admin, rolesList.Editor),studentsController.updateStudent)
        .delete(verifyRoles(rolesList.Admin),studentsController.deleteStudent);
        
router.route('/:id').get(studentsController.getStudent);

module.exports = router;