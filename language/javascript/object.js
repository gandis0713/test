function person(name, job)
{
    this.name = name;
    this.job = job;
}
person.prototype.name = null;
person.prototype.job = null;
person.prototype.intro = function()
{
    return "my job is " + this.job;
}

function charles(name, job)
{
    this.name = name;
    this.job = job;
}
charles.prototype = new person();

var person1 = new person("None", "None");
var person2 = new charles("charles", "Software Developer");

console.log(person1.intro());
console.log(person2.intro());