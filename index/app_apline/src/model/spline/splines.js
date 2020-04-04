function Splines() {

  this.splines = new Map();
  
  this.setSpline = function(type, spline) {
    this.splines.set(type, spline);
    this.build(type);
  }
  this.build = function(type) {
    this.splines.get(type).build();
  }

  this.build = function() {

    this.splines.forEach(function(value, key) {
      value.build();
    });
  }   

}