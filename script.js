/****************************************************
 * GLOBAL VARIABLES & ELEMENTS
 ****************************************************/
const dropdownBtn = document.getElementById('dropdown-btn');
const dropdownContent = document.getElementById('dropdown-content');
const startBtn = document.getElementById('start-btn');
const submitBtn = document.getElementById('submit-btn');
const nextBtn = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const emojiRows = document.getElementById('emoji-rows');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const resultEl = document.getElementById('result');

// Scoreboard & Progress elements
const scoreboardEl = document.getElementById('scoreboard');
const progressTextEl = document.getElementById('progress-text');
const scoreTextEl = document.getElementById('score-text');
const progressBarEl = document.getElementById('progress-bar');

let selectedTables = [];
let currentQuestion = {};
let confetti; // will hold our confetti instance
let questionCount = 0; // total questions asked
let correctCount = 0;  // correct answers
let totalQuestions = 10; // You can adjust total question count or make it dynamic

// Track attempts for the current question
let attemptCount = 0;

/****************************************************
 * 1. DROPDOWN TOGGLE
 ****************************************************/
dropdownBtn.addEventListener('click', () => {
  dropdownContent.classList.toggle('hidden');
});

/****************************************************
 * 2. START QUIZ 
 ****************************************************/
startBtn.addEventListener('click', () => {
  selectedTables = Array.from(
    document.querySelectorAll('.table-select:checked')
  ).map(input => parseInt(input.value));

  if (selectedTables.length === 0) {
    alert('Selecciona al menos una tabla.');
    return;
  }

  // Initialize counters
  questionCount = 0;
  correctCount = 0;

  // Show scoreboard
  scoreboardEl.classList.remove('hidden');
  // Show quiz container
  questionContainer.classList.remove('hidden');

  // Generate the first question
  generateQuestion();
});

/****************************************************
 * 3. GENERATE A NEW QUESTION
 ****************************************************/
function generateQuestion() {
  // Clear previous result
  resultEl.classList.add('hidden');
  resultEl.textContent = '';
  // Hide the Next button until user has resolved this question
  nextBtn.classList.add('hidden');
  // Clear the input
  answerEl.value = '';
  answerEl.focus();

  // Clear any previous confetti
  if (confetti) {
    confetti.clear();
  }

  // Increase question counter
  questionCount++;
  // Reset attempts for the new question
  attemptCount = 0;

  // Update scoreboard
  updateScoreboard();

  // Random table from selected tables
  const table = selectedTables[Math.floor(Math.random() * selectedTables.length)];
  // Random number from 1 to 10
  const number = Math.floor(Math.random() * 10) + 1;

  currentQuestion = {
    table,
    number,
    answer: table * number
  };

  // Populate emojis
  populateEmojis(table, number);

  // Display the question
  questionEl.textContent = `${table} x ${number}`;
}

/****************************************************
 * 3a. POPULATE EMOJIS (VISUAL AID)
 ****************************************************/
function populateEmojis(table, number) {
  const emojis = ['🍎', '🐶', '🎈', '🍇', '🐱', '🦄', '🐼', '🚗', '🍉', '🌟', '🐣'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  emojiRows.innerHTML = '';
  for (let i = 0; i < table; i++) {
    const row = document.createElement('div');
    row.classList.add('emoji-row');
    for (let j = 0; j < number; j++) {
      const span = document.createElement('span');
      span.textContent = randomEmoji;
      row.appendChild(span);
    }
    emojiRows.appendChild(row);
  }
}

/****************************************************
 * 4. CHECK ANSWER 
 ****************************************************/
submitBtn.addEventListener('click', () => {
  const userAnswer = parseInt(answerEl.value);

  if (isNaN(userAnswer)) {
    alert('Por favor ingresa un número.');
    return;
  }

  attemptCount++;

  // If correct
  if (userAnswer === currentQuestion.answer) {
    handleCorrectAnswer();
  } else {
    handleWrongAnswer();
  }
});

/****************************************************
 * 4a. HANDLE CORRECT ANSWER
 ****************************************************/
function handleCorrectAnswer() {
  // Increase score
  correctCount++;

  // Show the result
  resultEl.classList.remove('hidden');
  resultEl.textContent = '¡Correcto! 🎉';

  // Create and render confetti
  confetti = new ConfettiGenerator({
    target: 'confetti-canvas',
    max: 150,
    size: 1.2,
    animate: true,
    props: ['circle', 'square', 'triangle'], // shapes
    colors: [
      [165, 104, 246],
      [230, 61, 135],
      [0, 199, 228],
      [253, 214, 126]
    ],
    clock: 30,
    rotate: true,
    start_from_edge: true,
    respawn: false
  });
  confetti.render();

  // Update scoreboard
  updateScoreboard();

  // Show "Siguiente" button
  nextBtn.classList.remove('hidden');
}

/****************************************************
 * 4b. HANDLE WRONG ANSWER (WITH 2 ATTEMPTS)
 ****************************************************/
function handleWrongAnswer() {
  resultEl.classList.remove('hidden');

  if (attemptCount === 1) {
    // First wrong attempt -> let the user try again
    resultEl.textContent = '¡Uy! Intenta de nuevo. 💡';
    answerEl.value = '';
    answerEl.focus();
  } else {
    // Second wrong attempt -> reveal answer and short explanation
    const table = currentQuestion.table;
    const number = currentQuestion.number;
    const correctAnswer = currentQuestion.answer;
    
    // Generate a mini explanation: repeated addition, if you like
    const explanation = `${table} x ${number} = ${correctAnswer} 
      (porque ${table} + ${table} + ... + ${table} (${number} veces) = ${correctAnswer})`;

    resultEl.innerHTML = `
      Incorrecto. La respuesta era 
      <span class="incorrect-answer">${correctAnswer}</span>.<br/>
      <small>${explanation}</small>
    `;

    // Show "Siguiente" button
    nextBtn.classList.remove('hidden');
  }
}

/****************************************************
 * 5. NEXT QUESTION
 ****************************************************/
nextBtn.addEventListener('click', () => {
  // If we still have questions to go, generate next question
  // otherwise, we can end the quiz
  if (questionCount < totalQuestions) {
    generateQuestion();
  } else {
    endQuiz();
  }
});

/****************************************************
 * 6. UPDATE SCOREBOARD & PROGRESS
 ****************************************************/
function updateScoreboard() {
  // "Question X of totalQuestions"
  progressTextEl.textContent = `Pregunta ${questionCount} de ${totalQuestions}`;
  // "Score: correctCount / questionCount"
  scoreTextEl.textContent = `Puntaje: ${correctCount} / ${questionCount - 1}`;

  // Update progress bar
  const progressPercentage = (questionCount / totalQuestions) * 100;
  progressBarEl.style.width = progressPercentage + '%';
}

/****************************************************
 * 7. END QUIZ
 ****************************************************/
function endQuiz() {
  // Hide question elements
  questionContainer.classList.add('hidden');
  // Show final message in scoreboard
  progressTextEl.textContent = '¡Terminaste la práctica!';

  scoreTextEl.textContent = `Resultado Final: ${correctCount} / ${totalQuestions}`;
}

/****************************************************
 * 8. OPTIONAL: You can also add a "Try Again" button 
 *    or automatically reset. For brevity, we just show
 *    final results and let the user refresh or change 
 *    tables if they want to practice again.
 ****************************************************/
