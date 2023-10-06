--These are all the SQL queries we will run during the demo, and will use for rubric grading.
--Note: They currently use, mock data, but in our actual backend code, we will pass in variables
--denoted with a '$'.

--Insert (Create request) line 156 of Routes.ts
INSERT INTO
Requests( Content, email)
VALUES
('Im making a request.', 'tomcarlson@gmail.com')
RETURNING Requests.RequestID, Requests.Content, Requests.Open, Requests.Email;

--Delete (Delete profile) line 113 of Routes.ts
DELETE 
FROM Users
WHERE Users.Email='idawelch@hotmail.com';

--Update (Update user profile - attributes to update decided by user) line 137 of Routes.ts
UPDATE Users
Set Email='idawelch@hotmail.com' , FirstName='Ida', LastName='Welch', PhoneNum='123-345-678'
WHERE Email='idawelch@hotmail.com';

--Select
--Note: The user chooses which table, attributes, and conditions are applied, therefore
--the select statement may vary depending on the request.
--(Get organizations where the number of tutors is > ...) line 472 of Routes.ts
SELECT Organizations.Name, Temp.count
FROM Organizations, (SELECT Organizations.OrgID, COUNT(Tutors.Email)
    FROM Tutors, Organizations
    WHERE Tutors.OrgID = Organizations.OrgID
    GROUP BY Organizations.OrgID
    HAVING COUNT(Tutors.Email)>=2
    ORDER BY Organizations.OrgID ASC
) AS Temp
WHERE Organizations.OrgID=Temp.OrgID;

--(Get subjects where the course name is ...) line 486 of Routes.ts
SELECT *
FROM Subjects
WHERE Subjects.Course IN ('Math', 'Physics');

--Projection (Get students) Line 95 of Routes.ts
SELECT Users.Email, Users.FirstName, Users.LastName
FROM Users, Students
WHERE Students.Email=Users.Email;

--Join (Select tutor with organization and location, filtered by a list of organizations) Line 345 of Routes.ts
SELECT Users.Email, Users.FirstName, Users.LastName, Users.PhoneNum, RegionCountry.Country, PostalCodeRegion.Region, PostalCodeCity.City,
Users.Street, Users.PostalCode, TimeZone.TimeZone, Tutors.Availability, Tutors.Summary, OrganizationPayRate.HourlyRate, 
Organizations.OrgID, Organizations.Name, Organizations.URL, Organizations.Email
FROM Users, Tutors, Organizations, PostalCodeRegion, PostalCodeCity, TimeZone, OrganizationPayRate, RegionCountry
WHERE Tutors.OrgID=1 
AND Tutors.Email=Users.Email 
AND Users.PostalCode=PostalCodeCity.PostalCode 
AND PostalCodeRegion.PostalCode=PostalCodeCity.PostalCode 
AND PostalCodeRegion.Region=TimeZone.Region 
AND PostalCodeCity.City=TimeZone.City
AND Tutors.OrgID=OrganizationPayRate.OrgID 
AND RegionCountry.Region=PostalCodeRegion.Region 
AND Tutors.OrgID=Organizations.OrgID; 

--Aggregation: Group by (Get tutor average rating based on reviews) line 337 of Routes.ts
SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2)
FROM Reviews
GROUP BY Reviews.Email;

--Aggregation: Having (Get tutors with average rating > ...) line 267 of Routes.ts
SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2)
FROM Reviews
GROUP BY Reviews.Email
HAVING AVG(Reviews.Rating)>=3;

--Nested Aggregation (Get tutors with average rating > average rating of organization i.e. AVG(average rating of all tutors in an organization)) 
--line 311 of Routes.ts
SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2) AS TutorAverage, Temp.Average AS OrganizationAverage
FROM Reviews,  Tutors, (SELECT Tutors.OrgID, ROUND(AVG(Reviews.Rating),2) AS Average
                FROM  Reviews, Tutors
                WHERE Tutors.Email=Reviews.Email
                GROUP BY Tutors.OrgID) AS Temp
WHERE Temp.OrgID=Tutors.OrgID AND Tutors.Email=Reviews.Email
GROUP BY Reviews.Email, Temp.Average
HAVING AVG(Reviews.Rating)>= Temp.Average;

--Division (Get all tutors that are part of all subjects selected by user) line 280 of Routes.ts
SELECT t.Email
FROM Tutor t
WHERE NOT EXISTS (
         (SELECT s.Course, s.Level
         FROM Subjects s
         WHERE (s.Course, s.Level) IN (('Math', '101'), ('Math', '100')))
         EXCEPT
         (SELECT ts.Course, ts.Level
         FROM TutorSubjects ts
         WHERE ts.email = t.email));

