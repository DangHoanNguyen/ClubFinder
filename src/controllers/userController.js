import argon2 from 'argon2';
var nodemailer = require('nodemailer');


let filter1 = (req, res, next) => {
    if (req.session.id) {
        next();
    }
    else {
        return res.sendStatus(403);
    }
};

let logout = (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) {
            console.eror(err);
            return;
        }
        return res.redirect('/login');
    });
};

let renderProfile = (req, res, next) => {
    return res.render('profile.ejs')
} 


let loadJoinedClubOfTheCurrentUser = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let u_id = req.session.user_id;
        let query = `SELECT clubs.club_name, clubs.img, clubs.club_id FROM clubs
              INNER JOIN membership
              ON membership.club_id = clubs.club_id
              WHERE membership.user_id = $1;`;
        connection.query(query, [u_id],(eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadAllVisibleEvents = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let u_id = req.session.user_id;
        let query = `SELECT club_events.event_id, club_events.event_name, club_events.date_of_event, club_events.place, clubs.club_name, club_events.status, club_events.event_description
                  FROM club_events
                  INNER JOIN clubs
                  ON club_events.club_id = clubs.club_id
                  INNER JOIN membership
                  ON membership.club_id = clubs.club_id
                  WHERE membership.user_id = $1
                  AND club_events.date_of_event >= current_date;`;
        connection.query(query, [u_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadUserProfile = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let u_id = req.session.user_id;
        let query = `SELECT first_name, last_name, age, gender, email, username, role_id
                  FROM users
                  WHERE user_id = $1;`;
        connection.query(query, [u_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
}


//Announcement from all club that the current user is joining
let loadAllRelatedAnnouncements = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let u_id = req.session.user_id;
        let query = `SELECT clubs.club_name, announcements.announcements, announcements.status, announcements.title
                  FROM membership
                  INNER JOIN clubs
                  ON membership.club_id = clubs.club_id
                  INNER JOIN announcements
                  ON clubs.club_id = announcements.club_id
                  WHERE membership.user_id = $1;`;
        connection.query(query, [u_id], function (eror, result, fields) {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let adjustUserInformation = (req, res, next) => {
    if (req.session.accept_change == 0) {
        return res.redirect('/personal_page.html');
    }
    let fn = req.body.firstname;
    let ln = req.body.lastname;
    let a = req.body.age;
    let g = req.body.gender.toLowerCase();
    if (g == "male") {
        g = 'm';
    }
    else if (g == "female") {
        g = 'f';
    }
    else {
        g = 'x';
    }

    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `UPDATE users
                  SET last_name = $1, first_name = $2, age = $3, gender = $4
                  WHERE user_id = $5;`;
        connection.query(query, [ln, fn, a, g, req.session.user_id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            if (req.session.role_id == 0) {
                return res.redirect('/admin.html');
            }
            return res.redirect('/login');
        });
    });
};

let loadCurrentRSVP = (req, res, next) => {
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let u_id = req.session.user_id;
        let query = `SELECT club_events.event_name, club_events.place, club_events.date_of_event, rsvp.status, rsvp.rep, rsvp.rsvp_id
                  FROM club_events
                  INNER JOIN rsvp
                  ON club_events.event_id = rsvp.event_id
                  WHERE rsvp.user_id = $1;`;
        connection.query(query, [u_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let respondRSVP = (req, res, next) => {
    let id = req.body.r_id;
    let rep = 0;
    if (req.body.rsvp_rep == "YES") {
        rep = 1;
    }
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `UPDATE rsvp
                  SET status = 1, rep = $1
                  WHERE rsvp_id = $2;`;
        connection.query(query, [rep, id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.end();
        });
    });
};

let resetRSVP = (req, res, next) => {
    let id = req.body.r_id;
    let rep = null;
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `UPDATE rsvp
                  SET status = 0, rep = $1
                  WHERE rsvp_id = $2;`;
        connection.query(query, [rep, id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.end();
        });
    });
};

// Preventing normal users from accessing admin and club manager routes
let filter2 = (req, res, next) => {
    if (req.session.role_id == 1 || req.session.role_id == 0) {
        next();
    }
    else {
        return res.sendStatus(403);
    }
};

let renderClubManagement = (req, res, next) => {
    return res.render("ClubManagement.ejs");
}

let LoadManaingClub = (req, res, next) => {
    //this_club_id is the id of the club that the current user manage => ensure that managers can only manage their own club
    req.session.this_club_id = -1;
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let u_id = req.session.user_id;
        let query = `SELECT clubs.club_id, clubs.club_name
                  FROM clubs
                  INNER JOIN users
                  ON clubs.manager_usrn = users.username
                  WHERE users.user_id = $1;`;
        connection.query(query, [u_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            if (result['rows'].length != 0) {
                req.session.this_club_id = result['rows'][0].club_id;
            }

            return res.json(result['rows']);
        });
    });
};

let loadMembers = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let c_id = req.query.club_id;
        if (!req.query.club_id) {
            c_id = req.session.club_id;
        }
        if (c_id != req.session.this_club_id && req.session.role_id == 1) {
            return res.sendStatus(403);
        }
        let query = `SELECT users.username, users.user_id, users.age, users.gender, users.email, users.first_name, users.last_name
                  FROM users
                  INNER JOIN membership
                  ON users.user_id = membership.user_id
                  WHERE membership.club_id = $1;`;
        connection.query(query, [c_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadAllAnnouncements = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let id = req.query.club_id;
        if (!req.query.club_id) {
            id = req.session.club_id;
        }
        if (id != req.session.this_club_id && req.session.role_id == 1) {
            return res.sendStatus(403);
        }
        let query = `SELECT announcements, title, announcement_id, status
                  FROM announcements
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

let addNewAnnouncement = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `INSERT INTO announcements (club_id, announcements, title, status)
                  VALUES ($1, $2, $3, $4);`;
        connection.query(query, [req.session.this_club_id, req.body.announcements, req.body.title, req.body.status], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.redirect('/user/clubmanagement');
        });
    });
};

let createNewEvent = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let date = req.body.date + 'T' + req.body.time + ':00Z';
        date = new Date(date);
        console.log(date);
        let query = `INSERT INTO club_events (club_id, event_name, event_description, date_of_event, place, status)
                  VALUES ($1, $2, $3, $4, $5, $6);`;
        connection.query(query, [req.session.this_club_id, req.body.title, req.body.des, date, req.body.place, req.body.status], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.redirect('/user/clubmanagement');
        });
    });
};

let updateEvent = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let date = req.body.date + ' ' + req.body.time;
        let query = `UPDATE club_events
                  SET event_name = $1, event_description = $2, date_of_event = $3, place = $4, status = $5
                  WHERE event_id = $6
                  AND club_id = $7;`;
        connection.query(query, [req.body.title,
        req.body.des, date,
        req.body.place,
        req.body.status,
        req.body.e_id,
        req.session.this_club_id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.redirect('/clubmanagement');
        });
    });
};

let deleteEvent = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `DELETE FROM club_events WHERE event_id = $1 AND club_id = $2;`;
        connection.query(query, [req.body.event_id,
        req.session.this_club_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            console.log("fisnished");
            console.log(req.body.event_id);
            return res.end();
        });
    });
};

let loadAllEvents = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let id = req.query.club_id;
        if (!req.query.club_id) {
            id = req.session.club_id;
        }
        if (id != req.session.this_club_id && req.session.role_id == 1) {
            return res.sendStatus(403);
        }
        let query = `SELECT event_name, event_description, event_id, place, date_of_event, status
                  FROM club_events
                  WHERE club_id = $1
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

let deleteMembership = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let uid = req.body.u_id;
        let cid = req.body.c_id;

        let query = `DELETE FROM membership
                  WHERE club_id = $1
                  AND user_id = $2;`;
        connection.query(query, [cid, uid],  (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.end();
        });
    });
};

let loadClubMemberRSVPforAnEvent =  (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        if (!req.query.event_id) {
            return res.end();
        }
        let e_id = req.query.event_id;
        let c_id = req.session.this_club_id;
        let query = `SELECT users.username, users.user_id, users.email, rsvp.rep
                  FROM users
                  INNER JOIN rsvp
                  ON rsvp.user_id = users.user_id
                  INNER JOIN club_events
                  ON club_events.event_id = rsvp.event_id
                  WHERE rsvp.event_id = $1
                  AND club_events.club_id = $2;`;
        connection.query(query, [e_id, c_id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let addRSVP = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let u_id = req.body.user_id;
        let e_id = req.body.event_id;
        let query = `INSERT INTO rsvp (user_id, event_id)
                  SELECT $1, $2
                  WHERE NOT EXISTS (
                    SELECT 1 FROM rsvp WHERE user_id = $3 AND event_id = $4
                  )`;
        connection.query(query, [u_id, e_id, u_id, e_id], (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.end();
        });
    });
};

let loadJoinRequets =  (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let c_id = req.session.this_club_id;
        let query = `SELECT join_request.request_id, join_request.user_id, users.username, users.email
                  FROM join_request
                  INNER JOIN users
                  ON join_request.user_id = users.user_id
                  WHERE join_request.club_id = $1;`;
        connection.query(query, [c_id],  (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let acceptOrDenyRequest = (req, res, next) => {
    let c_id = req.session.this_club_id;
    let op = req.body.output;
    let u_id = req.body.user_id;
    req.pool.connect((err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `DELETE FROM join_request WHERE user_id = $1 AND club_id = $2;`;
        let query1 = `INSERT INTO membership (user_id, club_id) SELECT $3, $4
                    WHERE NOT EXISTS (
                      SELECT 1 FROM membership WHERE user_id = $5 AND club_id = $6
                    );`;

        connection.query(query, [u_id, c_id], (eror, result, field) => {
            if (eror) {
                return res.sendStatus(500);
            }
        });
        if (op == "Accept") {

            connection.query(query1, [u_id, c_id, u_id, c_id], (eror, result, field) => {
                connection.release();
                if (eror) {
                    return res.sendStatus(500);
                }
            });
        }
        else {
            query = `DELETE FROM join_request
                WHERE user_id = $1
                AND club_id = $2;`;
            connection.query(query, [u_id, c_id], function (eror, result, field) {
                connection.release();
                if (eror) {
                    return res.sendStatus(500);
                }
            });
        }
        return res.end();
    });
};

let sendEmailNotification =  async (req, res, next) => {
    let testAccount = await nodemailer.createTestAccount();

    let sendr = req.body.sender + '<' + req.session.email + '>';
    let recvr = req.body.receiver;
    let t1 = req.body.text1;
    let t2 = req.body.text2;
    let plain = t1 + ' ' + t2;
    let fancy_text = '<h3>' + t1 + '</h3>' + '<pre>' + t2 + '</pre>';

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    let info = await transporter.sendMail({
        from: sendr,
        to: recvr,
        text: plain,
        html: fancy_text,
    });
    console.log("URL for preview: ", nodemailer.getTestMessageUrl(info));
    return res.end();
};

let filter3 = (req, res, next) => {
    if (req.session.role_id == 0) {
        next();
    }
    else {
        return res.sendStatus(403);
    }
};

let loadGeneralClubInfo =  (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `SELECT clubs.club_name, clubs.club_id, clubs.manager_usrn,
                  (SELECT COUNT(distinct membership.user_id) FROM membership WHERE membership.club_id = clubs.club_id) as num_mem
                  FROM clubs;`;
        connection.query(query, (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadAllUsers =  (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `SELECT user_id, username, role_id, first_name, last_name, email, gender, age FROM users WHERE role_id != 0;`;
        connection.query(query,  (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let loadEmailsOfAllMembersOfAClub = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `SELECT users.email
                  FROM users
                  INNER JOIN membership
                  ON users.user_id = membership.user_id
                  WHERE membership.club_id = $1;`;
        connection.query(query, [req.body.club_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let deleteClub = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `DELETE FROM clubs WHERE club_id = $1`;
        connection.query(query, [req.body.c_id],  (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.end();
        });
    });
};

let deleteUser = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `DELETE FROM users WHERE user_id = $1`;
        connection.query(query, [req.body.u_id], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.end();
            // res.send('yes');
        });
    });
};

let renderAdmins = (req, res, next) => {
    return res.render("Admin.ejs");
}

let loadAdminInfo = (req, res, next) => {
    req.pool.connect( (err, connection) => {
        if (err) {
            return res.sendStatus(500);
        }
        let query = `SELECT user_id, username, first_name, last_name, email, gender, age FROM users WHERE role_id = 0;`;
        connection.query(query, (eror, result, field) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.json(result['rows']);
        });
    });
};

let signupAdminReq = (req, res, next) => {
    req.pool.connect(async (err, connection) => {
        if (err) {
            return tres.sendStatus(500);
        }
        let pass = await argon2.hash(req.body.password);
        let gend = 'x';
        if (req.body.gender === 'Male') {
            gend = 'm';
        }
        if (req.body.gender === 'Female') {
            gend = 'f';
        }
        let query = `INSERT INTO users (username, password_, first_name, last_name, age, gender, email, role_id)
                  SELECT $1, $2, $3, $4, $5, $6, $7, 0
                  WHERE NOT EXISTS (
                    SELECT 1 FROM users WHERE username = $8
                  )
                  AND NOT EXISTS(
                    SELECT 1 FROM users WHERE email = $9
                  );`;
        connection.query(query, [req.body.username, pass, req.body.firstname, req.body.lastname, req.body.age, gend, req.body.email, req.body.username, req.body.email], (eror, result, fields) => {
            connection.release();
            if (eror) {
                return res.sendStatus(500);
            }
            return res.redirect('/user/admin');
        });
    });
};



module.exports = {
    filter1: filter1,
    logout: logout,
    loadJoinedClubOfTheCurrentUser: loadJoinedClubOfTheCurrentUser,
    loadAllVisibleEvents: loadAllVisibleEvents,
    loadUserProfile: loadUserProfile,
    loadAllRelatedAnnouncements: loadAllRelatedAnnouncements,
    adjustUserInformation: adjustUserInformation,
    loadCurrentRSVP: loadCurrentRSVP,
    respondRSVP: respondRSVP,
    resetRSVP: resetRSVP,
    filter2: filter2,
    LoadManaingClub: LoadManaingClub,
    loadMembers: loadMembers,
    loadAllAnnouncements: loadAllAnnouncements,
    addNewAnnouncement: addNewAnnouncement,
    createNewEvent: createNewEvent,
    updateEvent: updateEvent,
    deleteEvent: deleteEvent,
    loadAllEvents: loadAllEvents,
    deleteMembership: deleteMembership,
    loadClubMemberRSVPforAnEvent: loadClubMemberRSVPforAnEvent,
    addRSVP: addRSVP,
    loadJoinRequets: loadJoinRequets,
    acceptOrDenyRequest: acceptOrDenyRequest,
    sendEmailNotification: sendEmailNotification,
    filter3: filter3,
    loadGeneralClubInfo: loadGeneralClubInfo,
    loadAllUsers: loadAllUsers,
    loadEmailsOfAllMembersOfAClub: loadEmailsOfAllMembersOfAClub,
    deleteClub: deleteClub,
    deleteUser: deleteUser,
    loadAdminInfo: loadAdminInfo,
    signupAdminReq: signupAdminReq,
    renderProfile: renderProfile,
    renderClubManagement: renderClubManagement,
    renderAdmins: renderAdmins,
}