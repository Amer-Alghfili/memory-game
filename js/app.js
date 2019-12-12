/*
 * Create a list that holds all of your cards
 */
const list = Array.from(document.getElementsByClassName('card'));
let openedCards = []; //holds all opened cards
const movesElement = document.querySelector('.moves'); 
const timer = document.querySelector('.timer');
let moves = 0;
movesElement.innerHTML = moves;
const stars = document.querySelector('.stars');
const restart = document.querySelector('.restart');
let numOfStars = 3;
let timerActive = false;
let startsFromZero = true;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function resetCards (list) {
    shuffle(list);
    const deck = document.querySelector('.deck');
    for(let i of list) {
        deck.removeChild(deck.firstElementChild);
    }
    const virtualElement = document.createDocumentFragment();
    for(let i of list) {
        if(i.classList.length > 0) {
            i.className = 'card';
        }
        virtualElement.appendChild(i);
        i.addEventListener('click', showCard);
    }
    deck.appendChild(virtualElement);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 
 function setTimer () {
     if(!timerActive) {
         return;
     }
     let timerElement = timer.innerHTML;
     if(startsFromZero) {
         startsFromZero = false;
         timerElement = '0:-1';
     }
     const arr = timerElement.split(':');
     let min = arr[0];
     let sec = arr[1];
     if(sec == 59) {
        min++;
        sec = 0;
    }
    else {
        sec++;
    }
     timer.innerHTML = `${min}:${sec}`;
     setTimeout(setTimer, 1000);
 }

 function displaySuccessfulMessage () {
    timerActive = false;
    const modal = document.createElement('div');
    const congratMessage = document.createElement('p');
    const numberOfMoves = document.createElement('p');
    const timeStamp = document.createElement('p');
    const winingStars = document.createElement('ul');
    const restartButton = document.createElement('button');
    for(let i=0; i<numOfStars; i++) {
        const li = document.createElement('li');
        const i = document.createElement('i');
        i.className = 'fa fa-star';
        li.insertAdjacentElement('afterbegin', i);
        winingStars.insertAdjacentElement('afterbegin', li);
    }
    congratMessage.textContent = 'Congratiolations !!!';
    numberOfMoves.textContent = `You won with ${movesElement.innerHTML} moves`;
    timeStamp.textContent = `Your win took ${document.querySelector('.timer').innerHTML}`;
    restartButton.textContent = 'Restart';
    restartButton.onclick = restartHandler;
    modal.className = 'win';
    modal.appendChild(winingStars);
    modal.appendChild(congratMessage);
    modal.appendChild(numberOfMoves);
    modal.appendChild(timeStamp);
    modal.appendChild(restartButton);
    document.querySelector('.container').appendChild(modal);
 }

 function starsDecrement () {
    if(moves === 21 || moves === 41) {
        numOfStars--;
        stars.removeChild(stars.firstElementChild);
    }
 }

 function moveIncrement () {
     movesElement.innerHTML = ++moves;
     starsDecrement();
}

 function removeFromOpenedCards (c) {
    let card;
    openedCards = openedCards.filter(function(el) {
        card = el;
        if(!card.matched) {
            card.classList.remove('open');
            card.classList.remove('show');
            card.addEventListener('click', showCard);
            c.classList.remove('open');
            c.classList.remove('show');
            c.addEventListener('click', showCard);
            return;
        }
        return card;
    });
 }

 function lockCardsInOpenedCards (card1, card2) {
     card1.matched = true;
     card2.matched = true;
    card1.classList.add('match');
    card2.classList.add('match');
 }

 function addCardToOpenedCards (card) {
    if(openedCards.length > 0) {
        let found = false;
        for(let i of openedCards) {
            if(i.childNodes[1].className === card.childNodes[1].className) {
                lockCardsInOpenedCards(i, card);
                found = true;
            }
        }
        if(!found) {
            if((openedCards.length + 1) % 2 === 0) {
                removeFromOpenedCards(card);
                return;
            }
        }
    }
    openedCards.push(card);
    if(openedCards.length === 16) {
        displaySuccessfulMessage();
    }
 }

 function displaySymbol (card) {
    moveIncrement();
    card.classList.add('open');
    card.classList.add('show');
    card.removeEventListener('click', showCard);
    setTimeout(function() {
        addCardToOpenedCards(card);
    }, 200);
 }

 function showCard(event) {
    if(event.target.nodeName === 'I') {
        return;
    }
    if(!timerActive){
        timerActive = true;
        setTimer();
    }
   displaySymbol(event.target);
 }

 function restartHandler() {
     window.location.reload();
 }

 resetCards(list);
 restart.addEventListener('click', restartHandler);
 