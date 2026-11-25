# Duno App Development Final Presentation

Suggested presentation time: about 12 minutes, with a short live site walkthrough.

## 01. Cover | 35 seconds

Introduce the project and your group. Duno is a personalized study planning, tracking, and academic analytics application. Mention that the idea is to make a student's study routine feel more organized and manageable.

## 02. Project Overview | 45 seconds

Explain Duno in one sentence: it brings subjects, topics, planning, session tracking, and study summaries into one browser-based space. Point out that it is designed around student use on both phones and desktop screens. The UI drawing is a conceptual preview, not a captured screen.

## 03. Problem Solved | 45 seconds

Make the problem relatable. Students handle several subjects, deadlines, and different study tools at once. When time is limited, deciding what to study first and remembering what has already been done can be difficult. Duno aims to gather those steps together. This is project framing, not a claim from a student survey.

## 04. Core Functionalities | 50 seconds

Give a quick map of the application. Authentication opens a personal space. Subjects and topics feed Focus and Plan. Guide offers curated suggestions. Timer and Aralytics support recording and reviewing study sessions. Search, reports, private check-ins, study progression, and the admin dashboard support the wider experience.

## 05. Student Workflow | 50 seconds

Walk left to right. A student signs in, sets up a program and subjects, adds topics, looks at Focus, creates a plan that fits available time, studies and saves a session, then reviews activity. Emphasize that the timer is only saved when the student explicitly chooses to save.

## 06. Key Functionalities | 60 seconds

Explain the six main student tools in terms of what they help with. Subjects and Topics organize coursework. Focus helps choose a next topic using entered details. Plan arranges study time. Guide presents curated study material. Timer records chosen sessions. Aralytics summarizes saved study activity. These features do not predict grades or guarantee results.

## 07. Supporting Tools | 55 seconds

Describe login, logout, roles, email verification, and password recovery as account features in the application. Search and filters help find course work. Reports can be reviewed or printed. Admin views are aggregate-focused and keep individual student records private. Be open that the latest hosted registration page had a missing consent checkbox, so registration is not being presented as verified.

## 08. Database Design | 65 seconds

The current source schema definitions contain 18 tables. This visual is a simplified view of the six tables most directly involved in the study flow: users, subjects, topics, study plans, plan items, and study sessions. Explain that foreign keys link records and owner-aware relationships keep each topic and plan item connected to the right student. Optional topic links can be empty. The complete design also includes authentication, check-in, progression, and supporting records.

## 09. Hosted Website Demo | 45 seconds plus demonstration

Open the hosted site at talas-dev.page.gd. The browser frame on the slide is conceptual. Use a prepared synthetic account only if the signed-in experience is ready. The recorded r25 check covered public pages; authenticated workflows were not verified in that check. If sign-in is unavailable, show the public landing page and explain the intended workflow without claiming it passed on the host.

## 10. Challenges | 50 seconds

Reflect briefly on the work: selecting a manageable first scope, shaping clear account flows, keeping linked study records organized, preparing for shared hosting, and making the app comfortable on smaller screens. The consent checkbox issue is still an open fix before registration can be presented as ready.

## 11. Future Enhancements | 45 seconds

Present the roadmap as ideas for later versions. Possible work includes reminders, richer personal summaries, more course-linked guidance, more aggregate admin insight, and further PWA improvements. These are future ideas, not current release claims.

## 12. Photo Ops | 15 seconds

This page is intentionally left with empty frames. Add real photos of planning, development, testing, debugging, consultation, documentation, deployment, and preparation. Do not leave the labels as a substitute for evidence.

## 13. Conclusion | 35 seconds

Summarize the value in three parts: organize academic work, connect planning to study tracking, and make personal activity easier to review. Frame Duno as a practical student project that applies app development ideas to a familiar academic need.

## 14. Thank You | 15 seconds

Thank the teacher and classmates, then invite questions. Keep the site link available if a follow-up demonstration is appropriate.
