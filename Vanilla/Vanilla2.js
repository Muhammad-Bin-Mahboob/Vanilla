// Obtener el email del parámetro en la URL 
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
    var lastAccessDate = getCookie(storedEmail + "_last_access_date") || 'N/A'; // Asegurando que no esté vacío
    var previousAccessDate = getCookie(storedEmail + "_previous_access_date") || 'N/A'; // Puede ser N/A si no existe

    var messageContainer = document.getElementById("messages2");

    var now = new Date();

    // Obtener los componentes de fecha y hora
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Mes (0-11) + 1
    const day = now.getDate(); // Día
    const hours = now.getHours(); // Horas
    const minutes = now.getMinutes(); // Minutos
    const seconds = now.getSeconds(); // Segundos

    // Construir la cadena en formato "YYYY-MM-DD HH:MM:SS"
    const currentDate = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

    if (email) {
        // Si el email es nuevo o ha cambiado, actualizar cookies
        if (storedEmail !== email) {
            // Guardamos la fecha de acceso actual como 'previous_access_date' antes de actualizar
            setCookie(storedEmail + "_previous_access_date", lastAccessDate, 365);
            setCookie("email", email, 365);
            setCookie(email + "_last_access_date", currentDate, 365);
            setCookie(email + "_previous_access_date", currentDate, 365);

            // Mostrar el nuevo email y las fechas
            messageContainer.innerHTML = 
                '<p>Email: ' + email + '</p>' +
                '<p>Current Access Date: ' + currentDate + '</p>'; 
                // Mostrar solo el "current access" la primera vez

        } else {
            // Si el email no ha cambiado, solo actualizar las fechas
            setCookie(email + "_previous_access_date", lastAccessDate, 365);
            setCookie(email + "_last_access_date", currentDate, 365);

            // Mostrar el email y las fechas actualizadas
            messageContainer.innerHTML = 
                '<p>Email: ' + storedEmail + '</p>' +
                '<p>Previous Access Date: ' + previousAccessDate + '</p>';
        }
    } else if (storedEmail) {
        // Si no hay nuevo email, solo actualizar las fechas
        if (!previousAccessDate) {
            previousAccessDate = currentDate;  // Si no existe la cookie de 'previous_access_date', es la primera vez
        }
        
        setCookie(storedEmail + "_previous_access_date", lastAccessDate, 365);
        setCookie(storedEmail + "_last_access_date", currentDate, 365);

        // Mostrar el email y las fechas actualizadas
        messageContainer.innerHTML = 
            '<p>Email: ' + storedEmail + '</p>' +
            '<p>Previous Access Date: ' + previousAccessDate + '</p>';
    }
}

// Llamar a la función checkCookie cuando cargue la página
window.onload = checkCookie;

// Redirigir a la página Vanilla3.html con el email como parámetro en la URL al hacer clic en el botón
var boton = document.getElementById('btn');
if (boton) {
    boton.addEventListener('click', changepage);
}

function changepage(event) {
    event.preventDefault();

    if (email) {
        window.location.href = 'Vanilla3.html?email=' + email;
    }
}



