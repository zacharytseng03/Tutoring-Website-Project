# Frontend:

## Description:
React + TypeScript + HTML + BootStrap website, using Axios to make API requests to backend.

## To run:
- Go into [react-app folder](react-app)
- Run: `npm i` to install all required dependencies. (Need to have Node downloaded as well)
- Run: `npm run dev` and put url in browser (by default: http://127.0.0.1:5173/)

## Connection to NodeJS Backend Server:
Assuming the NodeJS server is running, the Frontend should be able to make requests with no issues. If there is a change in the host, port, url, etc... you can update the url where the requests are sent to by updating this [line of code](https://github.students.cs.ubc.ca/CPSC304-2023S-T2/project_c3w9s_g8y7b_r6j3b/blob/6cc1f95768c69e65a94eb31c06eabd12af6478c3/Frontend/react-app/src/App/Utility/MakeRequest.ts#L4)

## Sreenshots

### Home Screen (Get Students)
- See students in our system.
![image](https://media.github.students.cs.ubc.ca/user/8878/files/da50dc55-bf0d-49a2-b88d-23553dfecdb7)

### Home Screen (Get Tutors with available filters)
- Filter Languages: Filters out tutors that don't speak one of the selected languages.
- Filter Countries: Filters out tutors that don't live in one of the selected countries.
- Filter Ratings: Filters out tutors' with an average rating (average rating calculated by averaging ratings based on reviews) below selected rating.
- Filter Subjects: Filters out tutors that don't teach **ALL** subjects selected.
- Filter Organizations: Filters out tutors that don't belong to one of the selected organizations.
- Filter Qualifications: Filters out tutors that don't have one of the selected qualifications.
- Get Above Average Tutors: Filters out tutors that have lower ratings than their organizations average rating. Organization average rating = all tutors in organization ratings averaged. 
- See tutor information.
- See tutor reviews/create review for tutor.
![image](https://media.github.students.cs.ubc.ca/user/8878/files/3373d4ca-9265-4120-b4a0-d64bcb9446a3)

### Home Screen (Get Miscallaneous Data)
- See information on subjects, search by course name.
- See information on organizations, search by number of tutors.
![image](https://media.github.students.cs.ubc.ca/user/8878/files/17209c5f-52ee-4f52-a12d-a9eea19e1cd2)

### Register Screen
- Register/Create new student account/tutor account
![image](https://media.github.students.cs.ubc.ca/user/8878/files/0976b45a-19f0-4c92-8d04-1d0a538fc337)

### Login Screen (Valid email/password combination: 'tomcarlson@gmail.com', 'Password1' case-sensitive)
- Login to enter user profile account.
![image](https://media.github.students.cs.ubc.ca/user/8878/files/ab61259d-a2ea-41fd-9b7d-88aa324db655)

### Profile Screen 
- Update user profile.
- Delete user profile.
![image](https://media.github.students.cs.ubc.ca/user/8878/files/6e0da6e6-34cf-4875-b735-57d3bdeb878a)

### Requests Screen
- See previous requests made, close previous requests, create new requests.
![image](https://media.github.students.cs.ubc.ca/user/8878/files/fe558f9d-5bee-422c-9e3b-10d29ff8b9d9)

### Sessions Screen
- See sessions made with tutors and assignments assigned by tutors.
![image](https://media.github.students.cs.ubc.ca/user/8878/files/e345ea5f-dc8b-4a21-8747-1dd9c87a0861)




