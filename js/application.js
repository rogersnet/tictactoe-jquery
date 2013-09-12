//we declare an array here to hold list of players
var players = [];

//variable to keep track of current player
var currentPlayer = "";

//variable to keep track of the winner
var gameWinner = "";

//we represent the board as an array of numbers.
//the board is initially filled with zeros. Once players 
//start playing, 1 or 2 is added to the respective cells
var board = [ [0,0,0], [0,0,0], [0,0,0]];

//The toast function shows messages from the game in 
//a mobile like toast ui.
var toast =  function(sMessage)
{
    var container = $(document.createElement("div"));
    container.addClass("toast");

    var message = $(document.createElement("div"));
    message.addClass("message");
    message.text(sMessage);
    message.appendTo(container);

    container.appendTo(document.body);

    container.delay(100).fadeIn("slow", function()
    {
        $(this).delay(2000).fadeOut("slow", function()
        {
            $(this).remove();
        });
    });
};


//The isGameOver function checks if a winning state has been 
//achieved or not
var isGameOver = function(playerCurr)
{
	var isOver = false;
	var matchNum = 0;
	if(playerCurr === players[0])
	{
		matchNum = 1;
	}
	else
	{
		matchNum = 2;
	}

	//check if the board contains a coninuous sequence of either a cross or a circle
	if( ( board[0][0] === matchNum && board[1][0] === matchNum && board[2][0] === matchNum ) || 
		( board[0][0] === matchNum && board[0][1] === matchNum && board[0][2] === matchNum ) || 
		( board[0][0] === matchNum && board[1][1] === matchNum && board[2][2] === matchNum ) ||
		( board[1][0] === matchNum && board[1][1] === matchNum && board[1][2] === matchNum ) ||
		( board[2][0] === matchNum && board[2][1] === matchNum && board[2][2] === matchNum ) || 
		( board[0][1] === matchNum && board[1][1] === matchNum && board[2][1] === matchNum ) ||
		( board[0][2] === matchNum && board[1][2] === matchNum && board[2][2] === matchNum ) || 
		( board[2][0] === matchNum && board[1][1] === matchNum && board[0][2] === matchNum ))
	{
		isOver = true;
		gameWinner  = playerCurr;
	}  


	//no continuous sequence found, check if there is any space left for play, if none
	//game ends in a draw
	if(isOver === false){
		isOver = true;
		for(var i=0; i<3; i++)
		{
			if(board[i][0] === 0 || board[i][1] === 0 || board[i][2] === 0)
			{
				isOver = false;
				break;
			}
		}
	}

	return isOver;
};

$(document).ready(function(){
	/*
	on click on next button, add the names of the two players 
	to the stack
	*/
	$("#next").click(function(event){
		event.preventDefault();

		var player1 = $("#player1").val();
		var player2 = $("#player2").val();

		if(player1 === "" || player2 === "")
		{
			toast("Please enter two players to begin the game!!!");
		}
		else
		{
			//add the two players to player stack
			players.push($("#player1").val());
			players.push($("#player2").val());

			//hide the form from the user
			$("#start").css({"display":"none"});
			$("#game").slideDown('slow');

			//set the current player
			currentPlayer = players[0];
			$("#turn").text("It's now " + currentPlayer + "'s turn" );
		}
	});

	$("#board tr td").click(function(event){
		event.preventDefault();

		//if we have got a game winner clicking further on the cell
		//should have no effect
		if(gameWinner != "")
			return;

		var cell_id    = $(this).attr('id');

		//clicking on a non-empty cell should have no effect as well
		if($(this).children().length != 0)
			return;

		var cell_row   = +cell_id.substring(4,5);
		var cell_col   = +cell_id.substring(5);
		var prevPlayer = currentPlayer;

		cell_row = cell_row - 1;
		cell_col = cell_col - 1;

		//toggle current player
		var tictacimg = "";
		if ( currentPlayer === players[0]){
			currentPlayer = players[1];
			tictacimg = $('<img src="img/circle.png" alt="circle" height="42" width="42">');
			board[cell_row][cell_col] = 1;
		} 
		else
		{
			currentPlayer = players[0];
			tictacimg = $('<img src="img/cross.png" alt="circle" height="42" width="42">');
			board[cell_row][cell_col] = 2;
		}

		$(this).append(tictacimg);

		var gameOver = isGameOver(prevPlayer);
		if(gameOver === true){
			if(gameWinner === "")
				$("#turn").text("Game ends in a draw!!!" );
			else
				$("#turn").text("Wow!! game won by " + gameWinner);

			//once the game is over, we will display a button here to 
			//restart the game
			$("div#reset").show();
		}
		else
		{
			$("#turn").text("It's now " + currentPlayer + "'s turn" );		
		}
	});

	//when the reset button is clicked we will replace the current board
	//with the initial state.
	$("div#reset > button").click(function(event){
		event.preventDefault();

		//empty all the board contents
		$("td").children().fadeOut(500).promise().then(function(){
			$("td").empty();
		});		

		//hide the reset button
		$("div#reset").hide();

		//the winner of the current game becomes the start player of the 
		//next game
		if(gameWinner != "")
		{
			currentPlayer = gameWinner;
		}

		//initialize the game winner and the board configuration
		gameWinner    = "";
		board 		  = [ [0,0,0], [0,0,0], [0,0,0]];

		//finally show the current's person turn message
		$("#turn").text("It's now " + currentPlayer + "'s turn" );	
	});
});

