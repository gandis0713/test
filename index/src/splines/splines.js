function Splines({data}) {

  this.splines = [];
  
  this.addSpline = function(spline) {
    this.splines.push(spline);
  }

  this.build = function() {

    const N = data.length - 1;
    const intervalLength = close === false ? N : N + 1;
    
    if(intervals.length === 0) {
      for(let i = 0; i <= intervalLength; i++) {
        intervals[i] =  i / intervalLength;
      }
    }

    for(let i = 0; i < this.splines.length; i++) {
      this.splines[i].build();
    }
  }   

}