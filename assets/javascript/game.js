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

	var attacker;
	var defender;

	// Creating new attacker instance
	$(".attacker").on("click", function() {
		attacker = new Character($(this).data('name'),$(this).data('attackpower'),$(this).data('healthpoints'),0);
	});

	// Creating new defender instance
	$(".enemy").on("click", function() {
		defender = new Character($(this).data('name'),0,$(this).data('healthpoints'),$(this).data('counterattackpower'));
		
	});

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
