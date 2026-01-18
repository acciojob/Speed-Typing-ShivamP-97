const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const heading = document.createElement('h1');
heading.textContent = 'Typing Test';
container.appendChild(heading);

const quoteDisplay = document.createElement('div');
quoteDisplay.classList.add('quote-display');
container.appendChild(quoteDisplay);

const quoteInput = document.createElement('input');
quoteInput.setAttribute('id', 'quoteInput');
quoteInput.setAttribute('placeholder', 'Start typing here...');
container.appendChild(quoteInput);

const timerElement = document.createElement('div');
timerElement.classList.add('timer');
timerElement.textContent = '0'; 
container.appendChild(timerElement);

let timer;
let startTime;
let quote = '';
let waitingForNext = false;

async function getQuote() {
  waitingForNext = false;
  try {
    const res = await fetch('http://api.quotable.io/random');
    const data = await res.json();
    quote = data.content;
    displayQuote();
    timerElement.textContent = '0'; 
  } catch (err) {
    quoteDisplay.textContent = 'Error fetching quote!';
  }
}

function displayQuote() {
  quoteDisplay.innerHTML = '';
  quote.split('').forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    quoteDisplay.appendChild(span);
  });

  quoteInput.value = '';
  startTimer();
}

function startTimer() {
  clearInterval(timer);
  startTime = new Date();
  timerElement.textContent = '0';
  timer = setInterval(() => {
    const elapsed = Math.floor((new Date() - startTime) / 1000);
    timerElement.textContent = `${elapsed}`;
  }, 1000);
}

quoteInput.addEventListener('input', () => {
  if (waitingForNext) return;

  const quoteChars = quoteDisplay.querySelectorAll('span');
  const inputChars = quoteInput.value.split('');

  let correct = true;

  quoteChars.forEach((charSpan, index) => {
    const typedChar = inputChars[index];

    if (typedChar == null) {
      charSpan.classList.remove('correct');
      charSpan.classList.remove('incorrect');
      correct = false;
    } else if (typedChar === charSpan.textContent) {
      charSpan.classList.add('correct');
      charSpan.classList.remove('incorrect');
    } else {
      charSpan.classList.add('incorrect');
      charSpan.classList.remove('correct');
      correct = false;
    }
  });

  if (correct && inputChars.length === quoteChars.length) {
    waitingForNext = true;
    clearInterval(timer);

    let waitStart = new Date();
    const waitTimer = setInterval(() => {
      const elapsed = Math.floor((new Date() - waitStart) / 1000) + 1;
      timerElement.textContent = `${elapsed}`;
    }, 1000);

    setTimeout(() => {
      clearInterval(waitTimer);
      getQuote(); 
    }, 3000);
  }
});

getQuote();
