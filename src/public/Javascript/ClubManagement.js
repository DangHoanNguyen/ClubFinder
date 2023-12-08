

const app = new Vue({
    el: "#app",
    data: {
        club:{},
        members: [],
        events: [],
        announcements: [],
        rsvps: [],
        join_requests: [],
        current: 0
    },
    methods: {
        show_members: () => {
            app.current = 0;
            document.getElementById("member-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("event-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("announcement-badge").setAttribute("class","menu-elm fw-bold");
            document.getElementById("request-badge").setAttribute("class","menu-elm fw-bold");
        },
        show_events: () => {
            app.current = 1;
            document.getElementById("event-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("member-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("announcement-badge").setAttribute("class","menu-elm fw-bold");
            document.getElementById("request-badge").setAttribute("class","menu-elm fw-bold");
        },
        show_announcements: () => {
            app.current = 2;
            document.getElementById("announcement-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("member-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("event-badge").setAttribute("class","menu-elm fw-bold");
            document.getElementById("request-badge").setAttribute("class","menu-elm fw-bold");
        },
        show_join_requests: () => {
            app.current = 3;
            document.getElementById("request-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("member-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("event-badge").setAttribute("class","menu-elm fw-bold");
            document.getElementById("announcement-badge").setAttribute("class","menu-elm fw-bold");
        },
        load_members: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if( req.readyState == 4 && req.status == 200) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.members = result;
                }
            }
            req.open('GET', '/user/clubmanagement/load-mems?club_id=' + app.club.club_id);
            req.send();
        },
        load_general_data: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function (){
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.club = result[0];
                    document.getElementById("club-title").innerText += app.club.club_name;
                    app.load_members();
                    app.load_events();
                    app.load_announcements();
                    app.load_join_requests();
                }
            };
            req.open('GET', '/user/clubmanagement/load-managing-club' );
            req.send();

        },
        confirm_delete: (event) => {
            let x = event.target;
            x.removeEventListener('click', app.confirm_delete);
            x.addEventListener('click', app.delete_member);
            x.setAttribute("class", "btn-danger del-btn");
            x.innerText = "DELETE";
        },
        delete_member: (event) => {
            let membership = {u_id: event.target.value, c_id: app.club.club_id};
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if(req.readyState == 4 && req.status == 200) {
                    app.load_members();
                    app.show_members();
                }
            }
            req.open("POST","/user/clubmanagement/delete-member");
            req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(membership));

        },
        load_events: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function (){
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    for (let i = 0; i < result.length; i++){
                        if (result[i].status == 0) {
                            result[i].status = 'Private';
                        }
                        else{
                            result[i].status = 'Public';
                        }
                    }
                    app.events = result;
                    // app.events = result.reverse();
                }
            };
            req.open('GET', '/user/clubmanagement/all-events?club_id=' + app.club.club_id);
            req.send();
        },
        load_announcements: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function (){
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    for (let i = 0; i < result.length; i++){
                        if (result[i].status == 0) {
                            result[i].status = 'Private';
                        }
                        else {
                            result[i].status = 'Public';
                        }
                    }
                    app.announcements = result.reverse();
                    // app.announcements = result;
                }
            };
            req.open('GET', '/user/clubmanagement/all-announcements?club_id=' + app.club.club_id);
            req.send();
        },
        load_join_requests: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function (){
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.join_requests = result;
                }
            };
            req.open('GET', '/user/clubmanagement/load-club-join-req');
            req.send();
        },
        action_requests: (event) => {
            let decision = {user_id: event.target.value, output: event.target.innerText};
            let req = new XMLHttpRequest();
            req.onreadystatechange = function (){
                if (req.status == 200 && req.readyState == 4) {
                    // app.send_email_join_req(decision);
                    app.load_members();
                    app.load_join_requests();
                    app.show_join_requests();
                }
            };
            req.open('POST', '/user/clubmanagement/action-join-req');
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(decision));
        },
        show_add_announcements: () => {
            document.getElementById("add_announcements").style.setProperty("display", "block");

        },
        close_add_announcements: () => {
            document.getElementById("add_announcements").style.setProperty("display", "none");
        },
        show_add_events: () => {
            document.getElementById("add_events").style.setProperty("display", "block");
        },
        close_add_events: () => {
            document.getElementById("add_events").style.setProperty("display", "none");
        },
        delete_event: (event) => {
            let e = {event_id: event.target.parentNode.value};
            console.log(e);
            let req = new XMLHttpRequest();
            req.onreadystatechange = function() {
                if (req.status == 200 && req.readyState == 4) {
                    app.load_events();
                    app.show_events();
                    console.log("yep");
                }
            };
            req.open('POST', '/user/clubmanagement/delete-event');
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(e));
        },
        edit_event: (event) => {
            let row = event.target.parentNode.parentNode.parentNode;
            let id = event.target.parentNode.value;
            let e = app.events[id];
            let stat = 0;
            if (e.status == "Public") {
                stat = 1;
            }
            let template = `<form action="/user/clubmanagement/update-event" method="POST">
                <label for="event-title" class="form-label">Event title:</label><br/>
                <input  type="text" name="title" id="event-title" class="text-ctn" value="${e.event_name}"/><br/>
                <label for="event-place"  class="form-label">Place:</label><br/>
                <input  type="text" name="place" id="event-place" class="text-ctn" value="${e.place}"/><br/>

                <label for="date"  class="form-label">Date: </label><br/>
                <input  type="date" name="date" id="date" min="2023-05-01" max="2033-05-01" class="text-ctn" value=""/><br/>
                <label for="time"  class="form-label">Time: </label><br/>
                <input  type="time" name="time" id="time" min="9:00" max="21:00" class="text-ctn" value=""/><br/>

                <label for="des"  class="form-label">Description:</label><br/>
                <textarea name="des" id="des" class="text-ctn">${e.event_description}</textarea><br/>
                <label for="e-status"  class="form-label">Viewable to: </label>
                <select id="e-status" name="status" class="text-ctn" value="${stat}">
                    <option value="0">Private</option>
                    <option value="1">Public</option>
                </select><br/>
                <input type="submit" value="Confirm" id="submit-form-event" class="btn">
                <input type="button" value="Discard" class="del-btn btn btn-danger" v-on:click="close_edit_event">
            </form>`;
            row.innerHTML = template;
        },
        close_edit_event: () => {
            app.show_events();
        }
    }
});


app.load_general_data();

