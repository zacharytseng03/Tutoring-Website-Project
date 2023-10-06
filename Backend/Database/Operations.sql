/*These are the commands*/

-- select
SELECT Organizations.Name, Temp.count
FROM Organizations, (SELECT Organizations.OrgID, COUNT(Tutors.Email)
		FROM Tutors, Organizations
		WHERE Tutors.OrgID = Organizations.OrgID
		GROUP BY Organizations.OrgID
		HAVING COUNT(Tutors.Email)>=2
		ORDER BY Organizations.OrgID ASC
		) AS Temp
WHERE Organizations.OrgID= Temp.OrgID

SELECT *
FROM Subjects
WHERE Subjects.Course IN ('Math', 'Physics');

--insert 
INSERT INTO
Requests( Content, email)
VALUES
('Im making a request.', 'tomcarlson@gmail.com')
RETURNING Requests.RequestID, Requests.Content, Requests.Open, Requests.Email;

INSERT INTO 
Reviews(Email, Content, Rating)
VALUES
( 'wdls@gmail.com', 'meh', 4)
RETURNING Reviews.ReviewID, Reviews.Email, Reviews.Content, Reviews.Rating;

--update
UPDATE Users
Set Email='wdls@gmail.com' , FirstName='Ida', LastName='Welch', PhoneNum='123-345-678'
WHERE Email='wdls@gmail.com'

UPDATE Requests 
SET Open=False
WHERE requestId=1;

--Projection
SELECT Users.Email, Users.FirstName, Users.LastName
FROM Users, Students
WHERE Students.Email=Users.Email;

--other kind of selects
SELECT Users.Email, Users.FirstName, Users.LastName, Users.PhoneNum
FROM Users 
WHERE Users.Email='tomcarlson@gmail.com';

SELECT Password
FROM Students 
WHERE email='idawelch@hotmail.com'

SELECT * 
FROM Organizations;

SELECT DISTINCT RegionCountry.Country
FROM RegionCountry;

SELECT *
FROM Qualifications;

SELECT * 
FROM Languages;

SELECT* 
FROM Subjects;

SELECT RegionCountry.Region
FROM RegionCountry
WHERE RegionCountry.Country='Canada';

SELECT TimeZone.City
FROM TimeZone
WHERE TimeZone.Region='BC';

SELECT Requests.requestid, Requests.content, Requests.open, Requests.DateCreated
FROM Requests
WHERE Requests.email='tomcarlson@gmail.com'
ORDER BY Requests.DateCreated DESC;

SELECT Sessions.SessionID, Sessions.SessionDate, Sessions.SessionTime, Users.FirstName, Users.LastName
FROM Sessions, Users
WHERE Sessions.StudentEmail='tomcarlson@gmail.com' AND Users.Email=Sessions.TutorEmail;

SELECT *
FROM UserLanguages
WHERE UserLanguages.Email='wdls@gmail.com';

SELECT *
FROM TutorSubjects
WHERE TutorSubjects.Email='wdls@gmail.com';

SELECT TutorQualifications.Name, Qualifications.DateIssued
FROM Qualifications, TutorQualifications
WHERE TutorQualifications.Email='wdls@gmail.com' AND TutorQualifications.Name=Qualifications.Name;

SELECT Reviews.ReviewID, Reviews.Content, Reviews.Rating
FROM Reviews
WHERE Reviews.Email='wdls@gmail.com';

--join
SELECT Users.Email, Users.FirstName, Users.LastName, Users.PhoneNum, RegionCountry.Country, PostalCodeRegion.Region, PostalCodeCity.City,
Users.Street, Users.PostalCode, TimeZone.TimeZone, Tutors.Availability, Tutors.Summary, OrganizationPayRate.HourlyRate, 
Organizations.OrgID, Organizations.Name, Organizations.URL, Organizations.Email
FROM Users, Tutors, Organizations, PostalCodeRegion, PostalCodeCity, TimeZone, OrganizationPayRate, RegionCountry
WHERE Tutors.OrgID=1 AND Tutors.Email=Users.Email AND Users.PostalCode=PostalCodeCity.PostalCode 
AND PostalCodeRegion.PostalCode=PostalCodeCity.PostalCode AND PostalCodeRegion.Region=TimeZone.Region AND PostalCodeCity.City=TimeZone.City
AND Tutors.OrgID=OrganizationPayRate.OrgID AND RegionCountry.Region=PostalCodeRegion.Region AND Tutors.OrgID=Organizations.OrgID 


--Aggregation: group by and having
SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2)
FROM Reviews
GROUP BY Reviews.Email

SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2)
FROM Reviews
GROUP BY Reviews.Email
HAVING AVG(Reviews.Rating)>=3;

--Inserting tutors
INSERT INTO
PostalCodeRegion(PostalCode, Region)
VALUES
('A1B C2D', 'BC');

INSERT INTO
PostalCodeCity(PostalCode, City)
VALUES
('A1B C2D', 'Vancouver');

INSERT INTO
Address(Street, PostalCode, HouseNum)
VALUES
( '2320 East Mall', 'A1B C2D', 100);

INSERT INTO
Users(Email, FirstName, LastName, PhoneNum, PostalCode, Street, HouseNum)
VALUES
('a@email.com', 'William', 'Gong', '778-322-3010', 'A1B C2D', '2320 East Mall', 100);


INSERT INTO 
Tutors(Email, Availability, Summary, OrgID)
VALUES
('a@email.com', 'whenever', 'hi, im a tutor. please hire me!', 1);

INSERT INTO
UserLanguages(Email, LangName, Proficiency)
VALUES
('a@email.com', 'English', 5);

INSERT INTO 
TutorSubjects(Email, Course, Level)
VALUES
('a@email.com', 'Math', 'Grade 11');

INSERT INTO 
TutorQualifications(Name, Email)
VALUES
('First aid certificate 2020', 'a@email.com')
RETURNING TRUE;


--Inserting students
INSERT INTO
PostalCodeRegion(PostalCode, Region)
VALUES
('V6T 2T5', 'BC');

INSERT INTO
PostalCodeCity(PostalCode, City)
VALUES
('V6T 2T5', 'Vancouver');

INSERT INTO
Address(Street, PostalCode, HouseNum)
VALUES
( '2050 West Mall', 'V6T 2T5', 100);

INSERT INTO
Users(Email, FirstName, LastName, PhoneNum, PostalCode, Street, HouseNum)
VALUES
('123@email.com', 'William', 'Gong', '778-322-3123', 'V6T 2T5', '2050 West Mall', 100);

INSERT INTO
Students(Email, Password, School, GradeLevel)
VALUES
('123@email.com', 'Password1', 'University of British Columbia', 'Year1');

INSERT INTO
UserLanguages(Email, LangName, Proficiency)
VALUES
('123@email.com', 'English', 5)
RETURNING TRUE;

--delete 															  														  
Delete users(students)
DELETE 
FROM Users
WHERE Users.Email='123@email.com';

--nested aggragation
SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2) AS TutorAverage, Temp.Average AS OrganizationAverage
FROM Reviews,  Tutors, (SELECT Tutors.OrgID, ROUND(AVG(Reviews.Rating),2) AS Average
                FROM  Reviews, Tutors
                WHERE Tutors.Email=Reviews.Email
                GROUP BY Tutors.OrgID) AS Temp
WHERE Temp.OrgID=Tutors.OrgID AND Tutors.Email=Reviews.Email
GROUP BY Reviews.Email, Temp.Average
HAVING AVG(Reviews.Rating)>= Temp.Average;

