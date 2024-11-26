import React, { useState, useEffect } from "react";
import "./comparetable.css";
import Navbar from "../../Homeeg/NavbarEg";
import { useCompareContext } from "../../../custom_hooks/CompareContext";
import Downnav from "../Explore/Downnav";
import axios from "axios";

const CompareTable = () => {
  const { compareData } = useCompareContext();
  const courseIds = [...compareData];
  console.log("Current compareData in CompareTable:", compareData);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesData = await Promise.all(
          courseIds.map((courseId) =>
            axios
              .get(`http://localhost:5000/api/courses/${courseId}`)
              .then((response) => response.data)
          )
        );
        setCourses(coursesData);
      } catch (error) {
        console.log("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseIds.length > 0) {
      fetchCourses();
    }
  }, [JSON.stringify(courseIds)]);

  return (
    <div className="compare-table-wrapper">
      <Navbar />
      <h1>Compare and Choose</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="compare-table-container">
          {courses.map((course, index) => (
            <div key={index}>
              <h2>{course.title}</h2>
              <p>Platform: {course.platform}</p>
              <p>Level: {course.level}</p>
              <p>Ratings: {course.ratings}</p>
              <p>Duration: {course.duration}</p>
              <p>Students Enrolled: {course.students_count}</p>
              <p>Instructor: {course.instructor}</p>
              <p>Domain: {course.domain}</p>
              <p>Certification Type: {course.course_certification_type}</p>
              <p>Paid: {course.paid}</p>
              <p>Prerequisites: {course.Prerequisites}</p>
              <p>Skills: {course.skills}</p>
              {/* Add more course details as needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompareTable;
