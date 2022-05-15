function Control(){
	var first_selected;
	var second_selected;
	var block = false;
	var time_sleep = 950;
	var event_control = this;

	this.addEventListener =  function (eventName, callback){
		event_control[eventName] = callback;
	};

	this.do_logic =  function (card,callback){
		if (!card.block && !block) {
			if (first_selected == null){
				first_selected = card;
				card.visible = true;
			}else if (second_selected == null && first_selected != card){
				second_selected = card;
				card.visible = true;
			}

			if (first_selected != null && second_selected != null){
				block = true;
				var timer = setInterval(function(){
					if (second_selected.equals(first_selected)){
						first_selected.block = true;
						second_selected.block = true;
						event_control["true"](); 
					}else{
						first_selected.visible  = false;
						second_selected.visible  = false;
						event_control["false"]();
					}        				  		
					first_selected = null;
					second_selected = null;
					clearInterval(timer);
					block = false;
					event_control["show"]();
				},time_sleep);
			} 
			event_control["show"]();
		};
	};

}

function Card(picture){
	var FOLDER_IMAGES = 'images/'
	var IMAGE_QUESTION  = "question.png"
	this.picture = picture;
	this.visible = false;
	this.block = false;

	this.equals =  function (memory_game){
		if (this.picture.valueOf() == memory_game.picture.valueOf()){
			return true;
		}
		return false;
	}
	this.getPathCardImage =  function(){
		return FOLDER_IMAGES+picture;
	}
	this.getQuestionImage =  function(){
		return FOLDER_IMAGES+IMAGE_QUESTION;
	}
}

function MemoryGame (cards , Control,scoreBoard){
	var col  = 5;
	var line = 4;
	this.cards = cards;
	var logic = Control;
	var score_board_control = scoreBoard;

	this.clear = function (){
		var game = document.getElementById("game");
		game.innerHTML = '';
	}

	this.show =  function (){
		this.clear();
		score_board_control.updScore();
		var cardCount = 0;
		var game = document.getElementById("game");
		for(var i = 0 ; i < line; i++){
			for(var j = 0 ; j < col; j++){
				card = cards[cardCount++];
				var cardImage = document.createElement("img");
				if (card.visible){
					cardImage.setAttribute("src",card.getPathCardImage());
				}else{
					cardImage.setAttribute("src",card.getQuestionImage());
				}
				cardImage.onclick =  (function(position,memory_game) {
					return function() {
						card = cards[position];
						var callback =  function (){
							memory_game.show();
						};
						logic.addEventListener("true",function (){
							score_board_control.increment_score();
							score_board_control.updScore();
						});
						logic.addEventListener("false",function (){
							score_board_control.decrement_score();
							score_board_control.updScore();
						});

						logic.addEventListener("show",function (){
							memory_game.show();
						});

						logic.do_logic(card);
						
					};
				})(cardCount-1,this);

				game.appendChild(cardImage);
			}
			var br = document.createElement("br");
			game.appendChild(br);
		}
	}
}

function BuilderCardGame(){
	var picture = new Array ('1.png','1.png','2.png','2.png',
		'3.png','3.png','4.png','4.png','5.png','5.png','6.png','6.png',
		'7.png','7.png','8.png','8.png','9.png','9.png','10.png','10.png');

	this.doCardGame =  function (){
		shuffle_pictures();
		cards  = buildCardGame();
		memory_game =  new MemoryGame(cards, new Control(), new ScoreBoard())
		memory_game.clear();
		return memory_game;
	}

	var shuffle_pictures = function(){
		var i = picture.length, j, tmpi, tmpj;
		if ( i == 0 ) return false;
		while ( --i ) {
			j = Math.floor( Math.random() * ( 20 ) );
			tmpi = picture[i];
			tmpj = picture[j];
			picture[i] = tmpj;
			picture[j] = tmpi;
		}
	}

	var buildCardGame =  function (){
		var countCards = 0;
		cards =  new Array();
		for (var i = picture.length - 1; i >= 0; i--) {
			card =  new Card(picture[i]);
			cards[countCards++] = card;
		};
		return cards;
	}
}

function ScoreBoard (){
	var SCORE = 100;
	var PUAN = 10;
	var TEXT = "Score : "

	var TOTAL_CORRECT = 10;
	var MATCHING = 0;

	this.updScore =  function (){
		var score_div = document.getElementById("score");
		score_div.innerHTML =  TEXT + SCORE;
	}

	this.increment_score =  function (){
		MATCHING++;
		SCORE = SCORE + PUAN;
		if (MATCHING ==  TOTAL_CORRECT){
			alert("Game Over!\nYour score: " + SCORE);
		}
	}

	this.decrement_score = function (){
		SCORE = SCORE - PUAN;
	}
}

function GameControl (){
}

Control.createGame = function(){
	var builderCardGame =  new BuilderCardGame();
	memory_game = builderCardGame.doCardGame();
	memory_game.show();
}