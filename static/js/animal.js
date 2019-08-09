function Animal(name) {
    this.name = name;
}
Animal.prototype.sayHi = function(){
    console.log(this.name);
    return this.name;
}
