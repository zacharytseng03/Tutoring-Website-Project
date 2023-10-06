DROP TABLE TutorSubjects;
DROP TABLE TutorQualifications;
DROP TABLE Reviews;
DROP TABLE Assignments;
DROP TABLE Sessions;
DROP TABLE OrganizationPayRate;
DROP TABLE Tutors;
DROP TABLE Requests;
DROP TABLE Students;
DROP TABLE UserLanguages;
DROP TABLE Qualifications;
DROP TABLE Users;
DROP TABLE Subjects;
DROP TABLE Ratings;
DROP TABLE Organizations;
DROP TABLE Deadline;
DROP TABLE Languages;
DROP TABLE Address;
DROP TABLE PostalCodeRegion;
DROP TABLE PostalCodeCity;
DROP TABLE TimeZone;
DROP TABLE RegionCountry;


CREATE TABLE Address(
  Street VARCHAR(64) NOT NULL,
  PostalCode VARCHAR(16) NOT NULL,
  HouseNum INTEGER NOT NULL,
  PRIMARY KEY (Street, PostalCode, HouseNum)
);

CREATE TABLE Organizations(
  OrgID SMALLSERIAL,
  Name VARCHAR(64) NOT NULL,
  URL VARCHAR(128) NOT NULL, 
  Email VARCHAR(64) NOT NULL,
  UNIQUE (Name),
  UNIQUE (URL),
  UNIQUE (Email),
  PRIMARY KEY (OrgID)
);

CREATE TABLE Users(
  Email VARCHAR(64) NOT NULL,
  FirstName VARCHAR(32) NOT NULL,
  LastName VARCHAR(32) NOT NULL,
  PhoneNum VARCHAR(16) NOT NULL,
  DateJoined Date NOT NULL default CURRENT_DATE,
  PostalCode VARCHAR(16) NOT NULL,
  Street VARCHAR(64) NOT NULL,
  HouseNum INTEGER NOT NULL,
  UNIQUE (PhoneNum),
  PRIMARY KEY (Email),
  FOREIGN KEY (Street, PostalCode, HouseNum) REFERENCES Address(Street, PostalCode, HouseNum)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);

CREATE TABLE RegionCountry(
  Region VARCHAR(64) NOT NULL,
  Country VARCHAR(64) NOT NULL,
  PRIMARY KEY (Region)
);

CREATE TABLE TimeZone(
  Region VARCHAR(64) NOT NULL,
  City VARCHAR(64) NOT NULL,
  TimeZone SMALLINT NOT NULL,
  PRIMARY KEY (Region, City)
);

CREATE TABLE PostalCodeCity(
  PostalCode VARCHAR(16) NOT NULL,
  City VARCHAR(64) NOT NULL,
  PRIMARY KEY (PostalCode)
);

CREATE TABLE PostalCodeRegion(
  PostalCode VARCHAR(16) NOT NULL,
  Region VARCHAR(64) NOT NULL,
  PRIMARY KEY (PostalCode)
);

CREATE TABLE Languages(
  LangName VARCHAR(64) NOT NULL,
  PRIMARY KEY (LangName)
);

CREATE TABLE UserLanguages(
  Email VARCHAR(64) NOT NULL,
  LangName VARCHAR(64) NOT NULL,
  Proficiency INTEGER NOT NULL,
  PRIMARY KEY (Email, LangName),
  FOREIGN KEY (Email) REFERENCES Users(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (LangName) REFERENCES Languages(LangName)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Students(
  Email VARCHAR(64) NOT NULL,
  Password VARCHAR(64) NOT NULL,
  School VARCHAR(64),
  GradeLevel VARCHAR(16),
  PRIMARY KEY (Email),
  FOREIGN KEY (Email) REFERENCES Users(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Requests(
  RequestID SMALLSERIAL,
  Content VARCHAR(512) NOT NULL,
  DateCreated Date NOT NULL default CURRENT_DATE,
  Open BOOLEAN NOT NULL default TRUE,
  Email VARCHAR(64) NOT NULL,
  PRIMARY KEY (RequestID),
  FOREIGN KEY (Email) REFERENCES Students(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Tutors(
  Email VARCHAR(64) NOT NULL,
  Availability VARCHAR(64) NOT NULL,
  Summary VARCHAR(512),
  OrgID INTEGER NOT NULL,
  PRIMARY KEY (Email),
  FOREIGN KEY (Email) REFERENCES Users(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (OrgID) REFERENCES Organizations(OrgID)
    ON DELETE NO ACTION
    ON UPDATE CASCADE
);

CREATE TABLE OrganizationPayRate(
  OrgID INTEGER NOT NULL,
  HourlyRate FLOAT,
  PRIMARY KEY (OrgID),
  FOREIGN KEY (OrgID) REFERENCES Organizations(OrgID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Sessions(
  SessionID SMALLSERIAL,
  SessionDate TIMESTAMP ,
  SessionTime INTEGER NOT NULL,
  StudentEmail VARCHAR(64) NOT NULL,
  TutorEmail VARCHAR(64) NOT NULL,
  PRIMARY KEY (SessionID),
  FOREIGN KEY (StudentEmail) REFERENCES Students(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (TutorEmail) REFERENCES Tutors(Email) 
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Assignments(
  AssignmentName VARCHAR(64) NOT NULL,
  SessionID INTEGER NOT NULL,
  Instruction VARCHAR(512) NOT NULL,
  Response VARCHAR(512),
  Grade INTEGER,
  DateCreated DATE NOT NULL,
  DaysToComplete INTEGER NOT NULL,
  PRIMARY KEY (AssignmentName, SessionID),
  FOREIGN KEY (SessionID) REFERENCES Sessions(SessionID)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Deadline(
  DateCreated DATE NOT NULL,
  DaysToComplete INTEGER NOT NULL,
  Deadline DATE NOT NULL,
  PRIMARY KEY (DateCreated, DaysToComplete)
);

CREATE TABLE Reviews(
  ReviewID SMALLSERIAL,
  Email VARCHAR(64) NOT NULL,
  Content VARCHAR(512),
  Rating INTEGER  NOT NULL,
  PRIMARY KEY (ReviewID, Email),
  FOREIGN KEY (Email) REFERENCES Tutors(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Ratings(
  Rating INTEGER NOT NULL,
  Recommendation BOOLEAN NOT NULL,
  PRIMARY KEY (RATING)
);

CREATE TABLE Subjects(
  Course VARCHAR(32) NOT NULL,
  Level VARCHAR(16) NOT NULL,
  Description VARCHAR(512),
  PRIMARY KEY (Course, Level)
);

CREATE TABLE TutorSubjects(
  Email VARCHAR(64) NOT NULL,
  Course VARCHAR(32) NOT NULL,
  Level VARCHAR(16) NOT NULL,
  PRIMARY KEY (Email, Course, Level),
  FOREIGN KEY (Email) REFERENCES Tutors(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (Course, Level) REFERENCES Subjects(Course, Level)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE Qualifications(
  Name VARCHAR(128) NOT NULL,
  DateIssued DATE NOT NULL,
  PRIMARY KEY (Name)
);

CREATE TABLE TutorQualifications(
  Name VARCHAR(128) NOT NULL,
  Email VARCHAR(64) NOT NULL,
  PRIMARY KEY (Name, Email),
  FOREIGN KEY (Name) REFERENCES Qualifications(Name)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (Email) REFERENCES Tutors(Email)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

INSERT INTO 
RegionCountry(Region, Country) 
VALUES
('BC', 'Canada'),
('NY', 'United States'),
('ON', 'Canada'),
('AB', 'Canada'),
('WA', 'United States'),
('TX', 'United States'),
('SK', 'Canada'),
('CA', 'United States');

INSERT INTO
TimeZone(Region, City, TimeZone)
VALUES
('BC', 'Vancouver', -7),
('NY', 'New York', -4),
('ON', 'Toronto', -4),
('AB', 'Calgary', -7),
('WA', 'Seattle', -7),
('CA', 'Los Angeles', -7),
('SK', 'Saskatoon', -6),
('TX', 'Austin', -5),
('BC', 'Richmond', -7),
('BC', 'Burnaby', -7);

INSERT INTO
PostalCodeCity(PostalCode, City)
VALUES
('V6T 1Z0', 'Vancouver'),
('10012', 'New York'),
('M2P 0A2', 'Toronto'),
('T2G 2W1', 'Calgary'),
('90028', 'Los Angeles'),
('78701', 'Austin'),
('S7K 3J7', 'Saskatoon'),
('98109', 'Seattle'),
('V5H 4M5', 'Burnaby'),
('V6X 4J7', 'Richmond');

INSERT INTO
PostalCodeRegion(PostalCode, Region)
VALUES
('V6T 1Z0', 'BC'),
('10012', 'NY'),
('M2P 0A2', 'ON'),
('T2G 2W1', 'AB'),
('78701', 'TX'),
('90028', 'CA'),
('S7K 3J7', 'SK'),
('98109', 'WA'),
('V5H 4M5', 'BC'),
('V6X 4J7', 'BC');

INSERT INTO
Address(Street, PostalCode, HouseNum)
VALUES
('2329 West Mall', 'V6T 1Z0', 3214),
('20 W 34th St.', '10012', 105),
('200 Bay Street', 'M2P 0A2', 934),
('101 9 Ave SW', 'T2G 2W1', 4921),
('112 E 11th St', '78701', 001),
('6834 Hollywood Blvd', '90028', 003),
('4 Penner Rd', 'S7K 3J7', 123),
('400 Broad St', '98109', 8859),
('4151 Hazelbridge Way', 'V6X 4J7', 0001),
('4700 Kingsway', 'V5H 4M5', 2001);

INSERT INTO
Languages(LangName)
VALUES
('English'),
('Japanese'),
('Mandarin'),
('Latin'),
('Spanish'),
('Portuguese'),
('Cantonese'),
('Vietnamese'),
('Turkish'),
('Russian'),
('French'),
('German'),
('Korean');

INSERT INTO 
Deadline(DateCreated, DaysToComplete, Deadline)
VALUES
('2023-07-25', 7, '2023-08-01'),
('2023-07-25', 14,'2023-08-08' ),
('2023-07-26', 7, '2023-08-02'),
('2023-07-26', 10, '2023-08-05'),
('2023-07-26', 14, '2023-08-09');


INSERT INTO 
Organizations(Name, URL, Email)
VALUES
('Tutors Incorporated', 'http://tutorsinc.com/', 'support@tutorsinc.com'),
('Oxford Learning', 'http://oxfordlearning.com/', 'contact@oxfordlearning.com'),
('Kumon', 'http://kumon.com/', 'contact@kumon.com'),
('SimpleTutoring', 'http://simpletutoring.com/', 'contact@simpletutoring.com'),
('TutorDoctor', 'http://tutordoctor.com/', 'contact@tutordoctor.com'),
('TeachersOnCall', 'http://teachersoncall.com/', 'contact@teachersoncall.com'),
('ExperiencedTutors', 'http://experiencedtutors.com/', 'contact@experiencedtutors.com'),
('International Tutors', 'http://tutorsint.com/', 'support@tutorsint.com');


INSERT INTO
Ratings(Rating, Recommendation)
VALUES
(7, TRUE),
(1, FALSE),
(3, FALSE),
(4, TRUE),
(6, TRUE),
(5,	TRUE),
(0, FALSE),
(2, FALSE);

INSERT INTO
Subjects(Course, Level, Description)
VALUES
('Math', 'Grade 11', NULL),
('Physics', 'Year 3', 'falling things'),
('Chemistry', 'Grade 12', 'chemicals and things'),
('Computer Science', 'Year 4', 'math with robots'),
('Music', 'Grade 7', 'nice sounding sounds'),
('Math: Calculus', 'Grade 12', 'Basic Calculus'),
('English', 'Grade 5', 'Basic Grammar'),
('Physic', 'Grade 12', 'Physics Fundamental'),
('Organic Chemistry', 'Grade 12', 'Basic Organic Chemisty'),
('Inorganic Chemistry', 'Grade 12', 'Basic Inorganic Chemisty'),
('Math', '100', 'Differential Calculus with Applications'),
('Math', '101', 'Integral Calculus with Applications'),
('CPSC', '221', 'Basic Algorithms and Data Structures'),
('PHYS', '157', 'Introductory Physics for Engineers I'),
('PHYS', '158', 'Introductory Physics for Engineers II'),
('CPSC', '121', 'Models of Computation'),
('CPEN', '221', 'Models of Computation'),
('PHYS', '200', 'Relativity and Quanta'),
('CPSC', '304', 'Introduction to Relational Databases');

INSERT INTO 
Qualifications(Name, DateIssued)
VALUES
('First aid certificate 2020', '2020-06-25'),
('Professional algorithm master 2005', '2005-01-02'),
('Langara High School Diploma 2020', '2020-08-19'),
('Spelling bee winner 2010', '2010-09-10'),
('University of British Columbia Bachelor of Science Winter 2018', '2019-05-27'),
('University of British Columbia Bachelor of Applied Science Winter 2014', '2015-05-29'),
('University of British Columbia Bachelor of Arts Summer 2021', '2021-09-25'),
('University of British Columbia Bachelor of Education Winter 2020', '2021-05-25'),
('Simon Fraser University Graduate Diploma in Advanced Professional Studies in Education Winter 2016', '2017-05-15'),
('University of British Columbia Masters of Applied Science In Electrical and Computer Engineering Winter 2019', '2020-05-20'),
('Deans list 2018', '2018-10-9');

INSERT INTO
Users(Email, FirstName, LastName, PhoneNum, PostalCode, Street, HouseNum)
VALUES
/*students*/
('tomcarlson@gmail.com', 'Tom', 'Carlson', '604-463-8784', 'V6T 1Z0', '2329 West Mall', 3214),
('idawelch@hotmail.com', 'Ida', 'Welch', '442-236-2189', '10012', '20 W 34th St.', 105),
('youngpedro@yahoo.com', 'Pedro', 'Young', '620-952-1464', 'M2P 0A2', '200 Bay Street', 934),
('donp@outlook.com', 'Don', 'Pearson', '860-968-8497', 'T2G 2W1', '101 9 Ave SW', 4921),
('brewerc@gmail.com', 'Carmen', 'Brewer', '253-317-9074', '98109', '400 Broad St', 8859),

/*Tutors*/
('wdls@gmail.com', 'Walter', 'Douglas', '604-463-8783', 'V6T 1Z0', '2329 West Mall', 3214),
('bryant@hotmail.com', 'Felicia', 'Bryant', '442-236-2289', '10012', '20 W 34th St.', 105),
('howellnina@yahoo.com', 'Nina', 'Howell', '620-952-2464', 'M2P 0A2', '200 Bay Street', 934),
('erikw@outlook.com', 'Erik', 'Watson', '860-968-8492', 'T2G 2W1', '101 9 Ave SW', 4921),
('acruz@gmail.com', 'Ann', 'Cruz', '253-312-9074', '98109', '400 Broad St', 8859),
('sholt@gmail.com', 'Subhan', 'Holt', '996-588-7896', 'S7K 3J7', '4 Penner Rd', 123),
('zcallahan@hotmail.com', 'Zarah', 'Callahan', '281-442-4714', '90028', '6834 Hollywood Blvd', 003),
('h.patrick@yahoo.com', 'Howard', 'Patrick', '475-427-7726', '78701', '112 E 11th St', 001),
('s.maldonado@outlook.com', 'Soraya', 'Maldonado', '695-222-3693', '90028', '6834 Hollywood Blvd', 003),
('danielm@gmail.com', 'Daniel', 'Mcmahon', '595-578-7537', '78701', '112 E 11th St', 001);

INSERT INTO
UserLanguages(Email, LangName, Proficiency)
VALUES
('tomcarlson@gmail.com', 'English', 5),
('tomcarlson@gmail.com', 'Japanese', 3),
('idawelch@hotmail.com', 'Japanese', 4),
('youngpedro@yahoo.com', 'Mandarin', 3),
('donp@outlook.com', 'Latin', 2),
('brewerc@gmail.com', 'Korean', 1),
('wdls@gmail.com', 'Spanish', 5),
('bryant@hotmail.com', 'English', 5),
('howellnina@yahoo.com', 'English', 4),
('howellnina@yahoo.com', 'German', 4),
('erikw@outlook.com', 'English', 3),
('acruz@gmail.com', 'French', 5),
('acruz@gmail.com', 'English', 5),
('sholt@gmail.com', 'English', 5),
('zcallahan@hotmail.com', 'English', 4),
('zcallahan@hotmail.com', 'Portuguese', 5),
('h.patrick@yahoo.com', 'English', 5),
('s.maldonado@outlook.com', 'English', 4),
('danielm@gmail.com', 'Russian', 5),
('danielm@gmail.com',  'English', 3);

INSERT INTO
Students(Email, Password, School, GradeLevel)
VALUES
('tomcarlson@gmail.com', 'Password1', 'University of British Columbia', 'Year1'),
('idawelch@hotmail.com', 'hunter2', 'New York University', 'Year2'),
('youngpedro@yahoo.com', 'cpsc304!', 'University of Toronto', 'Year1'),
('donp@outlook.com', 'donspassword123', 'University of Alberta', 'Year4'),
('brewerc@gmail.com', '#*@($*($#', 'University of Washington', 'Year3');

INSERT INTO
Requests(Content, Email)
VALUES
('This is some content', 'tomcarlson@gmail.com'),
('I need a math teach. I am bad at math', 'idawelch@hotmail.com'),
('chemistry tutor required', 'youngpedro@yahoo.com'),
('physics tutor needed', 'donp@outlook.com'),
('korean language tutor needed asap', 'brewerc@gmail.com');

INSERT INTO 
Tutors(Email, Availability, Summary, OrgID)
VALUES
('wdls@gmail.com', 'whenever', 'hi, im a tutor. please hire me!', 1),
('bryant@hotmail.com', 'mon-wed 9am-5pm', 'looking for nice students', 2),
('howellnina@yahoo.com', '24/7', '30 years of experience', 3),
('erikw@outlook.com', 'mon,weds,fri 9am-9pm', 'do i have to make a summary?', 4),
('sholt@gmail.com', 'mon wed fri morning', 'I am a experienced tutor', 6),
('zcallahan@hotmail.com', 'tue thur afternoon, evening', 'I teaches English and Math', 2),
('h.patrick@yahoo.com', 'Available anytime', 'Feel free to contact me :)', 1),
('s.maldonado@outlook.com', 'Weekends only', 'I teach science subjects during weekend', 7),
('danielm@gmail.com', 'Weekdays evening only', 'Excellent math teacher', 8),
('acruz@gmail.com', 'mondays from 4am to 1pm', 'hello!', 5);

INSERT INTO 
OrganizationPayRate(OrgID,HourlyRate)
VALUES
(1, 16.50),
(2, 19.00),
(3, 23.00),
(4, 40.00),
(5, 56.75),
(6, 16.75),
(7, 20.00),
(8, 30.00);

INSERT INTO 
Sessions(SessionDate, SessionTime, StudentEmail, TutorEmail)
VALUES
('2023-07-25 15:00:00', 1, 'tomcarlson@gmail.com', 'wdls@gmail.com'),
('2023-07-25 19:00:00', 2, 'idawelch@hotmail.com', 'bryant@hotmail.com'),
('2023-07-26 12:00:00', 3, 'youngpedro@yahoo.com', 'howellnina@yahoo.com'),
('2023-07-26 09:30:00', 1, 'donp@outlook.com', 'erikw@outlook.com'),
('2023-07-26 14:30:00', 2, 'brewerc@gmail.com', 'acruz@gmail.com');

INSERT INTO 
Assignments(AssignmentName, SessionID, Instruction, Response, Grade, DateCreated, DaysToComplete)
VALUES
('Math100HW', 1, 'Do this asap', 'I have no idea', 0, '2023-07-25', 7),
('Eng100HW', 2, 'Write an essay for this', 'I go to school by bus', 50, '2023-07-25' , 14),
('Chem100HW', 3, 'What is the product of this reaction?', 'H2O', 70, '2023-07-26' , 7),
('Phys100HW', 4, 'Find the speed', NULL, NULL, '2023-07-26' , 10),
('Math101HW', 5, 'Do this asap', 'Not sure', NULL, '2023-07-26' , 14);

INSERT INTO 
Reviews(Email, Content, Rating)
VALUES
('wdls@gmail.com', '7/7 would recommend', 7),
('wdls@gmail.com', 'Not really sure, he could be better.', 3),
('wdls@gmail.com', 'Not bad, def would still recommend, but was kind of rude.', 5),
('bryant@hotmail.com', 'wow, avoid this person', 1),
('howellnina@yahoo.com', 'they are amazing!', 7),
('erikw@outlook.com', 'not bad. could be better', 4),
('wdls@gmail.com', 'very bad', 1),
('h.patrick@yahoo.com', 'very bad', 1),
('zcallahan@hotmail.com', 'very bad', 7),
('acruz@gmail.com', 'very thoughtful and caring', 6);

INSERT INTO 
TutorSubjects(Email, Course, Level)
VALUES
('wdls@gmail.com', 'Math', 'Grade 11'),
('wdls@gmail.com', 'Physics', 'Year 3'),
('wdls@gmail.com', 'Chemistry', 'Grade 12'),
('wdls@gmail.com', 'Computer Science', 'Year 4'),
('wdls@gmail.com', 'Music', 'Grade 7'),
('bryant@hotmail.com', 'Physics', 'Year 3'),
('howellnina@yahoo.com', 'Chemistry', 'Grade 12'),
('erikw@outlook.com', 'Computer Science', 'Year 4'),
('acruz@gmail.com', 'Music', 'Grade 7'),
('sholt@gmail.com', 'Organic Chemistry', 'Grade 12'),
('zcallahan@hotmail.com', 'English', 'Grade 5'),
('h.patrick@yahoo.com', 'Physic', 'Grade 12'),
('s.maldonado@outlook.com', 'Math', '100'),
('s.maldonado@outlook.com', 'Math', '101'),
('danielm@gmail.com', 'Math: Calculus', 'Grade 12');

INSERT INTO 
TutorQualifications(Name, Email)
VALUES
('First aid certificate 2020', 'wdls@gmail.com'),
('Professional algorithm master 2005', 'bryant@hotmail.com'),
('Langara High School Diploma 2020', 'howellnina@yahoo.com'),
('Spelling bee winner 2010', 'erikw@outlook.com'),
('University of British Columbia Bachelor of Science Winter 2018', 'sholt@gmail.com'),
('Simon Fraser University Graduate Diploma in Advanced Professional Studies in Education Winter 2016', 'zcallahan@hotmail.com'),
('University of British Columbia Bachelor of Education Winter 2020', 'h.patrick@yahoo.com'),
('University of British Columbia Bachelor of Applied Science Winter 2014','s.maldonado@outlook.com'),
('University of British Columbia Bachelor of Arts Summer 2021', 'danielm@gmail.com'),
('Deans list 2018', 'acruz@gmail.com');


