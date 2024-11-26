import React, { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../../Course_Card/CourseCard";
import SkeletonCard from "../../Course_Card/SkeletonCard";
import "./ForYou.css"; // Assuming you have a CSS file for styling

const ForYou = ({ courseId }) => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecommendedCourses = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await axios.get("http://localhost:5000/api/recommendations", {
          params: { courseId, topN: 10 }, // topN can be adjusted as needed
        });
        const dataWithDefaults = response.data.map(course => ({
          ...course,
          description: course.description || "", // Ensure description is defined
        }));
        setRecommendedCourses(dataWithDefaults);
        console.log("Fetched recommendations:", dataWithDefaults);
      } catch (err) {
        console.error("Error fetching recommended courses:", err);
        setError("Unable to fetch recommendations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchRecommendedCourses();
    } else {
      setError("No course ID provided.");
      setLoading(false);
    }
  }, [courseId]);

  if (loading) return <SkeletonCard />;
  if (error) return <div>{error}</div>;

  return (
    <div className="for-you-container">
      {recommendedCourses.map(course => (
        <CourseCard key={course.ID} data={course} />
      ))}
    </div>
  );
};

export default ForYou;