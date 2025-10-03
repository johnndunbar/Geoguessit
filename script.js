// Global variables
let map;
let currentData;
let correctAnswer;

// Initialize Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYmVuamFtaW50ZCIsImEiOiJjbHI2NHRtcWgxdjlqMmpwODI3bWVvOHU0In0.CC5tEr4QK7D-i5JKJ9oyRA';
map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/satellite-streets-v11',
    center: [0, 0], // Default center
    zoom: 2
});

// Load CSV data
// Remplace la ligne Papa.parse("data.csv", ...) par :
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRiyRa7LxG3TUhcNuDBMTUhkSeIIk78Jyu5qHa0TOWvm5JnaTPiMTQctWvgk5xVhh6af0R76n8VTlvt/pub?gid=705765450&single=true&output=csv')
    .then(response => response.text())
    .then(csvData => {
        Papa.parse(csvData, {
            header: true,
            complete: function(results) {
                loadRandomLocation(results.data);
            }
        });
    })
    .catch(error => console.error('Erreur lors du chargement des données :', error));


// Load a random location from the data
function loadRandomLocation(data) {
    const randomIndex = Math.floor(Math.random() * data.length);
    currentData = data[randomIndex];
    correctAnswer = currentData.correctAnswer;

    // Center map on the location
    const coordinates = [parseFloat(currentData.longitude), parseFloat(currentData.latitude)];
    map.setCenter(coordinates);
    map.setZoom(12); // Zoom in for detail

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
    Papa.parse("data.csv", {
        download: true,
        header: true,
        complete: function(results) {
            loadRandomLocation(results.data);
        }
    });
}
