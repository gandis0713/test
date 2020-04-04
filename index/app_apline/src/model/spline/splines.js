function Splines(spline) {

  this.splines = [];
  spline.output.data = [];
  
  this.create = function(type, splineObject) {
    spline.output.data[type] = [];

    splineObject.create(spline.input, spline.spec, spline.output.data[type]);
    splineObject.build();

    this.splines[type] = splineObject;
  }

  this.build = function() {
    this.splines[0].build();
    this.splines[1].build();
  }
}