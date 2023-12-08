const app = new Vue({
    el: "#app",
    data: {
        current: 0,
        clubs: [],
        rsvp:[],
        information: [],
        isAManager: 0
    },
    methods: {
        pageinit: () => {
            app.loadinfo();
            app.load_clubs();
            app.load_rsvp();

        },

        showinfo: () => {
            app.current = 0;
            document.getElementById("info-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("rsvp-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("club-badge").setAttribute("class","menu-elm fw-bold");
        },
        showclubs: () => {
            app.current = 1;
            document.getElementById("club-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("info-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("rsvp-badge").setAttribute("class","menu-elm fw-bold");
        },
        showrsvp: () => {
            app.current = 2;
            document.getElementById("rsvp-badge").setAttribute("class","chosen fw-bold" );
            document.getElementById("info-badge").setAttribute("class", "menu-elm fw-bold");
            document.getElementById("club-badge").setAttribute("class","menu-elm fw-bold");
        },

        loadinfo: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.status == 200 && req.readyState == 4) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    if (result[0].gender == "m") {
                        result[0].gender = "Male";
                    }
                    if (result[0].gender == "f") {
                        result[0].gender = "Female";
                    }
                    if (result[0].role_id == 1) {
                        app.isAManager = true;
                    }
                    app.information = result[0];

                }
            };
            req.open('GET', '/user/load-profile');
            req.send();  
        },

        load_clubs: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if( req.readyState == 4 && req.status == 200) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    for (let i = 0; i < result.length; i++) {
                        result[i].pagesrc = "/club-page?clb=" + result[i].club_id;
                    }
                    app.clubs = result;
                }
            }
            req.open("GET", "/user/load-joined-clubs");
            req.send();
        },

        load_rsvp: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if(req.readyState == 4 && req.status == 200) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.rsvp = result;
                }
            }
            req.open('GET', '/user/load-rsvp');
            req.send();
        },

        answer_rsvp: (event) => {
            let response = {r_id: event.target.value, 
                        rsvp_rep: event.target.innerText};

            let req = new XMLHttpRequest();
            req.onreadystatechange = () => {
                if(req.readyState == 4 && req.status == 200){
                    app.load_rsvp();
                }
            }
            req.open("POST", "/user/respond-rsvp");
            req.setRequestHeader("Content-Type","application/json");
            req.send(JSON.stringify(response));
        },

        edit: (event) => {
            let target = {r_id: event.target.value};
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.status == 200 && req.readyState == 4) {
                    app.load_rsvp();
                }
            };
            req.open('POST', '/user/reset-rsvp');
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(target));
        }   

    }
});

app.pageinit();