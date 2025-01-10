var messageContainer = document.getElementById('messages');

var welcomeMessage = document.createElement('p');
welcomeMessage.textContent = 'Bienvenido, pulsa Control + F10 o espera 5 segundos';
messageContainer.appendChild(welcomeMessage);

setTimeout(showUserInputAgain, 5000);

document.addEventListener('keydown', handleControlF10);

function handleControlF10(event) {
    if (event.key === 'F10' && event.ctrlKey) {
        messageContainer.innerHTML = '';
        var userTitle = document.createElement('h3');
        userTitle.textContent = 'Usuario';
        messageContainer.appendChild(userTitle);

        var userInput = document.createElement('input');
        userInput.id = 'user';

        // Solo valida el correo si el usuario ha terminado de escribir y hace blur
        userInput.addEventListener('blur', function() {
            validateEmail(userInput);
        });

        messageContainer.appendChild(userInput);
    }
}

function showUserInputAgain() {
    messageContainer.innerHTML = '';
    var userTitle = document.createElement('h3');
    userTitle.textContent = 'Usuario';
    messageContainer.appendChild(userTitle);

    var userInput = document.createElement('input');
    userInput.id = 'user';
    
    // Validación cuando el campo pierde el foco
    userInput.addEventListener('blur', function() {
        var email = userInput.value;
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        // Validación solo cuando el campo tiene texto y el formato es incorrecto
        if (email !== "" && !emailRegex.test(email)) {
            // salta este error si el correo no está vacío pero el formato no es valido
            alert('Correo incorrecto. Por favor, ingresa un correo con este formato: ejemplo@gmail.com.');
        } else if (email) {
            // si todo esta bien pues pasamaos a Vanilla2.html
            window.location.href = 'Vanilla2.html?email=' + email;
        }
    });
    messageContainer.appendChild(userInput);
}






