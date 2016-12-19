"use strict";

// Character type
class Character {
	// constructor to initialize required values
	constructor(name,initialAttackPower,healthPoints,counterAttackPower) {
		this.name = name;
		console.log(name);
		this.initialAttackPower = initialAttackPower; 
		console.log(initialAttackPower);
		this.healthPoints = healthPoints; 
		console.log(healthPoints);
		this.counterAttackPower = counterAttackPower;
		console.log(counterAttackPower);
		this.attackPower = 0;
	}
	
	// function to attack defender
	attack(defenderObject) {
		// increase attacker's attack power on each attack
		this.attackPower = this.attackPower + this.initialAttackPower;
		console.log(this.name + " attacked " + defenderObject.name + " with attack power " + this.attackPower);
		// call defender's defend() function
		defenderObject.defend(this);
	}

	// function to defend attacker
	defend(attackerObject) {
		// reduce defender's health points as a result of attacker's attack
		this.healthPoints = this.healthPoints - attackerObject.attackPower;
		console.log(this.name + " got hit by " + attackerObject.name + " and lost health points " + this.healthPoints);
		// If defender is not dead, launch counter attack
		if(this.healthPoints > 0) {
			attackerObject.counterAttack(this);
		}
	}

	// function to counter-attack defender
	counterAttack(defenderObject) {
		// reduce attacker's health points from defender's attack
		this.healthPoints = this.healthPoints - defenderObject.counterAttackPower;
		console.log(defenderObject.name + " counter attacked " + this.name + " with counter attack power " + defenderObject.counterAttackPower);
		console.log(this.name + "'s current health is " + this.healthPoints);		
	}

}

// declaring variables required for game
var attacker, defender, attackerLocked, defenderLocked, attackEnabled, contenderDefeated;

$(document).ready(function(){

	// initialize game
	resetGame();

	// On click of contender
	$(".contender").on("click", function() {	
		// If attacker is not locked yet,
		if(!attackerLocked) {
			// console.log("1 The id is " + $(this).attr('id'));
			var attackerInfo = $(".attacker").data("info");
			// attacker exists
			if(attackerInfo !== undefined) {
				// swap image from attacker div to the right origin contender div
				//$((attackerInfo.originDivId) +" .contender-image").html($(".attacker-image").html()); 
				$((attackerInfo.originDivId) +" .contender-image").show();
				// showing name and hp again
				$((attackerInfo.originDivId) +" .name").show();
				$((attackerInfo.originDivId) +" .hp").show();
			} 
			var selectedPlayerId = "#" + $(this).attr('id');
			// transfer image from contender div to attacker div
			console.log("The id is " + $(this).attr('id'));
			// var selectedPlayerId = "#" + $(this).attr('id');
			$(".attacker-image").html($(selectedPlayerId + ' .contender-image').html()); //////////////
			
			// hide contender name
			$(selectedPlayerId+ ' .name').hide();
			// hide contender hp
			$(selectedPlayerId+ ' .hp').hide();
			// empty contents from contender image div
			$(selectedPlayerId + ' .contender-image').hide();

			// transfer data attributes of contender to attacker for attacker object creation
			$(".attacker").data("info", $(this).data("info"));
			// add attacker name
			$(".attacker .name").html($(".attacker").data("info").name);

			// Else if defender is not locked
		} else if(!defenderLocked) {
			var defenderInfo = $(".defender").data("info");
			// defender exists
			if(defenderInfo !== undefined) {

				// showing name and hp again
				$((defenderInfo.originDivId) +" .name").show();
				$((defenderInfo.originDivId) +" .hp").show();
				// swap image from defender div to the origin contender div
				//$((defenderInfo.originDivId) +" .contender-image").html($(".defender .defender-image").html());
				$((defenderInfo.originDivId) +" .contender-image").show();

				// if defender dead
				if(defenderInfo.healthPoints <=0) {
					// swap image from defender div to the origin contender div
					$(defenderInfo.originDivId).html($(".defender .defender-image").html());
				}
			}
			var selectedPlayerId = "#" + $(this).attr('id');
			// transfer image from contender to defender div
			$(".defender .defender-image").html($(selectedPlayerId + ' .contender-image').html());

			////// Can be put in a function??? //////
			// hide contender name
			$(selectedPlayerId+ ' .name').hide();
			// hide contender hp
			$(selectedPlayerId+ ' .hp').hide();
			// empty contents from contender image div
			$(selectedPlayerId + ' .contender-image').hide();
			/////// end function to hide selected contender ////////

			// transfer data attributes to defender for defender object creation
			$(".defender").data("info", $(this).data("info"));	
			// add defender name
			$(".defender .name").html($(".defender").data("info").name);		
		}
		     
	});

	// Creating new Character object called attacker on locking attacker
	// on click of lock attacker button
	$("#lockAttacker").on("click", function() {
		// attacker locked flag set to true
		attackerLocked = true;
		// variable to get data attributes of attacker 
		var attackerInfo = $(".attacker").data("info");
		// create new object and initializing values based on data attributes
		attacker = new Character(attackerInfo.name, attackerInfo.attackPower, attackerInfo.healthPoints,0);
		// disable lock button
		$(this).prop('disabled', true);
		// enable defender lock button
		$("#lockDefender").prop('disabled', false);
	});

	// Creating new Character object called defender 
	// on click of lock defender button
	$("#lockDefender").on("click", function() { 
		// perform anything only if attacker is locked
		// if(attackerLocked) {
			// defender lock flat set to true
			defenderLocked = true;
			// get data attributes of defender
			var defenderInfo = $(".defender").data("info");
			// create defender object and initialize values using data attributes
			defender = new Character(defenderInfo.name, 0, defenderInfo.healthPoints, defenderInfo.counterAttackPower);
			// disable lock defender button
			$(this).prop('disabled', true);
			// enable attack button
			$("#attack").prop('disabled', false);
		// }
	});

	// Commencing attack sequence on button click
	$("#attack").on("click", function(){
		// perform only if attacker and defender are locked on
		if(attackerLocked && defenderLocked) {
			// set attack enabled flag to true
			attackEnabled = true;
			// call attack()
			attacker.attack(defender);
			// checking for win condition
			if(defender.healthPoints <= 0) {
				var defenderInfo = $(".defender").data("info");
				// move defender to defeated area
				$(".defeated .defeated-image").append($(".defender .defender-image").html());
				$(".defeated .name").append($(".defender .name").html());
				$(".defender .defender-image").empty();
				$(".defender .name").empty();

				// remove name and hp of defeated from contender div
				$(defenderInfo.originDivId +" .name").hide();
				$(defenderInfo.originDivId +" .hp").hide();

				$(".defender").data("info", "");

				// win condition
				if(contenderDefeated >= 2) {
					console.log("Contender defeated " + contenderDefeated);
					console.log(attacker.name + " wins. Reset game to start anew."); 
					$(".attacker").css("border", "5px solid blue"); ///////// modify to specify css for winner //////////
					// disable attack button 
					$("#attack").prop('disabled', true);
					attackEnabled = false;
					$("#reset").show();
				} else {
					// else incremenet defeated counter
					contenderDefeated++;
					console.log("Contender defeated " + contenderDefeated);
					// $(".defeated").append($(".defender").html());
					console.log("Choose next defender.");
					// enable defender lock button again to wait for new defender
					defenderLocked = false;
					$("#lockDefender").prop('disabled', false);
					// disable attack button
					attackEnabled = false;
					$("#attack").prop('disabled', true);
				}
				
			} // loss condition
			else if(attacker.healthPoints <= 0) {
				console.log("You lose. Restart game.");
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

// reset function
function resetGame() {
		// initialize player's data attributes
	$("#player1").data("info", {"name":"Obi-Wan Kenobe", "healthPoints":140, "attackPower":9, "counterAttackPower":10, "originDivId": "#player1"});
	$("#player2").data("info", {"name":"Darth Vader", "healthPoints":160, "attackPower":14, "counterAttackPower":25, "originDivId": "#player2"});
	$("#player3").data("info", {"name":"Luke Skywalker", "healthPoints":120, "attackPower":8, "counterAttackPower":8, "originDivId": "#player3"});
	$("#player4").data("info", {"name":"Darth Maul", "healthPoints":140, "attackPower":10, "counterAttackPower":15, "originDivId": "#player4"});

	// set all flags to false and defeated counter to 0
	attackerLocked = false;
	defenderLocked = false;
	attackEnabled = false;
	contenderDefeated = 0;

	$('.contender-image').show();
	$('.contender .name').show();
	$('.contender .hp').show();

	// disable defender lock button until after attacker locked
	$("#lockDefender").prop('disabled', true);
	// defenderLocked = true;
	// disable defender lock button until after attacker locked
	$("#lockAttacker").prop('disabled', false);
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

	// flush out attacker div
	$(".attacker .attacker-image").empty();
	$(".attacker .name").empty();
	// flush out defender div
	$(".defender .defender-image").empty();
	$(".defender .name").empty();
	// flush out defeated div
	$(".defeated .defeated-image").empty();
	$(".defeated .name").empty();

	$("#reset").hide();
}
