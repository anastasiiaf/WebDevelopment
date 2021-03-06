// Constructor functions
function Dog(name, age) {
  this.name = name;
  this.age = age;
  this.bark = function () {
    console.log(this.name + ' just barked!');
  };
}
var reks = new Dog('Reks', 3);
var jack = new Dog('Jack', 5);

reks.bark();
jack.bark();

// Multiple constructors
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.numWheels = 4;
}

function Motorcycle(make, model, year) {
  Car.call(this, make, model, year);
  //Car.apply(this, [make, model, year]);
  this.numWheels = 2;
}

var motorcycle = new Motorcycle('AB', 'XL', 2010);
console.log(motorcycle);

//Prototypes
function Vehicle(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.isRunning = false;
}
Vehicle.prototype.turnOn = function () {
  this.isRunning = true;
  this.honk = 'BEEP';
};
Vehicle.prototype.turnOff = function () {
  this.isRunning = false;
};

var motorcycle2 = new Vehicle('AB', 'XL', 2010);
motorcycle2.turnOn();
console.log(motorcycle2);
