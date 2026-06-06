for (const cardoption of document.getElementsByName("tc")) {
    cardoption.onclick = SelectSwap;
}

for (const cardoption of document.getElementsByName("hc")) {
    cardoption.onclick = SelectSwap;
}

document.getElementById("submit_code").onclick = DecodeGame;
document.getElementById("new_game").onclick = NewGame;
document.getElementById("swap").onclick = Swap;
document.getElementById("pass").onclick = Pass;
document.getElementById("copy_code").onclick = Copy;
document.getElementById("reload1").onclick = Reload;
document.getElementById("reload2").onclick = Reload;
document.getElementById("reload3").onclick = Reload;


const full_deck = [
"7 H", "8 H", "9 H", "10 H", "J H", "Q H", "K H", "A H", 
"7 D", "8 D", "9 D", "10 D", "J D", "Q D", "K D", "A D", 
"7 C", "8 C", "9 C", "10 C", "J C", "Q C", "K C", "A C",
"7 S", "8 S", "9 S", "10 S", "J S", "Q S", "K S", "A S", ];

var player = 1;
var player_count = 0;
var table_cards = [];
var player_hands = [];
var passed_players = [];
var choice_discard = 0;
var choice_draw = 0;
var game_ended = 0;
var end = false;

HideShowGame(false);

function EncodeGame() {

    if (player < player_count) {
        player += 1;
    } 
    else {
        player = 1;
    }
    
    table_cards_i = []
    for (let c of table_cards) {
        table_cards_i.push(full_deck.indexOf(c))
    }

    player_hands_i = []
    for (let h of player_hands) {
        for (let c of h) {
            player_hands_i.push(full_deck.indexOf(c))
        }
    }

    let gamestate = "";
    gamestate += String(player_count);
    gamestate += ",";
    gamestate += String(player);
    gamestate += ",";
    gamestate += String(game_ended);
    gamestate += ",";
    gamestate += String(table_cards_i);
    gamestate += ",";
    gamestate += String(player_hands_i);
    gamestate += ",";
    gamestate += "/";
    gamestate += String(passed_players);

    let encoded_gamestate = btoa(gamestate);

    document.getElementById("next_player").innerHTML = "Code for the next player (Player " + player + "):";
    document.getElementById("code_output").innerHTML = encoded_gamestate;
}

function DecodeGame() {
  //reset
    player = 1;
    player_count = 0;
    table_cards = [];
    player_hands = [];
    passed_players = [];
    choice_discard = 0;
    choice_draw = 0;
    game_ended = 0;
    end = false;
    const encoded_gamestate = document.getElementById("code_input").value

    let decoded_gamestate = atob(encoded_gamestate);


    let passed_p_array = decoded_gamestate.split("/")
    let str_passed_players = passed_p_array[1]
    passed_players = str_passed_players.split(",")
    passed_players = passed_players.map(Number) 
    passed_players = passed_players.filter((i) => i != 0)

    let values = decoded_gamestate.split(",");

    let int_values = values.map(Number);

    player_count = int_values[0];
    player = int_values[1];
    game_ended = int_values[2];

    for (let i of int_values.slice(3,6)) {
        table_cards.push(full_deck[i])
    }
   
    for (let i = 0; i < player_count; i++) {
        let hand = []
        for (let n of int_values.slice(6 + 3 * i, 9 + 3 * i)) {
        hand.push(full_deck[n])
        }
        player_hands.push(hand)
    }

    document.getElementById("new_game").disabled = true;
    document.getElementById("submit_code").disabled = true;
    HideShowGame(true);
    ProgressGame();

}

function NewGame() {
    player = 1;
    player_count = 0;
    table_cards = [];
    player_hands = [];
    passed_players = [];
    choice_discard = 0;
    choice_draw = 0;
    game_ended = 0;
    end = false;
    player_count = document.getElementById("player_count").value;

    document.getElementById("new_game").disabled = true;
    document.getElementById("submit_code").disabled = true;

    let shuffled_deck = full_deck.slice();
    for (let i = shuffled_deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled_deck[i], shuffled_deck[j]] = [shuffled_deck[j], shuffled_deck[i]];
    }

    table_cards = shuffled_deck.slice(0, 3);

    for (let i = 0; i < player_count; i++) {
        player_hands.push(shuffled_deck.slice(3 + 3*i, 6 + 3*i));
    }
    
    HideShowGame(true);
    ProgressGame();

}

function ProgressGame() {
    console.log(passed_players)
    document.getElementById("current_p").innerHTML = "Player " + player + "/" + player_count;


    document.getElementById("tc_1_t").innerHTML = ASCII(table_cards[0]);
    document.getElementById("tc_2_t").innerHTML = ASCII(table_cards[1]);
    document.getElementById("tc_3_t").innerHTML = ASCII(table_cards[2]);

    let hand = player_hands[player - 1];
    
    document.getElementById("h_1_t").innerHTML = ASCII(hand[0]);
    document.getElementById("h_2_t").innerHTML = ASCII(hand[1]);
    document.getElementById("h_3_t").innerHTML = ASCII(hand[2]);

    if (passed_players.includes(player)) {
        EndTurn();
    }

    if (game_ended === 1) {
        EndGame();
    }
    if (passed_players.length + 1 >= player_count) {
        document.getElementById("turn_info").innerHTML = "Everyone else passed! Final swap";
        
        document.getElementById("turn_info").style.backgroundColor =  '#771335';
        if (!passed_players.includes(player)) {
        game_ended = 1; }
        
    }

}

function SelectSwap() {
    if (document.getElementById("h_1").checked === true) {
        choice_discard = 1;
    }
    else if (document.getElementById("h_2").checked === true) {
        choice_discard = 2;
    }
    else if (document.getElementById("h_3").checked === true) {
        choice_discard = 3;
    }

    if (document.getElementById("tc_1").checked === true) {
        choice_draw = 1;
    }
    else if (document.getElementById("tc_2").checked === true) {
        choice_draw = 2;
    }
    else if (document.getElementById("tc_3").checked === true) {
        choice_draw = 3;
    }

    if (choice_discard !== 0 && choice_draw !== 0 && end === false) {
        document.getElementById("swap").disabled = false;
    }
}

function Swap() {
    let hand = player_hands[player - 1];
  
    table_cards.push(hand[choice_discard - 1]);
    hand.splice(choice_discard - 1, 1);

   
    hand.push(table_cards[choice_draw - 1]);
    table_cards.splice(choice_draw - 1, 1);

    document.getElementById("tc_1_t").innerHTML = ASCII(table_cards[0]);
    document.getElementById("tc_2_t").innerHTML = ASCII(table_cards[1]);
    document.getElementById("tc_3_t").innerHTML = ASCII(table_cards[2]);
    document.getElementById("h_1_t").innerHTML = ASCII(hand[0]);
    document.getElementById("h_2_t").innerHTML = ASCII(hand[1]);
    document.getElementById("h_3_t").innerHTML = ASCII(hand[2]);
    
    EndTurn()
}

function Pass() {
    passed_players.push(player)
    EndTurn()
}

function EndTurn() {
    document.getElementById("end_screen").open = true
    document.getElementById("score").innerHTML = GetHandValue(player_hands[player - 1]);
   
    end = true
    document.getElementById("swap").disabled = true;
    document.getElementById("pass").disabled = true;

    EncodeGame()
}

function EndGame() {
    document.getElementById("final_scores").open = true
    let scores_text = ""
    let scores = []
    for (hand of player_hands) {
        scores_text += "Player " + (player_hands.indexOf(hand) + 1) + "'s score: " + (GetHandValue(hand)) + "<br>";
        scores.push(Number(GetHandValue(hand)))
    }
    document.getElementById("scores_text").innerHTML = scores_text
    const winner = scores.indexOf(Math.max(...scores)) + 1
    document.getElementById("winner").innerHTML = "Player " + winner + " wins with " + Math.max(...scores) + " points!"
}

function GetHandValue(value_hand) {
    let total = 0;
    let total_h = 0;
    let total_d = 0;
    let total_s = 0;
    let total_c = 0;
    let hand_values = [];
    let real_hand_values = []
   

    for (let card of value_hand) {
        card = card.split(" ");
        real_hand_values.push(card[0])
        if (card[0] === "J" || card[0] === "Q" || card[0] === "K") {
            card[0] = 10 }
        else if (card[0] === "A") {
            card[0] = 11 }
        else {
            card[0] = Number(card[0])}

        hand_values.push(card[0]);

        if (card[1] === "H") {
            total_h += card[0] } 
        else if (card[1] === "D") {
            total_d += card[0] }
        else if (card[1] === "S") {
            total_s += card[0] }
        else if (card[1] === "C") {
            total_c += card[0] }
    }
    
    if (real_hand_values[0] === real_hand_values[1] && real_hand_values[1] === real_hand_values[2]) {
        total = 30.5 }
    else {
        total = Math.max(total_c, total_h, total_d, total_s) }

    return total
}

function ASCII(card) {
    

    let scard = card.split(" ")
    let suit

    if (scard[1] === "H") {suit = "<span style='color: #771335'>♥</span>";}
    else if (scard[1] === "D") {suit = "<span style='color: #771335'>♦</span>";}
    else if (scard[1] === "S") {suit = "♠";}
    else if (scard[1] === "C") {suit = "♣";}

    //return suit + "--" + suit + "<br>" + "| "+ scard[0] + " |" + "<br>" + suit + "--" + suit + '<br>'
    return "<br> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + suit + "<br>" + scard[0] + "<br>" + suit + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br>"
}

function Copy(){
    let copyText = document.getElementById("code_output");

   // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.innerHTML);
    
    document.getElementById("copy_code").innerHTML = "Copied!";
    setTimeout(function() {document.getElementById("copy_code").innerHTML = "Copy"}, 1000);

}

function Reload() {
    window.location.reload();
    window.scrollTo(top);
    
}

function HideShowGame(state) {
    const game_window = document.getElementById("game_window");
    for (const child of game_window.children) {
        if (state === false) {
            child.style.visibility = 'hidden';
        }
        else {
            child.style.visibility = 'visible';
        }
    }
}