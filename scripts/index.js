
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
const enemy = myGame.querySelectorAll(`enemy`);
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

    const leftPosition1Original = 1000;
    const leftPosition2Original = 10000;
    const leftPosition3Original = 20000;
    const leftPosition4Original = 30000;

    let leftPosition1 = leftPosition1Original;
    let leftPosition2 = leftPosition2Original;
    let leftPosition3 = leftPosition3Original;
    let leftPosition4 = leftPosition4Original;

    let enemies0 = setInterval(function() {
        leftPosition1 -= parseFloat(myGame.getAttribute(`speed`));
        enemy[0].style.left = `${leftPosition1}px`;  
        if (leftPosition1 < -100) {
            leftPosition1 = leftPosition1Original;
            enemy[0].style.top = `${Math.floor(Math.random() * 290)}px`;
            currentScore = parseInt(scoreNumber.textContent);
            scoreNumber.textContent = currentScore + 1;
        }
    }, 30);

    let enemies1 = setInterval(function() {
        leftPosition2 -= parseFloat(myGame.getAttribute(`speed`)) * 2;
        enemy[1].style.left = `${leftPosition2}px`;  
        if (leftPosition2 < Math.floor(Math.random() * (-11000 + 2000) - 2000)) {
            leftPosition2 = leftPosition2Original;
        }
    }, 30);

    let enemies2 = setInterval(function() {
        leftPosition3 -= parseFloat(myGame.getAttribute(`speed`)) * 1;
        enemy[2].style.left = `${leftPosition3}px`;  
        if (leftPosition3 < Math.floor(Math.random() * (-11000 + 2000) - 2000)) {
            leftPosition3 = leftPosition3Original;
        }
    }, 30);

    let enemies3 = setInterval(function() {
        leftPosition4 -= parseFloat(myGame.getAttribute(`speed`)) * 2;
        enemy[3].style.left = `${leftPosition4}px`;  
        if (leftPosition4 < Math.floor(Math.random() * (-32000 + 7000) - 7000)) {
            enemy[0].style.top = `${Math.floor(Math.random() * 290)}px`;
            leftPosition4 = leftPosition4Original;
        }
    }, 30);

}


function scrollMap() {
    let backgroundPosition = 0;
    map = setInterval(function() {
        backgroundPosition -= parseFloat(myGame.getAttribute(`speed`));
        myGame.style.backgroundPosition = `${backgroundPosition}px -129px`;    
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

        const enemyRect0 = enemy[0].getBoundingClientRect();
        const enemyRect1 = enemy[1].getBoundingClientRect();
        const enemyRect2 = enemy[2].getBoundingClientRect();
        const enemyRect3 = enemy[3].getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();

        const horizontalProximity0 = Math.abs(enemyRect0.left - ballRect.left) < 46;
        const verticalProximity0 = Math.abs(enemyRect0.top - ballRect.top) < 46;
        
        const horizontalProximity1 = Math.abs(enemyRect1.left - ballRect.left) < 46;
        const verticalProximity1 = Math.abs(enemyRect1.top - ballRect.top) < 46;

        const horizontalProximity2 = Math.abs(enemyRect2.left - ballRect.left) < 46;
        const verticalProximity2 = Math.abs(enemyRect2.top - ballRect.top) < 46;

        const horizontalProximity3 = Math.abs(enemyRect3.left - ballRect.left) < 46;
        const verticalProximity3 = Math.abs(enemyRect3.top - ballRect.top) < 46;


        if (
            (horizontalProximity0 && verticalProximity0) 
            || (horizontalProximity1 && verticalProximity1)
            || (horizontalProximity2 && verticalProximity2)
            || (horizontalProximity3 && verticalProximity3)
        ) {
            clearInterval(interval);
            gameOver();
        }

    }, .1);
}

function flyBall() {
    let skyLimit = 20;
    let groundLimit = 300;
    let slowDownStart = 250;
    let gravity = 5;
    let velocity = 0;
    let isFalling = false;
    let isHovering = false;

    document.addEventListener('keydown', function(event) {
        audio('soundtrack', 'play');
        if (event.key === ' ' && ball) {
            if (!isFlying && parseInt(getComputedStyle(ball).top) > skyLimit) {
                isFlying = true;
                isFalling = false;
                isHovering = false;
                velocity = 0;
                ball.style.transition = 'top ease-in-out 1s';
                ball.style.top = Math.max(skyLimit, parseInt(getComputedStyle(ball).top) - 100) + 'px';
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === ' ' && ball) {
            isFlying = false;
            if (!isFalling) {
                isFalling = true;
                velocity = 0;
                fall();
            }
        }
    });

    function fall() {
        function update() {
            let currentTop = parseInt(getComputedStyle(ball).top);

            if (isFlying) return;

            if (currentTop >= slowDownStart && currentTop < groundLimit) {
                let progress = (currentTop - slowDownStart) / (groundLimit - slowDownStart);
                velocity = gravity * (1 - Math.pow(progress, 2));
                velocity = Math.max(velocity, 1);
                ball.style.transition = `top ease-in-out ${0.1 + progress * 0.02}s`;
                ball.style.top = (currentTop + velocity) + 'px';
                requestAnimationFrame(update);
            } else if (currentTop >= groundLimit - 5) {
                ball.style.transition = 'top ease-in-out 0.8s';
                ball.style.top = groundLimit + 'px';
                isFalling = false;
                velocity = 0;
                if (!isHovering) {
                    isHovering = true;
                    hoverEffect();
                }
            } else {
                velocity += gravity;
                ball.style.transition = 'top ease-in-out 0.1s';
                ball.style.top = (currentTop + velocity) + 'px';
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    }

    function hoverEffect() {
        function hoverUp() {
            if (!isFlying && !isFalling) {
                ball.style.transition = 'top ease-in-out 1.2s';
                ball.style.top = (groundLimit - 10) + 'px';
                setTimeout(hoverDown, 800);
            }
        }

        function hoverDown() {
            if (!isFlying && !isFalling) {
                ball.style.transition = 'top ease-in-out 1.2s';
                ball.style.top = (groundLimit + 10) + 'px';
                setTimeout(hoverUp, 800);
            }
        }

        hoverUp();
    }
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

