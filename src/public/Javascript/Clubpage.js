

const app = new Vue({
    el: '#app',
    data: {
        name: "",
        goal: "",
        image: "",
        announcements: [],
        events: [],
        eDetail: [],
        members: []
    },
    methods: {
        load_data: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.name = result[0].club_name;
                    app.goal = result[0].club_objective;
                    document.getElementById("clubtitle").innerText = result[0].club_name;
                }
            };
            req.open("GET", "/club-page-data");
            req.send();
        },
        load_events: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.events = result.reverse();
                }
            };
            req.open("GET", "/club-page-events");
            req.send();
        },
        load_announcements: () => {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.announcements = result.reverse();
                }
            };
            req.open("GET", "/club-page-announcements");
            req.send();
        },
        load_all: function () {
            app.load_data();
            app.load_announcements();
            app.load_events();
        },
        close_detail: () => {
            document.getElementById("popup").style.setProperty('display', 'none');
            document.getElementById("primary").style.setProperty('pointer-events', 'auto');
        },
        show_detail: (event) => {
            let ev_id = event.target.value;
            let req = new XMLHttpRequest();
            req.onreadystatechange = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let result = req.responseText;
                    result = JSON.parse(result);
                    app.eDetail = result[0];
                }
            };
            req.open("GET", "/event-detail?event_id=" + ev_id);
            req.send();
            document.getElementById("popup").style.setProperty('display', 'block');
            document.getElementById("primary").style.setProperty('pointer-events', 'none');
        }
    }
});


app.load_all();

const test = () => {
    console.log(app.name);
}