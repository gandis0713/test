function CardinalSpline2D() {

  this.spline = [];

  this.create = function(input, spec, output) {
    output[0] = [];
    output[1] = [];
    this.spline[0] = new CardinalSpline1D(input.data[0], spec, output[0]);
    this.spline[1] = new CardinalSpline1D(input.data[1], spec, output[1]);
  }

  this.build = function() {
    this.spline[0].build();
    this.spline[1].build();
  }
}

function CardinalSpline1D(input, spec, output) {
  
  this.coeffiA = [];
  this.coeffiB = [];
  this.coeffiC = [];
  this.coeffiD = [];

  this.build = function() {
    
    this.coeffiA = [];
    this.coeffiB = [];
    this.coeffiC = [];
    this.coeffiD = [];
    
    const N = input.length - 1;
    for(let i = 0; i < input.length; i++) {
      output[i] = [];
    }    

    let p1 = [];
    let p2 = [];
    let p3 = [];
    let p4 = [];

    if(spec.close === true) {
      
      
    }
    else {
      

      for(let i = 0; i < N; i++) {
        p1[i] = (i === 0) ? input[0] : input[i - 1];
        p2[i] = input[i];
        p3[i] = input[i + 1];
        p4[i] = i >= (N - 1) ? input[i + 1] : input[i + 2];
      }

      for(let i = 0; i < N; i++) {
        this.coeffiA[i] = 0.5 * (-p1[i] + 3*p2[i] - 3*p3[i] + p4[i]);
        this.coeffiB[i] = 0.5 * (2*p1[i] - 5*p2[i] + 4*p3[i] - p4[i]);
        this.coeffiC[i] = 0.5 * (-p1[i] + p3[i]);
        this.coeffiD[i] = 0.5 * (2*p2[i]);
      }

      for(let i = 0; i < N; i++) {
        for(let j = 0; j < spec.resolution; j++) {
  
          const t1 = j / ( spec.resolution - 1 );
          const t2 = t1 * t1;
          const t3 = t1 * t2;
  
          const value = this.coeffiA[i] * t3 + this.coeffiB[i] * t2 + this.coeffiC[i] * t1 + this.coeffiD[i];
          output[i][j] = value;
        }
      }
    }
  } 
}