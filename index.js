//player class 
class Player {

    constructor(name, score) {
      this.name = name;
      this.score = score;
    }

    addScore(n) {
        this.score += n;
    }   

    getScore() {
        return this.score;
    }

    getName() {
        return this.name;
    }
}


let player1 = document.getElementById('player1');
let player2 = document.getElementById('player2');
let first = document.getElementById('first');
let sec = document.getElementById('sec');
let gamePlayer1 = document.getElementById('gamePlayer1');
let gamePlayer2 = document.getElementById('gamePlayer2');
let startGame = document.getElementById('startgame');
let cat = document.getElementById('categoryDiv');
let third = document.getElementById('third');
let playerID = document.getElementById('playerID');
let question = document.getElementById('question');
let btndiv = document.getElementById('btndiv');
let btn = document.getElementById('btn');
let score1 = document.getElementById('score1');
let score2 = document.getElementById('score2');
let playagain = document.getElementById('playagain');

var p1, p2;

// When Start btn is clicked object are initilize for player with name and moves to next Interface
startGame.addEventListener('click', () => {
    p1 = new Player(player1.value, 0);
    p2 = new Player(player2.value, 0);
    first.style.display = 'none';
    sec.style.display = 'block';
    cat.style.display = 'block';

    gamePlayer1.innerHTML = `Player one :${p1.getName()}`;
    gamePlayer2.innerHTML = `Player two : ${p2.getName()}`;


});

// list of category 
let category =  {
    "arts_and_literature" : true,
    "geography" : true,
    "history" : true ,
    "science" : true,
    "sports_and_leisure" : true 
};


// Dyanmically allocating the option in select 
let sel = document.createElement('option')
sel.text  = 'select the option'
document.getElementById('category').appendChild(sel);
for(let s of Object.keys(category)){
    let option = document.createElement('option');
    option.value = category[s];
    option.text = s;
    document.getElementById('category').appendChild(option);
}

// When the select change on change event is triggered and quiz game start 
let categorylist = document.getElementById('category');
categorylist.addEventListener('change', () => {
    
    var selectedCategory = categorylist.options[categorylist.selectedIndex].text;
    
    categorylist.options[categorylist.selectedIndex].disabled = true; // disabling the select category so that it can't be reuse again
    category[selectedCategory] = false; // setting the category value as false ( it will be useful to end the game when all the category is selected 
    cat.style.display = 'none';
    sec.style.display = 'none';
    game(selectedCategory, 2, 2, 2); // calling the game function
    third.style.display = 'block';
});

end.addEventListener('click', () => {
       endFunction();
});

playagain.addEventListener('click', () => {
    fourth.style.display = 'none';
    first.style.display = 'block';
    player1.value = '';
    player2.value = '';
    const option = categorylist.options.length;
        for(let i = 0; i < option; i++){
            categorylist.options[i].removeAttribute('disabled');
            category[categorylist.options[i].text] = true;
        }
        
    });


const game = async(selectedCategory, easy, medium, hard) => { // async function 


    while(easy != 0) {     // to display two easy question first

        if(easy == 2){
            playerID.innerHTML = `Player Turn : ${p1.getName()}-------------------------          Level : Easy`;
        }else{
            playerID.innerHTML = `Player Turn : ${p2.getName()}--------------------------          Level : Easy`; ;
        }

        await displayQuestion(selectedCategory, 'easy');   // calling the display function 
        easy--;

    }

    while(medium != 0) {

        if(medium == 2){
            playerID.innerHTML = `Player Turn : ${p1.getName()}------------------------               Level : medium`;
        }else{
            playerID.innerHTML = `Player Turn : ${p2.getName()}-----------------------               Level : medium`;
        }
        await displayQuestion(selectedCategory, 'medium');
        medium--; 

    }

    while(hard != 0) {
        
        if(hard == 2){
            playerID.innerHTML =`Player Turn : ${p1.getName()}------------------------                Level : hard`;
        }else{
            playerID.innerHTML = `Player Turn : ${p2.getName()}-----------------------               Level : hard`;
        }
        await displayQuestion(selectedCategory, 'hard');
        hard--; 

    }
    cat.style.display = 'block';
    sec.style.display = 'block';
    third.style.display = 'none';
    end.style.display = 'block';
    isCategoryEmpty(); // calling the checking functon if all the category is selected , then game is ended 

}
const displayQuestion = async (selectedCategory, difficulty) => {
    try {
        // fetch the data from the API
        const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&difficulties=${difficulty}&limit=1`);
        // Converting in json data format 
        const data = await response.json();

        // setting the question 
        question.innerHTML = data[0].question.text;

        // displaying the options 
        let answers = data[0].incorrectAnswers;
        answers.push(data[0].correctAnswer);
        answers.sort();
        btndiv.innerHTML = '';
        answers.forEach(answer => {
            const option = document.createElement('button');
            option.innerHTML = answer;
        
            option.addEventListener('click', () => {              // Handling the click event if the option is clicked 
                answerSelect(option, data[0].correctAnswer,difficulty);      // function here update the score if the answer is correct
            });

            btndiv.appendChild(option);
        });
        await waitForUserSelection();         // Making the javascript wait till the user response 

    } catch (error) {         // handing the error
        console.error(error);
    }
};

// this is function makes javascript wait till the user response 
const waitForUserSelection = () => {
    return new Promise(resolve => {
        const buttons = btndiv.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                resolve();
            }, { once: true }); 
        });
    });
};

// function checks if the select option is correct then corresponding score update to user who clicked 
const answerSelect= (selectedOption, correctAnswer,difficulty) => {
    const selectedAnswer = selectedOption.innerHTML;

    if (selectedAnswer === correctAnswer) {
        if (playerID.innerHTML === p1.getName()) {
            if(difficulty === 'easy'){
                p1.addScore(10);
            }else if(difficulty === 'medium'){
                p1.addScore(15);
            }else{
                p1.addScore(20);
            }
        } else {
            if(difficulty === 'easy'){
                p2.addScore(10);
            }else if(difficulty === 'medium'){
                p2.addScore(15);
            }else{
                p2.addScore(20);
            }
        }
    }

    btndiv.innerHTML = '';
};


// this function checks if all the category is selected then end function is invoked 
function isCategoryEmpty(){
    
    let count = 0;
    for(let s of Object.keys(category)){
        if(category[s] == false){
            count++;
            console.log(count);
        }else
        return;
    }

    if(count == 5){
        // then function display the result 
        endFunction();
    }
}


// this function display the result 
const endFunction = () => {
    third.style.display = 'none';
    end.style.display = 'none';
    fourth.style.display = 'block';
    cat.style.display = 'none';
    sec.style.display = 'none';

    score1.innerHTML = `The score of ${p1.getName()} : ${p1.getScore()}`;
    score2.innerHTML =  `The score of ${p2.getName()} : ${p2.getScore()}`;
    // Player with high score is declared as the winner 
    if(p1.getScore() > p2.getScore()){
        document.getElementById('win').innerHTML = `${p1.getName()} is the winner`;
    }else if(p1.getScore() < p2.getScore()){
        document.getElementById('win').innerHTML = `${p2.getName()} is the winner`;
    }
    else{
        document.getElementById('win').innerHTML = `It's a tie`;
    }   
}



