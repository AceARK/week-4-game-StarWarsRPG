"use strict";

// Character type
class Character {
	// constructor to initialize required values
	constructor(name,initialAttackPower,healthPoints,counterAttackPower) {
		this.name = name;
		this.initialAttackPower = initialAttackPower; 
		this.healthPoints = healthPoints; 
		this.counterAttackPower = counterAttackPower;
		this.attackPower = 0;
	}
	
	// function to attack defender
	attack(defenderObject) {
		// increase attacker's attack power on each attack
		this.attackPower = this.attackPower + this.initialAttackPower;
		// call defender's defend() function
		defenderObject.defend(this);
	}

	// function to defend attacker
	defend(attackerObject) {
		// reduce defender's health points as a result of attacker's attack
		this.healthPoints = this.healthPoints - attackerObject.attackPower;
		// If defender is not dead, launch counter attack
		if(this.healthPoints > 0) {
			attackerObject.counterAttack(this);
		}
	}

	// function to counter-attack defender
	counterAttack(defenderObject) {
		// reduce attacker's health points from defender's attack
		this.healthPoints = this.healthPoints - defenderObject.counterAttackPower;		
	}

}


// declaring variables required for game
var attacker, defender, attackerLocked, defenderLocked, attackEnabled, contenderDefeated;

$(document).ready(function(){

	// initialize game
	resetGame();

	$("#directions").html("Choose your Attacker by clicking on a player image.");

	// On click of contender
	$(".contender").on("click", function() {	
		if(!attackEnabled) {
			var attackerInfo = $(".attacker").data("info");
	        var defenderInfo = $(".defender").data("info");
	        
	        if(attackerInfo == "" && attackerLocked) {
	            attackerLocked = false;
	            $("#lockAttacker").prop('disabled', false);
	        } else if(defenderInfo == "" && attackerLocked){
	            defenderLocked = false;
	            $("#lockDefender").prop('disabled', false);
	        }
	        // If attacker is not locked yet,
			if(!attackerLocked) {
				$(".attacker-image").addClass("attacker-glow");
				$("#directions").html("To confirm selection, click on Lock Attacker.<br>Or select another contender.");
				// attacker exists
				if(attackerInfo != "") {
	                // show previously selected contender detail
					toggleContenderDetail(attackerInfo.originDivId);
				} 
				var selectedPlayerId = "#" + $(this).attr('id');
				$(".attacker-image").html($(selectedPlayerId + ' .contender-image').html()); 
				
				// hide currently selected contender detail
				toggleContenderDetail(selectedPlayerId);
	            // transfer data attributes of contender to attacker for attacker object creation
				$(".attacker").data("info", $(this).data("info"));
				// add attacker name
				$(".attacker .name").html($(".attacker").data("info").name);

				// Else if defender is not locked
			} else if(!defenderLocked) {
				$("#directions").html("To confirm selection, click on Lock Defender.<br>Or select another contender.");	
				// if previous defender exists
				if(defenderInfo != "") {
	                toggleContenderDetail(defenderInfo.originDivId);
				}
				var selectedPlayerId = "#" + $(this).attr('id');
				// transfer image from contender to defender div
				$(".defender .defender-image").html($(selectedPlayerId + ' .contender-image').html());
	            
	            toggleContenderDetail(selectedPlayerId);
				// transfer data attributes to defender for defender object creation
				$(".defender").data("info", $(this).data("info"));	
				// add defender name
				$(".defender .name").html($(".defender").data("info").name);		
			}
		}
		     
	});

	// Creating new Character object called attacker on locking attacker
	// on click of lock attacker button
	$("#lockAttacker").on("click", function() {
		// play sound
		$("#lockButton")[0].currentTime = 0;
    	$("#lockButton")[0].play();
		// Notification to user
		$("#directions").html("Choose a Defender by clicking on a player image.");
		// attacker locked flag set to true
		attackerLocked = true;
		// variable to get data attributes of attacker 
		var attackerInfo = $(".attacker").data("info");
		// create new object and initializing values based on data attributes
		attacker = new Character(attackerInfo.name, attackerInfo.attackPower, attackerInfo.healthPoints,0);
		// update attacker stats
		$("#attackerHealth").html(attackerInfo.healthPoints);
		$("#attackPoints").html(attackerInfo.attackPower);
		// disable lock button
		$(this).prop('disabled', true);
	});

	// Creating new Character object called defender 
	// on click of lock defender button
	$("#lockDefender").on("click", function() { 
		// play sound
		$("#lockButton")[0].currentTime = 0;
    	$("#lockButton")[0].play();
		// notifying user
		$("#directions").html("Click Attack button to attack.");
			// defender lock flat set to true
			defenderLocked = true;
			// get data attributes of defender
			var defenderInfo = $(".defender").data("info");
			// create defender object and initialize values using data attributes
			defender = new Character(defenderInfo.name, 0, defenderInfo.healthPoints, defenderInfo.counterAttackPower);
			// update attacker stats
			$("#defenderHealth").html(defenderInfo.healthPoints);
			$("#counterAttackPoints").html(defenderInfo.counterAttackPower);
			// disable lock defender button
			$(this).prop('disabled', true);
			// enable attack button
			$("#attack").prop('disabled', false);
	});

	// Commencing attack sequence on button click
	$("#attack").on("click", function(){
		// play sound
		$("#attackSound")[0].currentTime = 0;
    	$("#attackSound")[0].play();
    	// notify user
    	$("#directions").html("Click Attack button to attack again.");
		// perform only if attacker and defender are locked on
		if(attackerLocked && defenderLocked) {
			// set attack enabled flag to true
			attackEnabled = true;
			// call attack()
			attacker.attack(defender);
			// update attacker stats
			$("#attackerHealth").html(attacker.healthPoints);
			$("#attackPoints").html(attacker.attackPower);
			// update defender stats
			$("#defenderHealth").html(defender.healthPoints);
			$("#counterAttackPoints").html(defender.counterAttackPower);
			// checking for win condition
			if(defender.healthPoints <= 0) {
				// Notify user
				$("#directions").html("Defender defeated. Choose another Defender.");
				var defenderInfo = $(".defender").data("info");
				// move defender to defeated area
				$(".defeated .defeated-image").append($(".defender .defender-image").html());
				$(".defender .defender-image").empty();
				$(".defender .name").empty();

				// remove name and hp of defeated from contender div
				$(defenderInfo.originDivId +" .name").hide();
				$(defenderInfo.originDivId +" .hp").hide();

				$(".defender").data("info", "");

				// win condition
				if(contenderDefeated >= 2) {
					$(".comments").addClass("winMessage");
					$("#directions").html("You win. Click the Reset button to play again.");
					$(".attacker-image").removeClass("attacker-glow");
					$(".attacker-image").addClass("winner");
					$("#reset").show();
				} else {
					// else incremenet defeated counter
					contenderDefeated++;
					// enable defender lock button again to wait for new defender
					defenderLocked = true;
					$("#lockDefender").prop('disabled', true);
				}
				// disable attack button 
				$("#attack").prop('disabled', true);
				attackEnabled = false;
				
			} // loss condition
			else if(attacker.healthPoints <= 0) {
				$(".attacker-image").removeClass("attacker-glow");
				$(".attacker-image").addClass("loser");
				$(".comments").addClass("lossMessage");
				$("#directions").html("You lose. Click the Reset button to play again.");
				// disable attack button
				attackEnabled = false;
				$("#attack").prop('disabled', true);
				$("#reset").show();
			}
		}
	});

	// call reset() function on click of button
	$("#reset").on("click", function() {
		resetGame();
	});

});

// generate random attack power, health points and counter attack power
function generateHP() {
	return Math.floor(Math.random()* 200 + 100);
}

function generateAP() {
	return Math.floor(Math.random()* 30 + 1);
}

function generateCAP() {
	return Math.floor(Math.random()* 25 + 15);
}

// reset function
function resetGame() {
		// initialize player's data attributes
	$("#player1").data("info", {"name":"Obi-Wan Kenobe", "healthPoints":generateHP(), "attackPower":generateAP(), "counterAttackPower":generateCAP(), "originDivId": "#player1"});
	$("#player2").data("info", {"name":"Darth Vader", "healthPoints":generateHP(), "attackPower":generateAP(), "counterAttackPower":generateCAP(), "originDivId": "#player2"});
	$("#player3").data("info", {"name":"Luke Skywalker", "healthPoints":generateHP(), "attackPower":generateAP(), "counterAttackPower":generateCAP(), "originDivId": "#player3"});
	$("#player4").data("info", {"name":"Darth Maul", "healthPoints":generateHP(), "attackPower":generateAP(), "counterAttackPower":generateCAP(), "originDivId": "#player4"});

	// set all flags to false and defeated counter to 0
	attackerLocked = true;
	defenderLocked = true;
	attackEnabled = false;
	contenderDefeated = 0;

	$('.contender-image').show();
	$('.contender .name').show();
	$('.contender .hp').show();

	// disable defender lock button until after attacker locked
	$("#lockDefender").prop('disabled', true);
	// disable attacker lock button 
	$("#lockAttacker").prop('disabled', true);
	// disable attack button until after attacker and defender locked
	$("#attack").prop('disabled', true);

	$("#player1 .name").html($("#player1").data("info").name);
	$("#player1 .hp").html("HP: " + $("#player1").data("info").healthPoints);

	$("#player2 .name").html($("#player2").data("info").name);
	$("#player2 .hp").html("HP: " + $("#player2").data("info").healthPoints);

	$("#player3 .name").html($("#player3").data("info").name);
	$("#player3 .hp").html("HP: " + $("#player3").data("info").healthPoints);

	$("#player4 .name").html($("#player4").data("info").name);
	$("#player4 .hp").html("HP: " + $("#player4").data("info").healthPoints);

	$(".attacker-image").removeClass("winner");
	$(".attacker-image").removeClass("loser");
	$(".attacker-image").removeClass("attacker-glow");
    $(".attacker").data("info", "");
    $(".defender").data("info", "");

    $(".comments").removeClass("winMessage");
	$(".comments").removeClass("lossMessage");

	// flush out attacker div
	$(".attacker .attacker-image").empty();
	$(".attacker .name").empty();
	// flush out defender div
	$(".defender .defender-image").empty();
	$(".defender .name").empty();
	// flush out defeated div
	$(".defeated .defeated-image").empty();

	// update attacker stats
	$("#attackerHealth").empty();
	$("#attackPoints").empty();
	// update defender stats
	$("#defenderHealth").empty();
	$("#counterAttackPoints").empty();

	$("#reset").hide();

	$("#directions").html("Click on a player image to choose your Attacker");

	$(".gameStats").empty();
}

function toggleContenderDetail(contenderDivId) {
    $(contenderDivId +" .contender-image").toggle();
    $(contenderDivId +" .name").toggle();
    $(contenderDivId +" .hp").toggle();
}


