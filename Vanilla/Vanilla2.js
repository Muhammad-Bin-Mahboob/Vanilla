// Get the email from the query parameter
var email = new URLSearchParams(window.location.search).get('email');

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var storedEmail = getCookie("email");
    var storedDate = getCookie("email_date");

    var messageContainer = document.getElementById("messages2");

    if (storedEmail != "") {
        // Display email and stored date
        messageContainer.innerHTML = `
            <p>Email: ${storedEmail}</p>
            <p>Date Stored: ${storedDate}</p>
        `;
        
        // Update the stored date to today
        setCookie("email_date", new Date().toISOString().split('T')[0], 365);
    } else if (email) {
        // If no email cookie is found, save the email and today's date
        setCookie("email", email, 365);
        setCookie("email_date", new Date().toISOString().split('T')[0], 365);

        // Display the email and the current date
        messageContainer.innerHTML = `
            <p>Email: ${email}</p>
            <p>Date Stored: ${new Date().toISOString().split('T')[0]}</p>
        `;
    }
}

// Call the checkCookie function when the page loads
window.onload = checkCookie;


