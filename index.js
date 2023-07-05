
// This code initializes a set of tabs with the ID "tabs" and sets 
//the third tab as the initially selected tab when the page loads.
$(function() {      
    $("#tabs").tabs({active:2});
});

// Create variables
let num_cards = 48;
let image_urls = [];

// This function fills an array with the URLs of 24 images numbered from 1 to 24.
const fillImageUrls = () => {
    for(let i = 1; i <= 24; i++) {
        image_urls.push(`./images/card_${i}.png`)
    }
}

// Create array
let images = [];

// Preloads a set of images by creating new Image objects
// Setting their src attributes to the URLs in the input array
const preloadImages = (image_urls) => {
    for(let i = 0; i < image_urls.length; i++) {
        images[i] = new Image();
        images[i].src = image_urls[i];
    }
}

// Calling functions
fillImageUrls();
preloadImages(image_urls);

// Create array
cards = [];

// Fills an array with objects
const fillCards = (images) => {
    for(let i = 1; i <= images.length; i++) {
        cards.push({id: `card_${i}`, src:images[i-1].src});
    }
}

// Calling function
fillCards(images);

// This function retrieves game settings and high score data from session storage and displays it on the game page.
const displayDataFromSession = () => {


    
    // Retrieve the game settings object from session storage.
    const memory_game_settings = JSON.parse(window.sessionStorage.getItem("memory_game_settings"));
    // Select the player element on the game page.
    const player = $("#player");
    
    
        $('#save_settings').click(function() {
            if ($('#player').length === 0) {
                alert("Handler for .click() called.");
            }
        });

    // If the game settings object exists and contains a player name, display it on the game page.
    if (memory_game_settings && memory_game_settings.player_name) {
        player.text(`Player: ${memory_game_settings.player_name}`);
      } else {
        player.text("Please enter Player Name");
        $("#tabs").tabs({active:2});
      }
      
    // Set the default number of cards to 48.    
    let num_cards = 48;
    // If the game settings object exists and contains a number of cards, use that value instead.
    if( memory_game_settings && memory_game_settings.num_cards )
        num_cards = memory_game_settings.num_cards;

    // Generate a shuffled array of card objects based on the number of cards specified.
    let allCards = getShuffledCards(num_cards);
    generateGameCards(allCards,num_cards);

    // Add a click event listener to the "Save Settings" button on the game page.
    const saveSettingsButton = document.getElementById('save_settings');
    saveSettingsButton.addEventListener("click",onSaveSettings);

    // Retrieve the high score object from session storage.
    const high_score = JSON.parse(window.sessionStorage.getItem("high_score"));
    console.log("high_score",high_score,window.sessionStorage.getItem("high_score"));
    
    // If the high score object exists, display it on the game page.
    if( high_score )
        $("#high_score").text(`High Score: ${high_score}%`);

}


const onSaveSettings = (settings) => {
    // Get the player name value from the player name input element on the game page.
    const playerName = $("#player_name").val();

    // Get the number of cards value from the number of cards input element on the game page.
    const numCards = $("#num_cards").val();

    // Create a game settings object with the player name and number of cards.
    let memory_game_settings = {"player_name":playerName, "num_cards":numCards};

    // Save the game settings object to session storage.
    window.sessionStorage.setItem("memory_game_settings",JSON.stringify(memory_game_settings));

    // Log the game settings object to the console for debugging purposes.
    console.log(JSON.parse(window.sessionStorage.getItem("memory_game_settings")));

    // Activate the first tab on the game page, which displays the game cards.
    $("#tabs").tabs({active:0});

    // Update the game page with the new game settings and high score.
    displayDataFromSession();
}

// This code runs when the page finishes loading.
window.onload = () => {
    // Set the initial values for the moves count and matched count variables to 0.
    movesCount = 0;
    matchedCount = 0;

    // Update the game page with the current game settings and high score from session storage.
    displayDataFromSession();
} 

// Create variables
let movesCount = 0;
let matchedCount = 0;
let gameSpace = document.getElementById("cards");
let firstCard = false;
let firstCardValue;
let secondCard = false;
let clicksCount = 0;


// This function creates an array of shuffled game cards.

const getShuffledCards = (numOfCards) => {
    // Calculate the number of rows needed for the game board based on the number of cards.
    const rows = numOfCards / 8;

    // Create a copy of the cards array.
    let tempCards = [...cards];

    // Create an empty array to hold the selected cards.
    let pickedCards = [];

    // Divide the number of cards by 2 to get the number of unique card pairs.
    let size = numOfCards / 2;

    // Loop through the array of cards and randomly select cards until the required number of unique pairs is reached.
    for (let i = 0; i < size; i++) {
        // Generate a random index to select a card from the tempCards array.
        const randomInd = Math.floor(Math.random() * tempCards.length);
        
        // Add the randomly selected card to the pickedCards array.
        pickedCards.push(tempCards[randomInd]);

        // Remove the selected card from the tempCards array to prevent duplicates.
        tempCards.splice(randomInd, 1);
    }

    // Return the shuffled array of game cards.
    return pickedCards;
}


const generateGameCards = (pickedCards,numOfCards = 48) => {
    // Clear the game space before generating new cards
    gameSpace.innerHTML = "";

    // Duplicate the selected cards and shuffle them randomly
    pickedCards = [...pickedCards, ...pickedCards];
    pickedCards.sort(() => Math.random() - 0.5);

    // Calculate the number of rows based on the number of cards
    const rows = numOfCards / 8;

    // Generate the HTML for the game cards and add it to the game space
    for(let i = 0; i < numOfCards; i++) {
        gameSpace.innerHTML += `
        <div class="cards-item" card-value="${pickedCards[i].id}" id="${i}">
            <div class="card-before-flip"></div>
            <a class="card-after-flip">
                <img src="${pickedCards[i].src}" alt="" />
            </a>
        </div>
        `;
    }

    //This is used to determine the number of columns in the grid layout.
    gameSpace.style.gridTemplateColumns = `repeat(8,auto)`;

    //selects all elements with the class 'cards-item' and assigns them to the cards_items variable.
    cards_items = document.querySelectorAll(".cards-item");
    //loop iterates over each of the cards_items elements, and for each one it adds a click event listener.
    cards_items.forEach( (card) => {
        card.addEventListener("click", () => {
            //condition check
            if (!card.classList.contains("matched") && !card.classList.contains("flipped") && clicksCount < 2 ) {
                card.classList.add("flipped");
                clicksCount += 1;

                console.log("contains",card.classList.contains("matched"));
                // Check if firstCard is null/undefined
                if(!firstCard) {
                    // Assign card to firstCard
                    firstCard = card;
                    // Assign card-value attribute of card to firstCardValue
                    firstCardValue = card.getAttribute("card-value");
    
                } else {
                    movesCount = movesCount + 1;
                    secondCard = card;
                    // Assign card-value attribute of card to secondCardValue
                    let secondCardValue = card.getAttribute("card-value");

                    if(firstCardValue == secondCardValue) {
                        // create a selector string to target the matched cards
                        let target = "div[card-value=" + firstCardValue + "]";
                        // animate the matched cards
                        $(target).delay(1000).animate({ left:"50px",opacity: 0 })
                        matchedCount += 1;
                        // reset the firstCard variable to false
                        firstCard = false;


                        // Set timeout for 2 seconds after game completion
                        setTimeout( () => {
                            // Check if all cards are matched
                            if(matchedCount == numOfCards/2) {
                                // Calculate score
                                const score = Math.floor((matchedCount/movesCount) * 100);
                                console.log(JSON.parse(window.sessionStorage.getItem("high_score")));
                                // Get high score from session storage
                                let highScore = JSON.parse(window.sessionStorage.getItem("high_score"));
                                
                                if( highScore && Number(highScore) < Number(score) ) {
                                    highScore = score;
                                    // Update high score in session storage
                                    window.sessionStorage.setItem("high_score",JSON.stringify(highScore));
                                    // Update high score in HTML
                                    $("#high_score").text(`High Score: ${highScore}%`);
                                } else {
                                    if( ! highScore ) {
                                        // Set high score in session storage
                                        window.sessionStorage.setItem("high_score",JSON.stringify(score));
                                        // Update high score in HTML
                                        $("#high_score").text(`High Score: ${score}%`);
                                    }
                                }
                                // Update correct score in HTML
                                $("#correct").text(`Correct: ${score}%`);
                            }
                        },2000)
                    } else {
                        let firstCardClone = firstCard;
                        let secondCardClone = secondCard;

                        console.log(firstCardClone.id,secondCardClone.id);
                        // Resets firstCard and secondCard to false
                        firstCard = false;
                        secondCard = false;
                        // Animates the clones to fade out and disappear after a delay of 2 seconds
                        $("#" + firstCardClone.id).delay(2000).animate({opacity:0},"slow");
                        $("#" + secondCardClone.id).delay(2000).animate({opacity:0},"slow");

                        // Removes the "flipped" class from the clones after a delay of 2.2 seconds
                        setTimeout(() => {
                                firstCardClone.classList.remove("flipped");
                                secondCardClone.classList.remove("flipped");
                        }, 2200);
                        // Animates the clones to fade back in after a delay of 2.2 seconds
                        $("#" + firstCardClone.id).animate({opacity:1},"slow");
                        $("#" + secondCardClone.id).animate({opacity:1},"slow");
                    }
                }
                // set a timeout of 3 seconds
                setTimeout( () => {
                    // check if the player has clicked on two cards
                    if(clicksCount === 2){
                        // reset clicksCount to 0 so the player can select two new cards in the next turn
                        clicksCount = 0;
                    }
                },3000)
            }
        } );
    } );
};
