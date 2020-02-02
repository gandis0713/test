var obj_function = function()
{
    this.func = function()
    {
        return "charles function";
    }
} // define function
obj_function.prototype.name = "charles";
var obj1 = 
{
    'func': function()
    {
        return "charles";
    }
}; // use literally string
var obj2 = new Object(); // use constructor
var obj3 = new obj_function();
var obj4 = new obj_function();

console.log(obj1.func());
console.log(obj2);
console.log(obj3.func());
console.log(obj_function.prototype.name);