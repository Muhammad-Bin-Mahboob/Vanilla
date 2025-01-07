// Obtener elementos
const questionForm = document.getElementById('questionForm');
const questionInput = document.getElementById('question');
const trueRadio = document.getElementById('true');
const falseRadio = document.getElementById('false');
const pointsInput = document.getElementById('points');
const saveButton = questionForm.querySelector('button[type="submit"]');
const backButton = document.getElementById('atras');
const newPanel = document.getElementById('new');

var email = new URLSearchParams(window.location.search).get('email');

// Agregar el encabezado de la tabla
function addTableHead() {
    if (!newPanel.querySelector('thead')) { // Verifica si ya existe un encabezado
        const header = document.createElement('thead');
        header.innerHTML = '<tr><th>Pregunta</th><th>Respuesta</th><th>Puntos</th><th>Estado</th></tr>';
        newPanel.appendChild(header);
    }
}

// Habilitar el botón de Guardar solo cuando todas las condiciones se cumplan
function checkSaveButtonState() {
    // Validar si la pregunta es válida
    let isQuestionValid = false;
    if (questionInput.value.trim() !== '') {
        isQuestionValid = true;
    } else {
        isQuestionValid = false;
    }

    // Validar si una respuesta está seleccionada
    let isAnswerSelected = false;
    if (trueRadio.checked) {
        isAnswerSelected = true;
    } else if (falseRadio.checked) {
        isAnswerSelected = true;
    } else {
        isAnswerSelected = false;
    }

    // Validar si los puntos son válidos
    let isPointsValid = false;
    if (pointsInput.value >= 0) {
        if (pointsInput.value <= 9) {
            isPointsValid = true;
        } else {
            isPointsValid = false;
        }
    } else {
        isPointsValid = false;
    }

    // Habilitar o deshabilitar el botón de guardar
    if (isQuestionValid === true) {
        if (isAnswerSelected === true) {
            if (isPointsValid === true) {
                saveButton.disabled = false;
            } else {
                saveButton.disabled = true;
            }
        } else {
            saveButton.disabled = true;
        }
    } else {
        saveButton.disabled = true;
    }
}

// Envío del formulario
questionForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevenir recarga de página

    const questionData = {
        question: questionInput.value.trim(),
        answer: trueRadio.checked ? 'True' : 'False',
        points: pointsInput.value,
        status: 'Saving...'
    };

    backButton.disabled = true;
    addQuestionToPanel(questionData);

    setTimeout(function () {
        try {
            saveQuestionToCookie(questionData); // Guardar en cookies
            questionData.status = 'OK';
        } catch (error) {
            questionData.status = 'ERROR';
        }
        updatePanelWithStatus(questionData);
        backButton.disabled = false;
        questionForm.reset();
        checkSaveButtonState();
    }, 5000);
});

// Agregar pregunta al panel
function addQuestionToPanel(questionData) {
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + questionData.question + '</td>' +
                    '<td>' + questionData.answer + '</td>' +
                    '<td>' + questionData.points + '</td>' +
                    '<td>' + questionData.status + '</td>';
    newPanel.appendChild(row);
}

// Actualizar el estado de la pregunta en el panel
function updatePanelWithStatus(questionData) {
    const rows = newPanel.querySelectorAll('tr');
    rows.forEach(function (row) {
        if (row.cells[0].textContent === questionData.question) {
            row.cells[3].textContent = questionData.status;
        }
    });
}

// Guardar preguntas en cookies
function saveQuestionToCookie(questionData) {
    let questions = getCookies(email + '_questions') || [];
    questions.push(questionData);
    setCookies(email + '_questions', JSON.stringify(questions), 7);
}

// Obtener cookies por nombre
function getCookies(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return JSON.parse(parts.pop().split(";").shift());
    }
    return null;
}

// Establecer cookies
function setCookies(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

// Cargar preguntas desde cookies
function loadQuestionsFromCookies() {
    const questions = getCookies(email + '_questions') || [];
    newPanel.innerHTML = '<p>Loading questions...</p>';

    // Agregar el encabezado de la tabla
    
    setTimeout(function () {
        newPanel.innerHTML = ''; // Limpiar el mensaje de carga
        addTableHead();
        questions.forEach(function (question) {
            question.status = 'OK';
            addQuestionToPanel(question);
        });
    }, 5000);

}

// Eventos adicionales
loadQuestionsFromCookies(); // Cargar preguntas al iniciar
questionInput.addEventListener('input', checkSaveButtonState);
trueRadio.addEventListener('change', checkSaveButtonState);
falseRadio.addEventListener('change', checkSaveButtonState);
pointsInput.addEventListener('input', checkSaveButtonState);

backButton.addEventListener('click', () => {
    window.location.href = 'Vanilla2.html?email=' + email;
});






