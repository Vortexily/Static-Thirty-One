# Static-Thirty-One
#### This is the game Thirty One/Blitz as a static webpage. The entire gamestate is compacted and encoded after each turn, allowing you to theoretically play a game through physical mail or carrier pigeons. This project was made as an experiment on digital communication. 

### Link

Click [here](https://vortexily.github.io/Static-Thirty-One/) for the link to the GitHub Page!

### On multiplayer

The gamestate is encoded after every turn using Base64, creating a manageable-sized string you can share with the next player of the game. The easiest, modern way is through texting, but the options are endless. The only requirement is that every player has access to the website, either through the Github Page or, if you are dedicated to not needing an internet connection to play this, by downloading the project and running the html locally. 

# The Game

### Overview

This version of Thirty One is played with 2-8 players, with a deck of 32 cards (7's and up). Each player has a hand of 3 cards and the goal is to get the highest value hand to a maximum of 31. This is done through swapping a card with one of the 3 cards on the table each turn. For more information, check the [wiki](https://en.wikipedia.org/wiki/Thirty-one_(card_game))

### Points

Cards are worth their rank, with kings, queens and jacks all worth 10 points, and aces worth 11. To add up points, cards must be of the same suit. E.g., a hand of K♥, 8♦, 7♥ is worth 17 points.

Alternatively, if each card is of the same rank, your total points becomes 30.5. E.g., a hand of all queens or all 9's. 

### Passing

Each turn you are required to swap a card, but if you do not see your hand improving, you can pass on your turn instead. Importantly, this means that you are out of the round and cannot swap anymore. Once all but one player have passed, the last player gets one more turn before the game ends.  
