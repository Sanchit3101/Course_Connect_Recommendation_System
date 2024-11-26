const express = require("express");
const { getAllCourses, addCourse,getCourseById } = require("../controllers/course");
const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/add-course").post(addCourse);
router.route("/:id").get(getCourseById);
module.exports = router;