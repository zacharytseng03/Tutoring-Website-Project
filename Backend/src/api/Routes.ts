import {Response, Router} from "express";
import {Pool, PoolClient, types} from "pg"

types.setTypeParser(types.builtins.NUMERIC, (value: string) => parseFloat(value));

const router = Router();

const pool = new Pool({connectionString: process.env.PSQL_CONSTRING, max: 4});

// Send an error with a status code and message.
function send_error(response: Response, status: number, message: string) {
    response.status(status).json({error: message});
}

// Send a JSON response with 200 status.
function send_success(response: Response, json: any) {
    response.status(200).json(json);
}

// Execute a query on the database. Automatically sends an HTTP 500 on a database error.
async function query_db(query: string, params: any[], response: Response, on_success: ((result: any[]) => any),
                        on_error: ((error: any) => any) = err => send_error(response, 500, `Internal database error: ${err}`)) {
    return pool.query(query, params)
        .then(results => results.rows)
        .then(await on_success)
        .catch(await on_error);
}

async function add_user(client: PoolClient, body: any): Promise<void> {
    const {
        email,
        first_name,
        last_name,
        phone_number,
        location: {postal_code, region, city, street, house_number}
    } = body;
    const {languages}: { languages: { name: string, proficiency: number }[] } = body;

    try {
        await client.query("INSERT INTO PostalCodeRegion(PostalCode, Region) VALUES ($1, $2)", [postal_code, region])
        await client.query("INSERT INTO PostalCodeCity(PostalCode, City) VALUES ($1, $2)", [postal_code, city]);
        await client.query("INSERT INTO Address(Street, PostalCode, HouseNum) VALUES ($1, $2, $3)",
            [street, postal_code, house_number])
        await client.query("INSERT INTO Users(Email, FirstName, LastName, PhoneNum, PostalCode, Street, HouseNum) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [email, first_name, last_name, phone_number, postal_code, street, house_number])

        for (let {name, proficiency} of languages) {
            await client.query("INSERT INTO UserLanguages(Email, LangName, Proficiency) VALUES ($1, $2, $3)",
                [body['email'], name, proficiency]);
        }
    } catch (error) {
        throw error;
    }
}

// Authorize a student
router.post('/login', async (req, res) => {
    let {email, password} = req.body;
    await query_db("SELECT Password FROM Students WHERE email=$1", [email], res, rows => {
        if (rows.length === 0) {
            send_error(res, 404, "User not found");
        } else if (rows[0].password !== password) {
            send_error(res, 401, "Incorrect password");
        } else {
            send_success(res, {});
        }
    });
});

// Register a new student
router.post('/student', async (req, res) => {
    const body = req.body;
    let {email, password, school, grade_level} = body;
    school ||= null;
    grade_level ||= null;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await add_user(client, body);
        await client.query("INSERT INTO Students(Email, Password, School, GradeLevel) VALUES ($1, $2, $3, $4)", [email, password, school, grade_level]);
        await client.query("COMMIT");
        send_success(res, {});
    } catch (error) {
        await client.query("ROLLBACK");
        send_error(res, 400, `Failed to add student: ${error}`);
    } finally {
        client.release();
    }
});

// Get all students
router.get('/students', async (req, res) => {
    await query_db("SELECT Users.Email, Users.FirstName, Users.LastName FROM Users, Students WHERE Students.Email=Users.Email", [], res, rows => send_success(res, rows));
})

// Get a student's information
router.get('/student/:email', async (req, res) => {
    let {email} = req.params;
    await query_db("SELECT Email, FirstName, LastName, PhoneNum FROM Users WHERE Email=$1", [email], res, rows => {
        if (rows.length === 0) {
            send_error(res, 404, "Student not found");
        } else {
            send_success(res, rows[0]);
        }
    })
});

// Delete a student
router.delete('/student/:email', async (req, res) => {
    let {email} = req.params;
    await query_db("DELETE FROM Users WHERE Users.Email=$1 RETURNING Users.Email", [email], res, rows => {
        if (rows.length === 0) {
            send_error(res, 404, "User not found");
        } else {
            send_success(res, {});
        }
    });
});

// Update a student's information
router.patch('/student/:email', async (req, res) => {
    let {email} = req.params;
    const client = await pool.connect();

    let changed = [];
    const allowed_fields = ["firstname", "lastname", "email", "phonenum"];
    await client.query("BEGIN");
    try {
        for (const [field, new_value] of Object.entries(req.body)) {
            if (!allowed_fields.includes(field)) {
                await client.query("ROLLBACK");
                send_error(res, 400, `Field '${field}' not a valid field that can be changed in Users`);
                return;
            }
            let results = await client.query(`UPDATE Users SET ${field}=$1 WHERE email=$2 RETURNING ${field}`, [new_value, email]);
            changed.push(results.rows[0]);
            if (field === 'email') {
                email = new_value as string;
            }
        }
        await client.query("COMMIT");
        send_success(res, Object.assign({}, ...changed));
    } catch (error) {
        await client.query("ROLLBACK");
        send_error(res, 400, `Failed to update student: ${error}`);
    } finally {
        client.release();
    }
});

// Create a new request
router.post('/student/:email/requests', async (req, res) => {
    const {email} = req.params;
    await query_db("INSERT INTO Requests(Content, email) VALUES ($1, $2) RETURNING RequestID, Content, Open, DateCreated",
        [req.body.content, email], res, rows => send_success(res, rows[0]));
});

// Get all requests created by a student
router.get('/student/:email/requests', async (req, res) => {
    const {email} = req.params;
    await query_db("SELECT requestID, content, open, DateCreated FROM Requests WHERE email=$1 ORDER BY DateCreated DESC", [email], res, rows => {
        send_success(res, rows);
    });
});

// Close an open request
router.patch("/requests/:id", async (req, res) => {
    await query_db("UPDATE Requests SET Open = FALSE WHERE RequestID=$1 Returning *", [req.params.id], res, rows => {
        if (rows.length === 0) {
            send_error(res, 404, `Request with id ${req.params.id} not found`);
        } else {
            send_success(res, rows[0]);
        }
    });
});

// Get all sessions that a student is participating in
router.get('/student/:email/sessions', async (req, res) => {
    const {email} = req.params;
    await query_db("SELECT SessionID, SessionDate, SessionTime, FirstName, LastName " +
        "FROM Sessions, Users " +
        "WHERE StudentEmail=$1 AND Users.Email=TutorEmail",
        [email], res, rows => {
            send_success(res, rows);
        });
});

// Get all assignments associated with a session
router.get('/session/:sessionID/assignments', async (req, res) => {
    const {sessionID} = req.params;
    await query_db("SELECT a.AssignmentName, a.Instruction, a.Response, a.Grade, d.Deadline " + 
        "FROM Assignments a " + 
        "JOIN Deadline d ON a.DateCreated=d.DateCreated AND a.DaysToComplete=d.DaysToComplete " +
        "WHERE a.SessionID=$1", 
        [sessionID], res, rows => {
            send_success(res, rows);
    });
})

router.patch('/assignment/:assignmentName', async (req, res) => {
    const {assignmentName} = req.params;
    const {response} = req.body;
    await query_db("UPDATE Assignments SET Response=$2 WHERE AssignmentName=$1", [assignmentName, response], res, rows => {
        send_success(res, rows);
    })
})

// Register a new tutor
router.post('/tutor', async (req, res) => {
    const body = req.body;
    let {email, availability, summary, org_id} = body;
    const {subjects}: { subjects: { course: string, level: string }[] } = body;
    const {qualifications}: { qualifications: string[] } = body;
    summary ||= null;

    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await add_user(client, body);
        await client.query("INSERT INTO Tutors(Email, Availability, Summary, OrgID) VALUES ($1, $2, $3, $4)", [email, availability, summary, org_id]);
        for (let {course, level} of subjects) {
            await client.query("INSERT INTO TutorSubjects(Email, Course, Level) VALUES ($1, $2, $3)", [email, course, level]);
        }
        if (qualifications) {
            for (let name of qualifications) {
                await client.query("INSERT INTO TutorQualifications(Name, Email) VALUES ($1, $2)", [name, email]);
            }
        }
        await client.query("COMMIT");
        send_success(res, {});
    } catch (error) {
        await client.query("ROLLBACK");
        send_error(res, 400, `Failed to add tutor: ${error}`);
    } finally {
        client.release();
    }
});

function get_filter_queries(body: any): [string[], any[]] {
    let {languages, countries, rating, subjects, organizations, qualifications, above_average} = body;
    let queries = [];
    let params = []
    let count = 1;

    if (languages) {
        queries.push("SELECT DISTINCT t.Email " +
                "FROM Tutors t, UserLanguages u " +
                "WHERE t.Email = u.Email " +
                `AND u.LangName = ANY ($${count++})`);
        params.push(languages);
    }

    if (countries) {
        queries.push("SELECT DISTINCT t.Email " +
                "FROM Tutors t, Users u, PostalCodeRegion r, RegionCountry c " +
                "WHERE u.Email=t.Email " +
                "AND r.PostalCode=u.PostalCode " +
                "AND r.Region=c.Region " +
                `AND c.Country = ANY ($${count++})`);
        params.push(countries)
    }

    if (rating) {
        queries.push("SELECT DISTINCT Email FROM (SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2) " +
                "FROM Reviews " +
                "GROUP BY Reviews.Email " +
                `HAVING AVG(Reviews.Rating)>=$${count++}) as Temp`);
        params.push(rating);
    }

    if (subjects) {
        let placeholders = [];
        for (let i = 0; i < subjects.length; i++) {
            placeholders.push(`($${count++}, $${count++})`);
        }

        queries.push("SELECT DISTINCT t.Email " +
                "FROM Tutors t " +
                "WHERE NOT EXISTS (" +
                    "(SELECT s.Course, s.Level " +
                    "FROM Subjects s " +
                    `WHERE (s.Course, s.Level) IN (${placeholders.join(', ')})) ` +
                    "EXCEPT " +
                    "(SELECT ts.Course, ts.Level " +
                    "FROM TutorSubjects ts " +
                    "WHERE ts.email = t.email)" +
                ")");
        params = params.concat(subjects.flatMap(s => s.split('-')));
    }

    if (organizations) {
        queries.push("SELECT DISTINCT t.Email " +
                "FROM Tutors t, Organizations o " +
                "WHERE t.OrgID=o.OrgID " +
                `AND o.OrgID = ANY ($${count++})`);
        params.push(organizations.map(o => parseInt(o, 10)));
    }

    if (qualifications) {
        queries.push("SELECT DISTINCT t.Email " +
                "FROM Tutors t, TutorQualifications q " +
                "WHERE t.Email=q.Email " +
                `AND q.Name = ANY ($${count++})`);
        params.push(qualifications);
    }

    if (above_average) {
        queries.push("SELECT DISTINCT Email FROM " +
            "(SELECT Reviews.Email, ROUND(AVG(Reviews.Rating), 2), Temp.Average " +
            "FROM Reviews, Tutors, (" +
                "SELECT Tutors.OrgID, ROUND(AVG(Reviews.Rating), 2) AS Average " +
                "FROM Reviews, Tutors " +
                "WHERE Tutors.Email=Reviews.Email " +
                "GROUP BY Tutors.OrgID) AS Temp " +
            "WHERE Temp.OrgID=Tutors.OrgID AND Tutors.Email=Reviews.Email " +
            "GROUP BY Reviews.Email, Temp.Average " +
            "HAVING AVG(Reviews.Rating) >= Temp.Average) r")
    }

    return [queries, params];
}

// Get tutors based on filters
router.get('/tutors', async (req, res) => {
    let [filter_queries, params] = get_filter_queries(req.query);
    let filter_query;
    if (filter_queries.length > 0) {
        filter_query = filter_queries.map(q => `(${q})`).join(" INTERSECT ");
    } else {
        filter_query = "(SELECT Email FROM Tutors)";
    }

    let avg_ratings_query = "(SELECT t.Email, NULL as AverageRating FROM Tutors t WHERE t.Email NOT IN (SELECT Email FROM Reviews)) UNION " +
        "(SELECT Email, ROUND(AVG(Rating), 2) as AverageRating FROM Reviews GROUP BY Email)";
    let user_query = "SELECT u.FirstName, u.LastName, u.Email, u.PhoneNum, u.DateJoined, t.Availability, t.Summary, o.HourlyRate, r.AverageRating " +
        `FROM Tutors t, Users u, (${filter_query}) ft, OrganizationPayRate o, (${avg_ratings_query}) r ` +
        "WHERE ft.email = t.email AND t.email = u.email AND o.orgID = t.orgID AND r.Email = u.Email"
    let location_query = "SELECT u.Email as TutorEmail, rc.Country, rc.Region, pc.City, u.PostalCode, u.Street, u.HouseNum, tz.TimeZone " +
        `FROM Users u, (${filter_query}) ft, PostalCodeCity pc, PostalCodeRegion pr, RegionCountry rc, TimeZone tz ` +
        "WHERE ft.email = u.email AND u.PostalCode = pc.PostalCode AND u.PostalCode = pr.PostalCode AND pr.Region = rc.Region " +
        "AND pr.Region = tz.Region AND pc.City = tz.City"
    let organization_query = "SELECT t.Email as TutorEmail, o.Email, op.HourlyRate, o.Name, o.OrgID, o.Url " +
        `FROM Tutors t, (${filter_query}) ft, OrganizationPayRate op, Organizations o ` +
        "WHERE ft.email = t.email AND op.orgID = t.orgID AND o.orgID = t.orgID";
    let final_query = "SELECT u.*, to_json(l.*) as Location, to_json(o.*) as Organization " +
        `FROM (${user_query}) u, (${location_query}) l, (${organization_query}) o ` +
        "WHERE u.Email = l.TutorEmail AND u.Email = o.TutorEmail";

    try {
        let result = await pool.query(final_query, params);
        send_success(res, result.rows);
    } catch (error) {
        send_error(res, 400, `Failed to retrieve tutors: ${error}`);
    }
});

// Get all languages a tutor speaks
router.get('/tutor/:email/languages', async (req, res) => {
    const {email} = req.params;
    await query_db("SELECT LangName as Name, Proficiency FROM UserLanguages WHERE Email=$1", [email], res, rows => send_success(res, rows));
});

// Get all subjects a tutor teaches
router.get('/tutor/:email/subjects', async (req, res) => {
    const {email} = req.params;
    await query_db("SELECT s.Course, s.Level, s.Description " +
        "FROM Subjects s, TutorSubjects ts " +
        "WHERE ts.Email=$1 AND s.Course = ts.Course AND s.level = ts.Level",
        [email], res, rows => send_success(res, rows));
});

// Get all qualifications a tutor has
router.get('/tutor/:email/qualifications', async (req, res) => {
    const {email} = req.params;
    await query_db("SELECT TutorQualifications.Name, Qualifications.DateIssued " +
        "FROM Qualifications, TutorQualifications " +
        "WHERE TutorQualifications.Email=$1 AND TutorQualifications.Name=Qualifications.Name",
        [email], res, rows => send_success(res, rows));
});

// Get all reviews a tutor has
router.get('/tutor/:email/reviews', async (req, res) => {
    const {email} = req.params;
    await query_db("SELECT ReviewID, Content, r1.Rating, Recommendation FROM Reviews r1, Ratings r2 WHERE Email=$1 AND r1.Rating = r2.Rating",
        [email], res, rows => send_success(res, rows));
});

// Create a new review for a tutor
router.post('/tutor/:email/reviews', async (req, res) => {
    const {email} = req.params;
    let {rating, content} = req.body;
    content ||= null;

    let query = "INSERT INTO Reviews(Email, Content, Rating) VALUES ($1, $2, $3) RETURNING ReviewID, Content, Rating";
    await query_db(query, [email, content, rating], res, async reviews_rows => {
        await query_db("SELECT Recommendation FROM Ratings WHERE Rating=$1", [rating], res, ratings_rows => {
            send_success(res, Object.assign(reviews_rows[0], ratings_rows[0]));
        });
    });
});

router.get('/tutor_ratings', async (req, res) => {
    await query_db("SELECT Reviews.Email, ROUND(AVG(Reviews.Rating),2) AS TutorAverage, Temp.Average AS OrganizationAverage " +
        "FROM Reviews, Tutors, (SELECT Tutors.OrgID, ROUND(AVG(Reviews.Rating),2) AS Average " +
            "FROM Reviews, Tutors " +
            "WHERE Tutors.Email=Reviews.Email " +
            "GROUP BY Tutors.OrgID) AS Temp " +
        "WHERE Temp.OrgID=Tutors.OrgID AND Tutors.Email=Reviews.Email " +
        "GROUP BY Reviews.Email, Temp.Average " +
        "HAVING AVG(Reviews.Rating) >= Temp.Average", [], res, rows => send_success(res, rows));
});

// Get all countries
router.get('/countries', async (req, res) => {
    await query_db("SELECT DISTINCT Country FROM RegionCountry", [], res, rows => {
        send_success(res, rows.flatMap(r => Object.values(r)));
    });
});

// Get all regions in a country
router.get('/regions/:country', async (req, res) => {
    let {country} = req.params;
    await query_db("SELECT Region FROM RegionCountry WHERE Country=$1", [country], res, rows => {
        send_success(res, rows.flatMap(r => Object.values(r)))
    });
});

// Get all cities in a region
router.get('/cities/:region', async (req, res) => {
    let {region} = req.params;
    await query_db("SELECT DISTINCT City FROM TimeZone WHERE Region=$1", [region], res, rows => {
        send_success(res, rows.flatMap(r => Object.values(r)));
    });
});

function select_all(response: Response, table: string): Promise<any[]> {
    return query_db(`SELECT * FROM ${table}`, [], response, rows => send_success(response, rows));
}

// Get all subjects
router.get('/subjects', async (req, res) => await select_all(res, "Subjects"));

// Get all organizations
router.get('/organizations', async (req, res) => await select_all(res, "Organizations"));

// Get all qualifications
router.get('/qualifications', async (req, res) => await select_all(res, "Qualifications"));

// Get all languages
router.get('/languages', async (req, res) => {
    await query_db("SELECT * FROM Languages", [], res, rows => {
        send_success(res, rows.flatMap(r => Object.values(r)));
    });
});

router.get('/selection', async (req, res) => {
    const table = req.query.table as string;
    const attributes = req.query.attributes as string[] || [];
    const condition_value = req.query.condition_value as number | string;

    if (table.toLowerCase() === "organizations") {
        const attributes_string = attributes
            .filter(x => ["name", "url", "email"].includes(x.toLowerCase()))
            .map(x => `o.${x.toLowerCase()}`)
            .join(", ");
        let default_select = "SELECT o.orgID, Temp.Count".concat((attributes_string.length > 0) ? "," : "");
        let query = `${default_select} ${attributes_string} ` +
            "FROM Organizations o, (SELECT Organizations.OrgID, COUNT(Tutors.Email) " +
                "FROM Tutors, Organizations " +
                "WHERE Tutors.OrgID = Organizations.OrgID " +
                "GROUP BY Organizations.OrgID " +
                "HAVING COUNT(Tutors.Email)>=$1 " +
                "ORDER BY Organizations.OrgID ASC " +
                ") AS Temp " +
            "WHERE o.OrgID = Temp.OrgID";
            await query_db(query, [condition_value], res, rows => send_success(res, rows));
    } else if (table.toLowerCase() === "subjects") {
        const attributes_string = attributes
            .filter(x => ["description"].includes(x.toLowerCase()))
            .join(", ");

        let default_select = "SELECT Course, Level".concat((attributes_string.length > 0) ? "," : "");
        await query_db(`${default_select} ${attributes_string} ` +
            "FROM Subjects " +
            "WHERE Subjects.Course = $1", [condition_value], res, rows => send_success(res, rows));
    } else {
        send_error(res, 400, `Invalid table name: ${table}`);
    }
});

export {router}
