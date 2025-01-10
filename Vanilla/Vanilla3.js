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

let savingQuestions = []; // Para hacer seguimiento de las preguntas en estado "Saving..."

function addTableHead() {
    if (!newPanel.querySelector('thead')) {
        const header = document.createElement('thead');
        header.innerHTML = '<tr><th>Pregunta</th><th>Respuesta</th><th>Puntos</th><th>Estado</th></tr>';
        newPanel.appendChild(header);
    }
}

function checkSaveButtonState() {
    let isQuestionValid, isAnswerSelected, isPointsValid;

    if (questionInput.value.trim() !== '') {
        isQuestionValid = true;
    } else {
        isQuestionValid = false;
    }

    if (trueRadio.checked || falseRadio.checked) {
        isAnswerSelected = true;
    } else {
        isAnswerSelected = false;
    }

    if (pointsInput.value >= 0 && pointsInput.value <= 9) {
        isPointsValid = true;
    } else {
        isPointsValid = false;
    }

    if (isQuestionValid && isAnswerSelected && isPointsValid) {
        saveButton.disabled = false;
    } else {
        saveButton.disabled = true;
    }
}

questionForm.addEventListener('submit', function (event) {
    event.preventDefault();
    //uso esto para evitar que se ejecute la acción predeterminada de un evento.

    const questionData = {
        question: questionInput.value.trim(),
        answer: trueRadio.checked ? 'True' : 'False',
        points: pointsInput.value,
        status: 'Saving...'
    };

    savingQuestions.push(questionData); // Agregar la pregunta a la lista
    updateBackButtonState();

    addQuestionToPanel(questionData);

    processQuestionIndividually(questionData); 
    // Temporizador independiente que tiene que tener cada pregunta

    questionForm.reset();
    checkSaveButtonState();
});

function processQuestionIndividually(questionData) {
    saveQuestion(questionData)
        .then(() => new Promise(resolve => setTimeout(resolve, 5000))) // Esperar 5 segundos
        .then(() => {
            questionData.status = 'OK';
            updatePanelWithStatus(questionData);
            updateBackButtonState(); // Verifico estado del botón atrás
        })
        .catch(() => {
            questionData.status = 'ERROR';
            updatePanelWithStatus(questionData);
            updateBackButtonState();
        });
}

function updateBackButtonState() {
    // Habilito el botón "Atrás" solo si al menos una pregunta no está en estado 'OK'
    let hasInvalidStatus = false;
    for (let question of savingQuestions) {
        if (question.status !== 'OK') {
            hasInvalidStatus = true;
            break;
        }
    }
    backButton.disabled = hasInvalidStatus;
}


function saveQuestion(questionData) {
    return new Promise((resolve, reject) => {
        try {
            saveQuestionToCookie(questionData);
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function addQuestionToPanel(questionData) {
    const row = document.createElement('tr');
    row.innerHTML = '<td>' + questionData.question + '</td>' +
                    '<td>' + questionData.answer + '</td>' +
                    '<td>' + questionData.points + '</td>' +
                    '<td>' + questionData.status + '</td>';
    newPanel.appendChild(row);
}

function updatePanelWithStatus(questionData) {
    const rows = newPanel.querySelectorAll('tr');
    rows.forEach(row => {
        if (row.cells[0].textContent === questionData.question) {
            row.cells[3].textContent = questionData.status;
        }
    });
}

function saveQuestionToCookie(questionData) {
    let questions = getCookies(email + '_questions') || [];
    questions.push(questionData);
    setCookies(email + '_questions', JSON.stringify(questions), 7);
}

function getCookies(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return JSON.parse(parts.pop().split(";").shift());
    }
    return null;
}

function setCookies(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function loadQuestionsFromCookies() {
    const questions = getCookies(email + '_questions') || [];
    newPanel.innerHTML = '<p>Loading questions...</p>';

    setTimeout(() => {
        newPanel.innerHTML = '';
        addTableHead();
        questions.forEach(question => {
            question.status = 'OK';
            addQuestionToPanel(question);
        });
    }, 5000);
}

// Eventos adicionales
loadQuestionsFromCookies();
questionInput.addEventListener('input', checkSaveButtonState);
trueRadio.addEventListener('change', checkSaveButtonState);
falseRadio.addEventListener('change', checkSaveButtonState);
pointsInput.addEventListener('input', checkSaveButtonState);

backButton.addEventListener('click', () => {
    window.location.href = 'Vanilla2.html?email=' + email;
});














