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
    
    userInput.addEventListener('blur', function() {
        validateEmail(userInput);
    });

    messageContainer.appendChild(userInput);
}

function validateEmail(input) {
    var email = input.value;
    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!emailRegex.test(email)) {
        alert('Correo incorrecto. Por favor, ingresa un correo con este formato: ejemplo@gmail.com.');
    } else {
        window.location.href = 'Vanilla2.html?email=' + email;
    }
}


