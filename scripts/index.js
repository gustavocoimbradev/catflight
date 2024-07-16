window.addEventListener(`load`, function(){

    const myGame = document.querySelector(`my-game`);
    const ball = myGame.querySelector(`ball`);
    const enemy = myGame.querySelector(`enemy`);
    const scoreNumber = myGame.querySelector(`score>number`);
    const recordNumber = myGame.querySelector(`record>number`);
    let isFlying = true;
    let enemies;
    let currentScore;
    let map;
    let auxRecord;

    hideGameName();
    flyBall();
    checkPosition();
    scrollMap();
    sendEnemies();
    speedUp();
    restartGame();
    handleRecords();

    function audio(ref = '', action = 'play') {
        const audio = document.querySelector(`[ref='${ref}']`);
        if (audio) {
            if (action == 'play') {
                audio.play();
                if (ref == 'game-over') {
                    const soundtrack = document.querySelector(`[ref='soundtrack']`);
                    soundtrack.remove();
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
        myGame.setAttribute(`you-lost`,true);
        document.addEventListener('keyup', function(event) {
            if (event.code === 'Space' || event.key === ' ') {
                window.location.reload();
            }
        });
        if (parseInt(scoreNumber.innerText) > auxRecord) {
            localStorage.setItem(`record`,parseInt(scoreNumber.innerText));
        }
        audio('soundtrack','pause');
        audio('game-over','play');
    }

    function speedUp() {
        setInterval(function(){
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
        }, 50);
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
            if (ball.getBoundingClientRect().top > 570) {
                clearInterval(interval);
                gameOver();
            }
            if (ball.getBoundingClientRect().top < 320) {
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
    
        }, 100);
    }

    function flyBall() {
        document.addEventListener('keydown', function(event) {
            audio('soundtrack','play');
            if (event.key === 'ArrowUp' && ball) {
                if (!isFlying) {
                    isFlying = true;
                    ball.style.transition = 'top .6s';
                    ball.style.top = '-20%';
                }
            }
        });
        document.addEventListener('keyup', function(event) {
            if (event.key === 'ArrowUp' && ball) {
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
            myGame.removeAttribute(`escape-the-meat`);
        }, 3000);
    }

})