// Global variables
let map;
let currentData;
let correctAnswer;
let allSheetData = []; // Store all data globally to avoid repeated fetches

// Initialize Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjbHI2NHRtcWgxdjlqMmpwODI3bWVvOHU0In0.CC5tEr4QK7D-i5JKJ9oyRA';
map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [0, 0], // Default center
    zoom: 20,
	maxZoom:24
});

// Load data from Google Sheets
function loadData() {
    fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRiyRa7LxG3TUhcNuDBMTUhkSeIIk78Jyu5qHa0TOWvm5JnaTPiMTQctWvgk5xVhh6af0R76n8VTlvt/pub?gid=705765450&single=true&output=csv')
        .then(response => response.text())
        .then(csvData => {
            Papa.parse(csvData, {
                header: true,
                complete: function(results) {
                    allSheetData = results.data;
                    loadRandomLocation(); // Load first location
                }
            });
        })
        .catch(error => console.error('Error loading data:', error));
}

// Load a random location from the global data
function loadRandomLocation() {
    if (allSheetData.length === 0) return;
    const randomIndex = Math.floor(Math.random() * allSheetData.length);
    currentData = allSheetData[randomIndex];
    correctAnswer = currentData.correctAnswer;

    // Center map on the location
    const coordinates = [parseFloat(currentData.longitude), parseFloat(currentData.latitude)];
    map.setCenter(coordinates);
    map.setZoom(12);

    // Display question and answers
    document.getElementById('question').textContent = currentData.question;
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    // Shuffle answers
    const allAnswers = [
        currentData.option1,
        currentData.option2,
        currentData.option3,
        currentData.option4
    ];
    shuffleArray(allAnswers);

    // Create answer buttons
    allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.onclick = () => checkAnswer(answer);
        answersContainer.appendChild(button);
    });
}

// Shuffle array for random answer order
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Check if the selected answer is correct
function checkAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
        alert("Correct! Well done!");
    } else {
        alert(`Wrong! The correct answer was: ${correctAnswer}`);
    }
    // Load a new location
    loadRandomLocation();
}
