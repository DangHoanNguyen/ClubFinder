import argon2 from 'argon2';
require("dotenv").config();

const CLIENT_ID = '1097965274780-1kstlnt1lqh3kmu6shlt6bqk8hd7t68t.apps.googleusercontent.com';

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

let renderHomepage = (req, res, next) => {
    return res.render('Homepage.ejs');
};

let renderLoginPage = (req, res, next) => {
    if (req.session.user_id) {
        return res.redirect('/user/profile');

    }
    return res.render('Login.ejs')
};

let sendclientid = (req, res, next) => {
    return res.send(CLIENT_ID);
}

//When signing up
let checkUniqueUsername = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = "SELECT username FROM users;";
        connection.query(query, (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            for (let i = 0; i < result['rows'].length; i++) {
                if (result['rows'][i].username == req.body.username) {
                    return res.send('found');
                }
            }
            return res.send('notfound');
        });
    });
};

let checkUniqueEmail = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = "SELECT email FROM users;";
        connection.query(query, (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            for (let i = 0; i < result['rows'].length; i++) {
                if (result['rows'][i].email == req.body.email) {
                    req.session.accept_change = 0;
                    console.log(result['rows'][i].email);
                    return res.send('found');
                }
            }
            req.session.accept_change = 1;
            return res.send('notfound');
        });
    });
};

let loadSignup = (req, res, next) => {
    return res.render("Signup.ejs");
}

//Creating a new account
let signupReq = (req, res, next) => {
    req.pool.connect(async (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let pass = await argon2.hash(req.body.password);
        let gend = 'x';
        if (req.body.gender === 'Male') {
            gend = 'm';
        }
        if (req.body.gender === 'Female') {
            gend = 'f';
        }
        let query = `INSERT INTO users (username, password_, first_name, last_name, age, gender, email)
            SELECT $1, $2, $3, $4, $5, $6, $7
            WHERE NOT EXISTS (
              SELECT 1 FROM users WHERE username = $8
            )
            AND NOT EXISTS (
              SELECT 1 FROM users WHERE email = $9
            );`;
        connection.query(query, [req.body.username, pass, req.body.firstname, req.body.lastname, req.body.age, gend, req.body.email, req.body.username, req.body.email], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.redirect("login");
        });
    });
};


let loginReq = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = "SELECT username, password_, role_id, user_id, email FROM users WHERE username = $1;";
        connection.query(query, [req.body.username], async (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            if (result['rows'].length !== 0) {
                if (await argon2.verify(result['rows'][0].password_, req.body.password)) {
                    req.session.user_id = result['rows'][0].user_id;
                    req.session.role_id = result['rows'][0].role_id;
                    req.session.email = result['rows'][0].email;

                    let role = req.session.role_id;
                    if (role == 1) {
                        return res.redirect('/user/clubmanagement');
                    }
                    if (role == 0) {
                        return res.redirect('/user/admin');
                    }
                    return res.redirect('/user/profile?user_name=' + result['rows'][0].username);
                }
            }
            return res.sendStatus(403);
        });
    });
};



// Login with google credential
let googleLoginReq = async (req, res, next) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: CLIENT_ID
        });

        const payload = ticket.getPayload();

        req.session.email = payload['email'];
        return res.redirect('/checkGoogleUserExistence');
    }
    catch (eror) {
        console.error("Error: ", eror);
    }
};

let checkGoogleUserExistence = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `SELECT user_id, role_id
            FROM users
            WHERE email = $1;`;
        connection.query(query, [req.session.email], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }

            if (result['rows'].length != 0) {
                req.session.user_id = result['rows'][0].user_id;
                req.session.role_id = result['rows'][0].role_id;
                if (req.session.role_id == 0) {
                    return res.redirect('user/admin');
                }
                else if (req.session.role_id == 1) {
                    return res.redirect('/user/clubmanagement')
                }
                else {
                    return res.redirect('/login');
                }
            }
            else {
                return res.redirect('/glogin_create_cred');
            }
        });
    });
};

// Creating an account for google login when the used gmail is not found in the database
let createGoogleCredential = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `INSERT INTO users (email)
            SELECT $1
            WHERE NOT EXISTS(
              SELECT 1 FROM users WHERE email = $2
            );`;
        connection.query(query, [req.session.email, req.session.email], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.redirect('/login');
        });
    });
};

let loadClubs = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            console.log(err);
            return res.send(500);
        }
        let query = `SELECT club_name, club_objective, club_id
            FROM clubs;`;
        connection.query(query, (eror, result, field) => {
            connection.release();
            if (eror) {
                console.log(eror)
                return res.send(500);
            }
            return res.json(result['rows']);
        });
    });
};

// filter the club list by catergories
let filterClubsByCategory = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let title = '%';
        let query = `SELECT DISTINCT clubs.club_name, clubs.club_objective, clubs.club_id
            FROM clubs
            INNER JOIN club_categories
            ON clubs.club_id = club_categories.club_id
            WHERE clubs.club_name LIKE $1 `;
        if (req.body.cate == '%') {
            query += ';';
        }
        else {
            query += `AND club_categories.category = $1;`;
        }

        if (req.body.title != '%') {
            title += req.body.title + '%';
        }
        connection.query(query, [title, req.body.cate], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadPublicEvents = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            console.log(err);
            throw(err);
            return res.sendStatus(500);
        }
        let query = `SELECT event_name, event_description, event_id, date_of_event, place
            FROM club_events
            WHERE status = 1
            AND date_of_event >= current_date;`;
        connection.query(query, (eror, result, field) => {
            connection.release();
            if (eror) {
                console.log(eror);
                throw(eror)
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadPublicEventDetails = (req, res, next) => {
    let e_id = req.query.event_id;
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let id = req.session.club_id;
        let query = `SELECT event_name, event_description, date_of_event, place
            FROM club_events
            WHERE event_id = $1;`;
        connection.query(query, [e_id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let renderClubPage = (req, res, next) => {

    if ('clb' in req.query) {
        req.session.club_id = req.query.clb;
    }
    return res.render('Clubpage.ejs');
};

let loadClubData = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let id = req.session.club_id;
        let query = `SELECT club_name, club_objective
            FROM clubs
            WHERE club_id = $1;`;
        connection.query(query, [id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadClubPageEvents = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let id = req.session.club_id;
        let query = `SELECT event_name, event_description, event_id
            FROM club_events
            WHERE club_id = $1
            AND status = 1
            AND date_of_event >= current_date;`;
        connection.query(query, [id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadAnnouncements = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return es.sendStatus(500);
        }
        let id = req.session.club_id;
        let query = `SELECT announcements, title
            FROM announcements
            WHERE club_id = $1
            AND status = 1;`;
        connection.query(query, [id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let checkUserRole = (req, res, next) => {
    let result = { check: false };
    if (req.session.role_id == 0) {
        result = { check: true };
    }
    return res.json(result);
};

//Send a reqest to join a club
let clubJoinRequest = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }

    let u_id = req.session.user_id;
    let c_id = req.query.club_id;
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `INSERT INTO join_request (user_id, club_id)
              SELECT $1, $2
              WHERE NOT EXISTS (
                SELECT 1 FROM membership WHERE user_id = $3 AND club_id = $4
              )
              AND NOT EXISTS (
                SELECT 1 FROM join_request WHERE user_id = $5 AND club_id = $6
              );`;
        connection.query(query, [u_id, c_id, u_id, c_id, u_id, c_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.redirect('/');
        });
    });

}

module.exports = {
    renderHomepage: renderHomepage,
    renderLoginPage: renderLoginPage,
    checkUniqueUsername: checkUniqueUsername,
    checkUniqueEmail: checkUniqueEmail,
    signupReq: signupReq,
    loginReq: loginReq,
    googleLoginReq: googleLoginReq,
    checkGoogleUserExistence: checkGoogleUserExistence,
    createGoogleCredential: createGoogleCredential,
    loadClubs: loadClubs,
    filterClubsByCategory: filterClubsByCategory,
    loadPublicEvents: loadPublicEvents,
    loadPublicEventDetails: loadPublicEventDetails,
    renderClubPage: renderClubPage,
    loadClubData: loadClubData,
    loadClubPageEvents: loadClubPageEvents,
    loadAnnouncements: loadAnnouncements,
    checkUserRole: checkUserRole,
    clubJoinRequest: clubJoinRequest,
    loadSignup:loadSignup,
    sendclientid: sendclientid,
};