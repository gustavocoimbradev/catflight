window.addEventListener(`load`, function(){

    // Init

    const myGame = document.querySelector(`my-game`);
    const ball = myGame.querySelector(`ball`);
    const enemy = myGame.querySelector(`enemy`);
    const scoreNumber = myGame.querySelector(`score>number`);
    const recordNumber = myGame.querySelector(`record>number`);
 
    let auxRecord;

    if (localStorage.getItem(`record`)) {
        recordNumber.innerText = localStorage.getItem(`record`);
        auxRecord = parseInt(localStorage.getItem(`record`));
    } else {
        recordNumber.innerText = 0;
        auxRecord = 0;
    }

    let isFlying = true;

    setTimeout(function(){
        isFlying = false;
        myGame.removeAttribute(`escape-the-meat`);
    }, 3000);

    // Fly
    
    
    document.addEventListener('keydown', function(event) {

        const audio = document.querySelector(`audio`);
        if (audio) {
            audio.play();
        }

        if (event.key === 'ArrowUp' && ball) {
            if (!isFlying) {
                isFlying = true;
                ball.style.transition = 'top 0.6s';
                ball.style.top = '-20%';
            }
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowUp' && ball) {
            isFlying = false;
            ball.style.transition = 'top 1.2s';
            ball.style.top = '120%';
        }
    });
    
 

    // Check

    setInterval(function() {
        if (ball.getBoundingClientRect().top > 570) {
            clearInterval(enemies);
            clearInterval(map);
            myGame.setAttribute(`you-lost`,true);
            ball.remove();
            document.addEventListener('keyup', function(event) {
                if (event.code === 'Space' || event.key === ' ') {
                    window.location.reload();
                }
            });
            const audio = document.querySelector(`audio`);
            if (audio) {
                audio.pause();
            }
            if (parseInt(scoreNumber.innerText) > parseInt(localStorage.getItem(`record`))) {
                localStorage.setItem(`record`,parseInt(scoreNumber.innerText));
            }
        }
        if (ball.getBoundingClientRect().top < 320) {
            clearInterval(enemies);
            clearInterval(map);
            myGame.setAttribute(`you-lost`,true);
            ball.remove();
            document.addEventListener('keyup', function(event) {
                if (event.code === 'Space' || event.key === ' ') {
                    window.location.reload();
                }
            });
            const audio = document.querySelector(`audio`);
            if (audio) {
                audio.pause();
            }
            if (parseInt(scoreNumber.innerText) > parseInt(localStorage.getItem(`record`))) {
                localStorage.setItem(`record`,parseInt(scoreNumber.innerText));
            }
        }

        if (enemy.getBoundingClientRect().left < 360 && enemy.getBoundingClientRect().left > 300) {
            const enemyRect = enemy.getBoundingClientRect();
            const ballRect = ball.getBoundingClientRect();
            
            if (Math.abs(enemyRect.top - ballRect.top) < 30) {
                clearInterval(enemies);
                clearInterval(map);
                myGame.setAttribute(`you-lost`,true);
                isFlying = false;
                const audio = document.querySelector(`audio`);
                if (audio) {
                    audio.pause();
                }
                document.addEventListener('keyup', function(event) {
                    if (event.code === 'Space' || event.key === ' ') {
                        window.location.reload();
                    }
                });
            } 
            if (parseInt(scoreNumber.innerText) > parseInt(localStorage.getItem(`record`))) {
                localStorage.setItem(`record`,parseInt(scoreNumber.innerText));
            }
            
        }

    }, 100);
    
    // Map 

    let backgroundPosition = 0;
    const map = setInterval(function() {
        backgroundPosition -= parseFloat(myGame.getAttribute(`speed`));
        myGame.style.backgroundPosition = `${backgroundPosition}px 0`;    
    }, 50);
    
    // Enemies

    let leftPosition = 1000;
    const enemies = setInterval(function() {
        leftPosition -= parseFloat(myGame.getAttribute(`speed`));
        enemy.style.left = `${leftPosition}px`;  
        if (leftPosition < -100) {
            leftPosition = 1000;
            enemy.style.bottom = `${Math.floor(Math.random() * 160)}px`
            const currentScore = parseInt(scoreNumber.textContent);
            scoreNumber.textContent = currentScore + 1;
        }
    }, 50);

    // Speed up

    setInterval(function(){
        myGame.setAttribute(`speed`,parseFloat(myGame.getAttribute(`speed`)) + 1);
    }, 5000);
 
  

})