

const app = new Vue({
    el: "#app",
    data: {
        current: 0,
        clubs: [],
        users: [],
        admins: [],
        number_of_users: 0,
        admins: []
    },
    methods: {
        show_admins: () => {
            app.current = 0;
            document.getElementById("admin-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("club-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("user-badge").setAttribute("class","menu-elm fw-bold");
        },
        show_clubs: () => {
            app.current = 1;
            document.getElementById("club-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("admin-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("user-badge").setAttribute("class","menu-elm fw-bold");
        },
        show_users: () => {
            app.current = 2;
            document.getElementById("user-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("admin-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("club-badge").setAttribute("class","menu-elm fw-bold");
        },
        page_init: () => {
            app.load_users();
            app.load_clubs();
            app.load_admins();
        },
        load_users: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;
                    result = JSON.parse(result);

                    app.number_of_users = result.length;
                    app.users = result;
                }
            };
            req.open('GET', '/user/admin/load-all-users');
            req.send();
        },
        confirm_delete: (event) => {
            let x = event.target;
            x.removeEventListener('click', app.confirm_delete);
            x.addEventListener('click', app.delete_user);
            x.setAttribute("class", "btn-danger del-btn");
            x.innerText = "DELETE";
        },
        delete_user: (event) => {
            let user_id = { u_id: event.target.value };
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.status == 200 && req.readyState == 4) {
                    // app.send_noti_usr_del(user_id);
                    app.load_users();
                    app.show_users();
                }
            };
            req.open('POST', '/user/admin/delete-user');
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(user_id));
        },
        load_clubs: () =>{
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    for (let i = 0; i < result.length; i++) {
                        if (!result[i].manager_usrn) {
                            result[i].manager_usrn = "NO MANAGER";
                        }
                    }
                    app.clubs = result;
                    app.num_clubs = result.length;
                }
            };
            req.open('GET', '/user/admin/load-general-club-info');
            req.send();
        },
        confirm_delete_club: (event) => {
            let x = event.target;
            x.removeEventListener('click', app.confirm_delete_club);
            x.addEventListener('click', app.delete_club);
            x.setAttribute("class", "btn-danger del-btn");
            x.innerText = "DELETE";
        },
        delete_club: (event) => {
            let club_id = { c_id: event.target.value };
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.status == 200 && req.readyState == 4) {
                    // app.send_noti_usr_del(user_id);
                    app.load_clubs();
                    app.show_clubs();
                }
            };
            req.open('POST', '/user/admin/delete-club');
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(club_id));
        },
        load_admins: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;

                    app.admins = JSON.parse(result);
                }
            };
            req.open('GET', '/user/admin/load-admins-info');
            req.send();
        },
        show_add_admin: () => {
            document.getElementById("add-admin").style.display = "";
        },
        close_add_admin: () => {
            document.getElementById("add-admin").style.display = "none"
        }
    }
});

app.page_init();
