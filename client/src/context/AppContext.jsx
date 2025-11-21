import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { data, useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
import {useAuth, useUser} from '@clerk/clerk-react'
import axios from 'axios'
import {  toast } from 'react-toastify';
export const AppContext = createContext()

export const AppContextProvider = (props)=>{

    // Backend URL (set in `client/.env` as `VITE_BACKEND_URL`).
    // Fallback to localhost so dev works when the env var is missing.
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();

    const {getToken} = useAuth();
    const {user} = useUser()

    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(false)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [userData, setUserData] = useState(null)

    // fetch all courses 
    const fetchAllCourses = async ()=>{
        // setAllCourses(dummyCourses)
        try {
            const {data} = await axios.get(backendUrl + '/api/course/all');
            if(data.success)
            {
                setAllCourses(data.courses)
            }else{
                toast.error(data.message);
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    // fetch user data
    const fetchUserData = async ()=>{
        // Guard access to user metadata
        if (user && user.publicMetadata && user.publicMetadata.role === 'educator') {
            setIsEducator(true);
        }

        try {
            const token = await getToken();
            if (!token) {
                console.warn('No auth token available from Clerk. Skipping fetchUserData.');
                return;
            }

            // Debugging: log the request target and token presence (do NOT log token to prod)
            // console.debug('Fetching user data from', backendUrl + '/api/user/data');

            const response = await axios.get(backendUrl + '/api/user/data', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response?.data?.success) {
                setUserData(response.data.user);
            } else {
                console.error('fetchUserData error response:', response?.data);
                // Don't toast if it's just a 404 or user creation is in progress
                if (response?.status !== 404) {
                    toast.error(response?.data?.message || 'Failed to fetch user data');
                }
            }
        } catch (error) {
            console.error('fetchUserData caught error:', error?.response?.status, error?.response?.data || error.message);
            // 404 may mean user is being created by webhook, so only toast on other errors
            if (error?.response?.status !== 404) {
                toast.error(error?.response?.data?.message || error.message || 'Network error while fetching user data');
            }
        }
    }

    // Function to calculate average rating of course
    const calculateRating = (course) => {
        if (!course || !Array.isArray(course.courseRatings) || course.courseRatings.length === 0) {
            return 0;
        }
        let totalRating = 0;
        course.courseRatings.forEach((rating) => {
            totalRating += rating?.rating || 0;
        });
        return Math.floor(totalRating / course.courseRatings.length);
    }

    // function to calculate course chapter time
    const calculateChapterTime = (chapter) => {
        if (!chapter || !Array.isArray(chapter.chapterContent)) return "0 m";
        let time = 0;
        chapter.chapterContent.forEach((lecture) => {
            time += lecture?.lectureDuration || 0;
        });
        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    // Function to calculate course Duratuion
    const calculateCourseDuration = (course)=>{
        if (!course || !Array.isArray(course.courseContent)) return "0 m";
        let time = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                chapter.chapterContent.forEach((lecture) => {
                    time += lecture?.lectureDuration || 0;
                });
            }
        });

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
    }

    // Function to calculate to no. of lectures in the course
    const calculateNoOfLectures = (course) => {
        if (!course || !Array.isArray(course.courseContent)) return 0;
        let totalLectures = 0;
        course.courseContent.forEach((chapter) => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }

    // Fetch user enrolled courses

    // const fetchUserEnrolledCourses = async()=>{
    //     // setEnrolledCourses(dummyCourses)
    //    try {
    //     const token = await getToken();

    //     const data = await axios.get(backendUrl + '/api/user/enrolled-courses', {headers: {Authorization: `Bearer ${token}`}})
        
    //     console.log("Data",data);
    //     if(data){
    //         setEnrolledCourses(data.enrolledCourses.reverse());
    //         // console.log("enroll", enrolledCourses);
    //         // console.log("setenroll", enrolledCourses);
            
    //     }else{
    //         toast.error(data.message)
    //     }
    //    } catch (error) {
    //     toast.error(error.message)
    //    }
    // }


    const fetchUserEnrolledCourses = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(backendUrl + "/api/user/enrolled-courses", {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            // console.log("Response:", response); // Debugging: Log full response
    
            if (response.data && response.data.enrolledCourses) {
                setEnrolledCourses(response.data.enrolledCourses.reverse());
            } else {
                toast.error(response.data?.message || "No enrolled courses found.");
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };
    
    useEffect(()=>{
        fetchAllCourses()
    },[])

    useEffect(()=>{

    },[])


    // const logToken = async ()=>{
    //     console.log(await getToken());
        
    // }

    useEffect(()=>{
        if(user){
            fetchUserData()
            // logToken()
            fetchUserEnrolledCourses()
        }
    },[user])

    const value = {
        currency,allCourses, navigate, isEducator, setIsEducator,
        calculateRating,calculateChapterTime,calculateCourseDuration,calculateNoOfLectures
        ,fetchUserEnrolledCourses, setEnrolledCourses,enrolledCourses,backendUrl, userData, setUserData, getToken, fetchAllCourses

    }


    return (
        <AppContext.Provider value={value} >
            {props.children}
        </AppContext.Provider>
    )

    

}