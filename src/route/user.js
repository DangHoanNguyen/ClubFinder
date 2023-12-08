import express from "express"
import userController, { deleteMembership } from "../controllers/userController"

let router = express.Router();

let initUserWebRoutes = (app) => {

    // Filter access 1: Only logedin users can access the following routers
    router.use(userController.filter1);

///// GENERAL USERS' ROUTES

    router.get('/logout', userController.logout);

    router.get('/load-joined-clubs', userController.loadJoinedClubOfTheCurrentUser);

    router.get('/profile', userController.renderProfile);

    // Load events of all joined clubs
    router.get('/load-visible-events', userController.loadAllVisibleEvents);

    router.get('/load-profile', userController.loadUserProfile);

    // Load announcements of current joined clubs
    router.get('/load-related-announcements', userController.loadAllRelatedAnnouncements);

    router.post('/updateProfile', userController.adjustUserInformation);

    router.get('/load-rsvp', userController.loadCurrentRSVP);

    router.post('/respond-rsvp', userController.respondRSVP);

    // Update the sent rsvp
    router.post('/reset-rsvp', userController.resetRSVP);



///// ROUTES FOR CLUB MANAGER AND WEB ADMINS
    router.use(userController.filter2);

    //Routes for club management begin
    router.get('/clubmanagement', userController.renderClubManagement);

    router.get('/clubmanagement/load-managing-club', userController.LoadManaingClub);

    router.get('/clubmanagement/load-mems', userController.loadMembers);

    router.get('/clubmanagement/all-announcements', userController.loadAllAnnouncements);

    router.post('/clubmanagement/add-new-announcement', userController.addNewAnnouncement);

    router.post('/clubmanagement/create-new-event', userController.createNewEvent);

    router.post('/clubmanagement/update-event', userController.updateEvent);

    router.post('/clubmanagement/delete-event', userController.deleteEvent);

    router.get('/clubmanagement/all-events', userController.loadAllEvents);

    router.post('/clubmanagement/delete-member', userController.deleteMembership);

    router.get('/clubmanagement/load-club-member-rsvp', userController.loadClubMemberRSVPforAnEvent);

    router.post('/clubmanagement/add-rsvp', userController.addRSVP);

    router.get('/clubmanagement/load-club-join-req', userController.loadJoinRequets);

    router.post('/clubmanagement/action-join-req', userController.acceptOrDenyRequest);
    //Routes for club management end


    //Send Email notification to users in specific cases
    router.post('/send-email-noti', userController.sendEmailNotification);

/////WEB ADMIN's ROUTES

    router.use(userController.filter3);

    router.get("/admin", userController.renderAdmins);

    router.get('/admin/load-general-club-info', userController.loadGeneralClubInfo);

    router.get('/admin/load-all-users', userController.loadAllUsers);

    // Retrieve emails of a club's member to send email
    router.post("/admin/get-club-member-email", userController.loadEmailsOfAllMembersOfAClub);

    router.post('/admin/delete-club', userController.deleteClub);

    router.post('/admin/delete-user', userController.deleteUser);

    // Load all admins' information
    router.get('/admin/load-admins-info', userController.loadAdminInfo);

    // Sign up a new admin
    router.post('/admin/signup-admin-req', userController.signupAdminReq);

    return app.use("/user/", router)
};

module.exports = initUserWebRoutes;