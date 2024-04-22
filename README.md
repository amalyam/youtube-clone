## What is this app?

This app is a video viewer modeled on YouTube that allows users to upload videos and view them online. The purpose of building this app was to improve my skills with this specific tech stack and to learn more about how video hosting sites work. As an artist who makes video work, I was curious to learn more about how these platforms are built.

## This app was built with:

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
<br/>
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
<br/>
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)
<br/>
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
<br/>
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
<br/>
![Next.js](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)
<br/>
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
<br/>
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
<br/>
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
<br/>
![FFmpeg](https://img.shields.io/badge/FFmpeg-5cb85c?style=for-the-badge&logo=FFmpeg&logoColor=white)

## Notes on development process

- Created a project structure that provides a separation of concerns between backend and frontend
- Dockerized the video processing service for easier deployment and scalability
- Deployed the video processing service to Google Cloud Run, allowing for automatic scaling and efficient handling of incoming video processing requests
- Created Google Cloud Storage buckets for raw and processed video files
- Leveraged Google Cloud Pub/Sub to create an event-driven messaging system between the Cloud Storage bucket and Cloud Run service
- Created and deployed serverless functions to Google Cloud Functions to handle video retrieval and upload URL generation
- Implemented robust error handling to manage potential issues such as missing video files, failed network requests, or issues generating a signed URL in Google Cloud Functions
- Used React, Next.js, and Tailwind CSS to build a dynamic, server-side rendered frontend app, enhancing user experience with fast page loads and interactive UI components
- Used FFmpeg in the video processing service to convert and scale raw video files. This ensured the videos were in a web-friendly format, reducing bandwidth usage and improving streaming performance for end-users

## Future enhancements and fixes:

- update gcs-cors.json origin to website domain and any other possible origins once deployed
- use Cloud Video Intelligence API to prevent upload of explicit content (https://cloud.google.com/video-intelligence/docs/analyze-safesearch)
- refactor Video interface by creating video-api-service, implement REST API endpoints, make requests to the service (using axios?)
- add custom thumbnails for each uploaded video (rather than generic thumbnail for all videos)
- add info like date uploaded, title, etc. to each video
- refactor video-processing-service/src/index.ts POST /process-video into multiple functions
- add pagination (getVideos() yt-api-service/functions/src/index.ts)
- add additional error handling in upload.tsx (max file size, valid file types, etc)
