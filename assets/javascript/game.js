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
		this.attackPower = this.attackPower + this.initialAttackPower;
		console.log(this.name + " attacked " + defenderObject.name + " with attack power " + this.attackPower);
		defenderObject.defend(this);
	}

	// function to defend attacker
	defend(attackerObject) {
		this.healthPoints = this.healthPoints - attackerObject.attackPower;
		console.log(this.name + " got hit by " + attackerObject.name + " and lost health points " + this.healthPoints);
		// If defender is not dead, launch counter attack
		if(this.healthPoints > 0) {
			attackerObject.counterAttack(this);
		}
	}

	// function to counter-attack defender
	counterAttack(defenderObject) {
		this.healthPoints = this.healthPoints - defenderObject.counterAttackPower;
		console.log(defenderObject.name + " counter attacked " + this.name + " with counter attack power " + defenderObject.counterAttackPower);
		console.log(this.name + "'s current health is " + this.healthPoints);		
	}

}
 
$(document).ready(function(){

	$("#player1").data("info", {"name":"Obi-Wan Kenobe", "healthPoints":140, "attackPower":9, "counterAttackPower":10});
	$("#player2").data("info", {"name":"Darth Vader", "healthPoints":160, "attackPower":14, "counterAttackPower":25});
	$("#player3").data("info", {"name":"Luke Skywalker", "healthPoints":120, "attackPower":7, "counterAttackPower":8});
	$("#player4").data("info", {"name":"Darth Maul", "healthPoints":140, "attackPower":10, "counterAttackPower":20});

	var attacker;
	var defender;
	var attackerLocked = false;

	$(".contender").on("click", function() {
		if(!attackerLocked) {
			$(".attacker").html($(this).html());
			$(".attacker").data("info", $(this).data("info"));
		} else {
			$(".defender").html($(this).html());
			$(".defender").data("info", $(this).data("info"));
		}
		     
	});

	// Creating new attacker instance /////////////////////// On click of Lock attacker button /////////////////////////
	$("#lockAttacker").on("click", function() {
		attackerLocked = true;
		var attackerInfo = $(".attacker").data("info");
		attacker = new Character(attackerInfo.name, attackerInfo.attackPower, attackerInfo.healthPoints,0);
		$(this).prop('disabled', true);
	});

	//////////////////// After lock attacker button, listen for .enemy click //////////////////////
	// Creating new defender instance
	$("#lockDefender").on("click", function() { 
		var defenderInfo = $(".defender").data("info");
		defender = new Character(defenderInfo.name, 0, defenderInfo.healthPoints, defenderInfo.counterAttackPower);
		$(this).prop('disabled', true);
	});

	////////////////// After lock defender button, enable #attack button /////////////////////

	// Commencing attack sequence on button click
	$("#attack").on("click", function(){
		attacker.attack(defender);
		if(defender.healthPoints <= 0) {
			console.log("Choose next defender.");
		}
		else if(attacker.healthPoints <= 0) {
			console.log("You lose. Restart game.");
		}
	});

});
