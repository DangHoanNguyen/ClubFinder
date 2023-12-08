import express from "express";
import generalController from "../controllers/generalController"



let router = express.Router();

let initPublicWebRoutes = (app) => {


    /* GET home page. */
    router.get('/', generalController.renderHomepage);

    // Render the log-in page
    router.get('/login', generalController.renderLoginPage);

    // Ensure that the username when signing up is unique
    router.post('/checkusrnexistence', generalController.checkUniqueUsername);

    // Ensure each email is only used for one account
    router.post('/check-email', generalController.checkUniqueEmail);

    router.get('/signup', generalController.loadSignup)
    
    // Create a new account
    router.post('/signup-req', generalController.signupReq);

    // Login to the web app
    router.post('/login-req', generalController.loginReq);

    // Login with Google account
    router.post('/google_login', generalController.googleLoginReq);

    // Check the existence of the email in the database
    router.get('/checkGoogleUserExistence', generalController.checkGoogleUserExistence);

    // Create a new user if the email has not been used
    router.get('/glogin_create_cred', generalController.createGoogleCredential);

    // Load all clubs
    router.get('/load-all-clubs', generalController.loadClubs);

    // Filter clubs by their categories
    router.post('/search-by-category', generalController.filterClubsByCategory);

    // Load all public events of clubs onto the hompage
    router.get('/public-events', generalController.loadPublicEvents);

    // Load specific information of the chosen public event in the homepage
    router.get('/event-detail', generalController.loadPublicEventDetails);

    // Render the homepage of a club
    router.get('/club-page', generalController.renderClubPage);

    // load data of the chosen club
    router.get('/club-page-data', generalController.loadClubData);

    // Load all public events of the chosen club
    router.get('/club-page-events', generalController.loadClubPageEvents);

    // Load all public updates/announcements of the chosen club
    router.get('/club-page-announcements', generalController.loadAnnouncements);

    // Check the role of the current user
    router.get('/check-role', generalController.checkUserRole);

    // Send a request to join a club to its manager
    router.get("/join-req", generalController.clubJoinRequest);

    return app.use("/", router);
}


module.exports = initPublicWebRoutes;