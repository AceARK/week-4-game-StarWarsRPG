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
 
$(document).ready(function(){

	// initialize player's data attributes
	$("#player1").data("info", {"name":"Obi-Wan Kenobe", "healthPoints":140, "attackPower":9, "counterAttackPower":10, "originDivId": "#player1"});
	$("#player2").data("info", {"name":"Darth Vader", "healthPoints":160, "attackPower":14, "counterAttackPower":25, "originDivId": "#player2"});
	$("#player3").data("info", {"name":"Luke Skywalker", "healthPoints":120, "attackPower":7, "counterAttackPower":8, "originDivId": "#player3"});
	$("#player4").data("info", {"name":"Darth Maul", "healthPoints":140, "attackPower":10, "counterAttackPower":20, "originDivId": "#player4"});

	var attacker;
	var defender;
	var attackerLocked = false;
	var defenderLocked = false;
	var attackEnabled = false;
	var contenderDefeated = 0;

	// disable defender lock button until after attacker locked
	$("#lockDefender").prop('disabled', true);
	// disable attack button until after attacker and defender locked
	$("#attack").prop('disabled', true);

	////////// configure displaying name, hp and attack/counterattackpoints below each image /////////////

	// On click of contender
	$(".contender").on("click", function() {	
		// If attacker is not locked yet,
		if(!attackerLocked) {
			var attackerInfo = $(".attacker").data("info");
			// attacker exists
			if(attackerInfo !== undefined) {
				// swap image from attacker div to the right origin contender div
				$(attackerInfo.originDivId).html($(".attacker").html());
			} 
			// transfer image from contender div to attacker div
			$(".attacker").html($(this).html());
			// empty the contender div 
			$(this).empty(); 
			// transfer data attributes of contender to attacker for attacker object creation
			$(".attacker").data("info", $(this).data("info"));
			// Else if defender is not locked
		} else if(!defenderLocked) {
			var defenderInfo = $(".defender").data("info");
			// defender exists
			if(defenderInfo !== undefined) {
				if(defenderInfo.healthPoints <=0) {
					// swap image from defender div to the origin contender div
				$(defenderInfo.originDivId).html($(".defender").html());
				}
			}
			// transfer image from contender to defender div
			$(".defender").html($(this).html());
			// empty contents from contender
			$(this).empty();
			// transfer data attributes to defender for defender object creation
			$(".defender").data("info", $(this).data("info"));			
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
				// move defender to defeated area
				$(".defeated").append($(".defender").html());
				$(".defender").empty();
				// win condition
				if(contenderDefeated >= 2) {
					console.log("Contender defeated " + contenderDefeated);
					console.log(attacker.name + " wins. Reset game to start anew."); 
					$(".attacker").css("border", "5px solid blue"); ///////// modify to specify css for winner //////////
					// disable attack button 
					$("#attack").prop('disabled', true);
					attackEnabled = false;
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
			}
		}
	});

	// call reset() function on click of button
	$("#reset").on("click", function() {
		reset();
	});

});

// reset function
function reset() {
		var attackerLocked = false;
		var defenderLocked = false;
		var attackEnabled = false;
		var contenderDefeated = 0;

		$("#player1").html("<img src='assets/images/obiwanKenobe.jpg'>");
		$("#player1").html("<img src='assets/images/darthVader.jpg'>");
		$("#player1").html("<img src='assets/images/lukeSkywalker.jpg'>");
		$("#player1").html("<img src='assets/images/darthmaul.jpg'>");

		$(".attacker").empty();
		delete $(".attacker").data("info");

		$(".defender").empty();
		delete $(".defender").data("info");
}