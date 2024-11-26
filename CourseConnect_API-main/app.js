const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const graphlib = require("graphlib");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const ConnectToDatabase = require("./db/connect");
const Course_Router = require("./routes/course");
const Course = require("./models/course");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Hi I am Sanchit Sen");
});

app.use("/api/courses", Course_Router);

// Create the graph
const graph = new graphlib.Graph();

// Fetch courses from the database and add them to the graph
const fetchCoursesAndBuildGraph = async () => {
    try {
        const courses = await Course.find();
        courses.forEach((course) => {
            graph.setNode(String(course.ID), course);
        });

        // Calculate similarity and add edges
        courses.forEach((course1) => {
            courses.forEach((course2) => {
                if (course1.ID !== course2.ID) {
                    const similarity = calculateSimilarity(course1, course2);
                    if (similarity > 0) {
                        graph.setEdge(String(course1.ID), String(course2.ID), similarity);
                    }
                }
            });
        });

        console.log("Graph nodes:", graph.nodes());
        console.log("Graph edges:", graph.edges());
    } catch (error) {
        console.error("Error fetching courses:", error);
    }
};

// Similarity calculation function
const calculateSimilarity = (course1, course2) => {
    let similarity = 0;

    // Similarity based on domain
    if (course1.domain === course2.domain) {
        similarity += 0.5;
    }

    // Similarity based on skills
    if (Array.isArray(course1.skills) && Array.isArray(course2.skills)) {
        const commonSkills = course1.skills.filter((skill) =>
            course2.skills.includes(skill)
        );
        similarity +=
            (commonSkills.length / Math.max(course1.skills.length, course2.skills.length)) * 0.5;
    }

    return similarity;
};

// API to get recommended courses for a specific courseId
app.get("/api/recommendations", (req, res) => {
    const { courseId, topN = 10 } = req.query;

    // Validate courseId
    if (!courseId || !graph.hasNode(String(courseId))) {
        return res.status(404).json({ error: "Course ID not found" });
    }

    const currentCourseId = String(courseId);

    // Get successors (connected nodes) of the current course
    const successors = graph.successors(currentCourseId);

    if (!successors || successors.length === 0) {
        return res
            .status(200)
            .json({ message: "No similar courses found for this course ID." });
    }

    // Sort successors by edge weight (similarity)
    const recommendations = successors
        .map((id) => {
            const course = graph.node(id);

            // Remove Mongoose-specific metadata fields
            const cleanCourse = {
                ...course._doc, // Extracts the actual document data
                similarity: graph.edge(currentCourseId, id), // Add similarity score
            };

            // Remove unnecessary fields from the course data
            delete cleanCourse.$__;
            delete cleanCourse.$isNew;
            delete cleanCourse.$errors;
            delete cleanCourse.validationError;

            return cleanCourse;
        })
        .sort(() => Math.random() - 0.5)
        .slice(0, topN); // Limit to top N recommendations

    // Send sanitized response
    res.status(200).json(recommendations);
});


// Fetch courses and build the graph on server start
fetchCoursesAndBuildGraph();

const start = async () => {
    try {
        ConnectToDatabase(process.env.MONGODB_URL);
        app.listen(PORT, () => {
            console.log(`Server is Started on PORT ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();