

const homepage = new Vue({
  el: "#app",
  data: {
    clubs: [],
    events: {},
    srch_filt: {},
    event_details: ''
  },
  methods: {
    loadClubs: () => {
      let req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.status == 200 && req.readyState == 4) {
          let result = req.responseText;
          result = JSON.parse(result);
          for (let i = 0; i < result.length; i++) {
            result[i].href = "/club-page?clb=" + result[i].club_id;
          }
          homepage.clubs = result;
        }
      };
      req.open('GET', './load-all-clubs');
      req.send();
    },

    loadEvents: () => {
      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.status == 200 && req.readyState == 4) {
          let result = req.responseText;
          result = JSON.parse(result);
          homepage.events = result.reverse();
        }
      };
      req.open('GET', './public-events');
      req.send();
    },

    showEventDetail: (event) => {
      let event_id = event.target.value;
      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
          let result = req.responseText;
          result = JSON.parse(result);
          homepage.eDetail = result[0];
        }
      };
      req.open("GET", "/event-detail?event_id=" + event_id);
      req.send();

      document.getElementById("event-detail").style.setProperty('display', 'block');
      document.getElementById("main-display").style.setProperty('pointer-events', 'none');
    },

    closeEventDetail: () => {
      document.getElementById("event-detail").style.setProperty('display', 'none');
      document.getElementById("main-display").style.setProperty('pointer-events', 'auto');
    },

    search_clubs: () => {
      let cate = {
        cate: document.getElementById('categories').value,
        title: document.getElementById('search-box').value
      };
      let req = new XMLHttpRequest();
      req.onreadystatechange = function () {
        if (req.status == 200 && req.readyState == 4) {
          let result = req.responseText;
          result = JSON.parse(result);
          for (let i = 0; i < result.length; i++) {
            result[i].href = "/club_page?clb=" + result[i].club_id;
          }
          console.log(result);
          homepage.clubs = result;
        }
      };
      req.open('POST', '/search-by-category');
      req.setRequestHeader('Content-Type', 'application/json');
      req.send(JSON.stringify(cate));
    }


  }
});


homepage.loadClubs();
homepage.loadEvents();

console.log(homepage.events);