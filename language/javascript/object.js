const used_started = process.memoryUsage();
for (let key in used_started) {
  console.log(`started ${key} ${Math.round(used_started[key] / 1024 / 1024 * 100) / 100} MB`);
}



function View(type, name) {
  this.type = type;
  this.name = name;
}

View.prototype.createView = function() {
  console.log("view was created");
  console.log(this.type);
  console.log(this.name);
}

function View3D(type, name, type3D) {
  View.call(this, type, name);
  this.type3D = type3D;
}

View3D.prototype = Object.create(View.prototype);
View3D.prototype.constructor = View3D;

View.prototype.createView = function() {
  console.log("view3D was created");
  console.log(this.type);
  console.log(this.name);
}

View3D.prototype.get3Dtype = function() {
  return this.type3D;
}

const used_before = process.memoryUsage();
for (let key in used_before) {
  console.log(`before ${key} ${Math.round(used_before[key] / 1024 / 1024 * 100) / 100} MB`);
}

var view3D = new View3D(1, "charles", 5);
view3D.createView()
console.log(view3D.get3Dtype())
console.log(view3D.constructor)
console.log(view3D instanceof View3D)
console.log(view3D instanceof View)

const used_end = process.memoryUsage();
for (let key in used_end) {
  console.log(`end ${key} ${Math.round(used_end[key] / 1024 / 1024 * 100) / 100} MB`);
}

