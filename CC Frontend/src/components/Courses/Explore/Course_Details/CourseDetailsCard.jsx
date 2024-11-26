import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import Lottie from "lottie-react";
import loading2 from '../../../../Animation3.json';
import NavbarEg from "../../../Homeeg/NavbarEg";
import compare from '../../Course_Card/compare.png';
import { useCompareContext } from "../../../../custom_hooks/CompareContext";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./course_details.css";
import Rating from "@mui/material/Rating";
import ForYou from './ForYou';

const CourseDetailsCard = () => {
  useEffect(() => {
    AOS.init();
  }, []);

  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true); 
  const { courseId } = useParams();

  const { setCompareData } = useCompareContext();

  const handleCompare = () => {
    setCompareData((prev) => [...prev, courseId].slice(-2));
    console.log("clicked");
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/courses/${courseId}`)
      .then((response) => {
        setCourse(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
        setLoading(false);
      });
  }, [courseId]);

  const description = course.description || "";
  const [desc, setDesc] = useState(description.substring(0, 200));
  const [readMore, setReadMore] = useState(true);

  const handleClick = () => {
    if (!readMore) {
      setDesc(description.substring(0, 200));
      setReadMore(!readMore);
    } else {
      setDesc(description);
      setReadMore(!readMore);
    }
  };

  const domain = course.domain;
  const platform = course.platform;
  const platform_img = course.images;

  return (
    <div className="card-details-wrapper">
      <div className="card-details-navbar">
        <NavbarEg />
      </div>

      <div className="card-details-container">
        {loading ? (
          <Lottie animationData={loading2} />
        ) : (
          <div className="card-square">
            <div className="card-square-left">
              <div className="left-logo-name">
                <a href={course.urls} target="_blank" data-aos='fade' data-aos-duration="1000">{platform}</a>
              </div>
              <div className="left-logo" data-aos='fade' data-aos-duration="1000">
                <img src={platform_img} alt=".." />
              </div>
              <div className="left-img">
                <a href="#">
                  <img src={course.images} alt=".." data-aos='fade-up' data-aos-duration="1000" />
                </a>
              </div>
              <div className="left-btn">
                <a className="course_url" href={course.urls} target="_blank">
                  <button className="button-55" role="button">
                    Go to Course
                  </button>
                </a>
                <div className="compare-img-coursecard details-compare" onClick={handleCompare}>
                  <img src={compare} alt="Compare" />
                </div>
              </div>
            </div>
            <div className="card-square-right">
              <div className="card-right-title">
                <a href={course.urls}>
                  <h1 data-aos='fade-left' data-aos-duration="1000">{course.title}</h1>
                </a>
              </div>

              <div className="card-right-desc" onClick={handleClick}>
                {readMore ? desc : description}
                <span onClick={handleClick}>
                  {readMore ? " Read more ..." : " Read less"}
                </span>
              </div>

              <div className="card-right-numbers">
                <div id="right-ratings" className="card-right-flex">
                  <span className="right-span">
                    <Rating
                      name="half-rating-read"
                      defaultValue={parseFloat(course.ratings)}
                      precision={0.1}
                      size="large"
                      readOnly
                    />
                    <p>{course.ratings} out of 5</p>
                  </span>
                  <span id="reviews-count" className="right-span" style={{ height: "fit-content" }}>
                    Number of Reviews : {course.reviews_count}
                  </span>
                </div>

                <div id="level-students" className="card-right-flex">
                  <span className="right-span">Difficulty Level : {course.level}</span>
                  <span className="right-span">
                    No of Enrolled Students : {course.students_count}
                  </span>
                </div>

                <div id="duration-lecturesCount" className="card-right-flex">
                  <span className="right-span">
                    Duration of Course : {course.duration}
                  </span>

                  <span className="right-span">
                    {course.lectures_count !== "Image Not Found" && (
                      <div className="details-card-domain common_shadow">
                        No of Lectures: {course.lectures_count}
                      </div>
                    )}
                  </span>
                </div>

                <div id="domain-certificationType" className="card-right-flex">
                  <span className="right-span">
                    {course.domain !== "Not Available" && (
                      <div className="details-card-domain common_shadow">
                        Domain: {course.domain}
                      </div>
                    )}
                  </span>

                  <span className="right-span">
                    {course.course_certification_type !== "Not Available" && (
                      <div className="details-card-certificationType common_shadow">
                        Certification Type: {course.course_certification_type}
                      </div>
                    )}
                  </span>
                </div>

                <div id="paid" className="card-right-flex right-span" style={{ display: "block" }}>
                  Paid : {course.paid}
                  <p>(As prices change continuously, so price is not given here)</p>
                </div>

                <div id="organization-instructor" className="card-right-flex right-span">
                  {course.organization !== "Not Available" && `Organization: ${course.organization}`}
                  {course.instructor !== "Not Available" && `Instructor: ${course.instructor}`}
                </div>

                <div id="prerequisites" className="card-right-flex right-span">
                  {course.Prerequisites !== "Image Not Found" && `Prerequisites: ${course.Prerequisites}`}
                </div>

                <div className="right-skills">
                  {course.skills === "Not Available" ? (
                    ""
                  ) : (
                    <div className="details-card-actual-skills">
                      <span>Skills you can gain from this course: </span>
                      <br />
                      {course.skills}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="card-details-footer">
        Copyright © CourseConnect.com | 2023 All Rights Reserved.
      </div>
      <ForYou courseId={course.ID}/>
    </div>
  );
};

export default CourseDetailsCard;