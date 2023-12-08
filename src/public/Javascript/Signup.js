let c1 = false;
let c2 = false;
let c3 = false;


let conditionCheck = () => {
    submit_btn = document.getElementById("submit-btn")
    if (c1 && c2 && c3) {
        submit_btn.disabled = false;
        submit_btn.style.setProperty("background-color", "#0092a6");
    }
    else {
        submit_btn.disabled = true;
        submit_btn.style.setProperty("background-color", "grey");
    }
}


let checkUsernameExistence = () => {
    let usrn = document.getElementById("username").value;
    let u = {username: usrn};
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            let result = req.responseText;
            let alert = document.getElementById('usernamealert').style;
                if (result == "found") {
                    alert.setProperty("display", "");
                    c1 = false;
                }
                else if (result == "notfound") {
                    alert.setProperty("display", "none");
                    c1 = true;
                }
        }
    }

    req.open('POST', '/checkusrnexistence');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(u));
}

let checkRepeatP = () => {
    let password = document.getElementById("password").value;
    let confirm_password = document.getElementById("confirm-password").value;
    let alert = document.getElementById("passwordalert");
    if (password != confirm_password) {
        alert.style.display = "";
        c2 = false;
    }
    else {
        alert.style.display = "none";
        c2 = true;
    }
}

let checkEmailExistence = () => {
    let email = document.getElementById("email").value;
    let e = {email: email};
    let req = new XMLHttpRequest();
    req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
            let result = req.responseText;
            let alert = document.getElementById('emailalert').style;
            if (result == "found") {
                alert.setProperty("display", "");
                c3 = false;
            }
            else if (result == "notfound") {
                alert.setProperty("display", "none");
                c3 = true;
            }
        }
    }

    req.open('POST', '/check-email');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(e));
}

let print_cond = () => {
    console.log(c1);
    console.log(c2);
    console.log(c3);
}
