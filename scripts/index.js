
document.addEventListener('DOMContentLoaded', function() {
    config();
    hideGameName();
    flyBall();
    scrollMap();
    checkPosition();
    sendEnemies();
    speedUp();
    restartGame();
    handleRecords();
});

const myGame = document.querySelector(`my-game`);
const ball = myGame.querySelector(`ball`);
const enemy = myGame.querySelector(`enemy`);
const playable = myGame.querySelector(`playable`);
const scoreNumber = myGame.querySelector(`score>number`);
const recordNumber = myGame.querySelector(`record>number`);
let isFlying = true;
let enemies;
let currentScore;
let map;
let auxRecord;
let varSpeedUp;

function config() {
    const urlParams = new URLSearchParams(window.location.search);
    const scoreText = urlParams.get('score-text');
    const recordText = urlParams.get('record-text');
    const playerPicture = urlParams.get('player-picture');
    const enemyPicture = urlParams.get('enemy-picture');
    const welcomeText = urlParams.get('welcome-text');
    if (scoreText) {
        document.querySelector(`[ref='score-text']`).innerText = scoreText;
    }
    if (recordText) {
        document.querySelector(`[ref='record-text']`).innerText = recordText;
    }
    if (playerPicture) {
        document.querySelector(`ball`).style.backgroundImage = `url(${playerPicture})`;
    }
    if (enemyPicture) {
        document.querySelector(`enemy`).style.backgroundImage = `url(${enemyPicture})`;
    }
    if (welcomeText) {
        const welcomes = document.querySelectorAll(`welcome`);
        welcomes.forEach(function(welcome) {
            welcome.innerText = `${welcomeText}`;
        })
    }
}

function audio(ref = '', action = 'play') {
    const audio = document.querySelector(`[ref='${ref}']`);
    if (audio) {
        if (action == 'play') {
            audio.play();
            if (ref == 'game-over') {
                const soundtrack = document.querySelector(`[ref='soundtrack']`);
                if (soundtrack) {
                    soundtrack.remove();
                }
            }
        } else if (action == 'pause') {
            audio.pause();
            audio.remove();
        }
    }
}

function gameOver() {
    clearInterval(enemies);
    clearInterval(map);
    clearInterval(varSpeedUp);
    myGame.setAttribute(`you-lost`,true);
    if (parseInt(scoreNumber.innerText) > auxRecord) {
        localStorage.setItem(`record`,parseInt(scoreNumber.innerText));
    }
    audio('soundtrack','pause');
    audio('game-over','play');
}

function speedUp() {
    varSpeedUp = setInterval(function(){
        myGame.setAttribute(`speed`,parseFloat(myGame.getAttribute(`speed`)) + .001);
    }, .1);
}

function sendEnemies() {
    let leftPosition = 1000;
    enemies = setInterval(function() {
        leftPosition -= parseFloat(myGame.getAttribute(`speed`));
        enemy.style.left = `${leftPosition}px`;  
        if (leftPosition < -100) {
            leftPosition = 1000;
            enemy.style.top = `${Math.floor(Math.random() * 120)}px`
            currentScore = parseInt(scoreNumber.textContent);
            scoreNumber.textContent = currentScore + 1;
        }
    }, 30);
}

function scrollMap() {
    let backgroundPosition = 0;
    map = setInterval(function() {
        backgroundPosition -= parseFloat(myGame.getAttribute(`speed`));
        myGame.style.backgroundPosition = `${backgroundPosition}px 0`;    
    }, 50);
}

function restartGame() {
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            window.location.reload(); 
        }
    });
}

function checkPosition() {

    const interval = setInterval(function() {

        function isElementInsideParent() {
            const margin = 50;
            const childRect = ball.getBoundingClientRect();
            const parentRect = playable.getBoundingClientRect();
            const insideVertically = childRect.top >= parentRect.top - margin && childRect.bottom <= parentRect.bottom;
            return insideVertically;
        }
        


        if (!isElementInsideParent()) {
            clearInterval(interval);
            gameOver();
        }

        const enemyRect = enemy.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        const horizontalProximity = Math.abs(enemyRect.left - ballRect.left) < 30;
        const verticalProximity = Math.abs(enemyRect.top - ballRect.top) < 30;
        
        if (horizontalProximity && verticalProximity) {
            clearInterval(interval);
            gameOver();
        }

    }, .1);
}

function flyBall() {
    document.addEventListener('keydown', function(event) {
        audio('soundtrack', 'play');
        if (event.key === ' ' && ball) {
            if (!isFlying) {
                isFlying = true;
                ball.style.transition = 'top .6s';
                ball.style.top = '-20%';
            }
        }
    });
    document.addEventListener('keyup', function(event) {
        if (event.key === ' ' && ball) {
            isFlying = false;
            ball.style.transition = 'top 1s';
            ball.style.top = '120%';
        }
    });
}

function handleRecords() {
    if (localStorage.getItem(`record`)) {
        recordNumber.innerText = localStorage.getItem(`record`);
        auxRecord = parseInt(localStorage.getItem(`record`));
    } else {
        recordNumber.innerText = 0;
        auxRecord = 0;
    }
}

function hideGameName() {
    setTimeout(function(){
        isFlying = false;
        myGame.removeAttribute(`escape-something`);
    }, 3000);
}

function handlePlayerPictureChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('player-picture').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

function handleEnemyPictureChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('enemy-picture').value = e.target.result;
    };
    reader.readAsDataURL(file);
}

