function KochanekSpline2D() {

  this.spline = [];

  this.create = function(input, spec, output) {
    output[0] = [];
    output[1] = [];
    this.spline[0] = new KochanekSpline1D(input.data[0], spec, output[0]);
    this.spline[1] = new KochanekSpline1D(input.data[1], spec, output[1]);
  }

  this.build = function() {
    this.spline[0].build();
    this.spline[1].build();
  }
}

function KochanekSpline1D(input, spec, output) {

  this.coeffiA = [];
  this.coeffiB = [];
  this.coeffiC = [];
  this.coeffiD = [];

  this.build = function() {

    if(input.length < 2) {
      console.log("data is not enough in kochanek spline.");
      return;
    }
    
    this.coeffiA = [];
    this.coeffiB = [];
    this.coeffiC = [];
    this.coeffiD = [];   
    
    for(let i = 0; i < input.length; i++) {
      output[i] = [];
    }
    
    let pre;
    let cur;
    let next;

    let p0 = [];
    let p1 = [];
    let d0 = [];
    let d1 = [];

    let n0;
    let n1;

    const N = input.length - 1;

    // set hermite parameter.
    for(let i = 1; i < N; i++) {

      pre = input[i - 1];
      cur = input[i];
      next = input[i + 1];
      
      n0 = spec.intervals[i] - spec.intervals[i - 1];
      n1 = spec.intervals[i + 1] - spec.intervals[i];
      
      p0[i] = cur;
      p1[i] = next;
      d0[i] = (n1 / (n0 + n1)) * (1 - spec.tension[i]) * ( (1 - spec.continuity[i]) * (1 - spec.bias[i]) * ( next - cur ) + (1 + spec.continuity[i]) * (1 + spec.bias[i]) * ( cur - pre ) );
      d1[i] = (n0 / (n0 + n1)) * (1 - spec.tension[i]) * ( (1 + spec.continuity[i]) * (1 - spec.bias[i]) * ( next - cur ) + (1 - spec.continuity[i]) * (1 + spec.bias[i]) * ( cur - pre ) );
    }
            
    // set hermite parameter at start point.
    pre = spec.close === false ? input[0] : input[N];
    cur = input[0];
    next = input[1];
      
    n0 = spec.close === false ? 0 : spec.intervals[1] - spec.intervals[0];
    n1 = spec.close === false ? spec.intervals[1] - spec.intervals[0] : spec.intervals[N + 1] - spec.intervals[N];

    p0[0] = cur;
    p1[0] = next;
    d0[0] = (n1 / (n0 + n1)) * (1 - spec.tension[0]) * ( (1 - spec.continuity[0]) * (1 - spec.bias[0]) * ( next - cur ) + (1 + spec.continuity[0]) * (1 + spec.bias[0]) * ( cur - pre ) );
    d1[0] = (n0 / (n0 + n1)) * (1 - spec.tension[0]) * ( (1 + spec.continuity[0]) * (1 - spec.bias[0]) * ( next - cur ) + (1 - spec.continuity[0]) * (1 + spec.bias[0]) * ( cur - pre ) );
    
    // set hermite parameter at end point.
    pre = input[N - 1];
    cur = input[N];
    next = spec.close === false ? input[N] : input[0];
      
    n0 = spec.close === false ? spec.intervals[N] - spec.intervals[N - 1] : spec.intervals[1] - spec.intervals[0];
    n1 = spec.close === false ? spec.intervals[N] - spec.intervals[N] : spec.intervals[N + 1] - spec.intervals[N];

    p0[N] = cur;
    p1[N] = next;
    d0[N] = (n1 / (n0 + n1)) * (1 - spec.tension[N]) * ( (1 - spec.continuity[N]) * (1 - spec.bias[N]) * ( next - cur ) + (1 + spec.continuity[N]) * (1 + spec.bias[N]) * ( cur - pre ) );
    d1[N] = (n0 / (n0 + n1)) * (1 - spec.tension[N]) * ( (1 + spec.continuity[N]) * (1 - spec.bias[N]) * ( next - cur ) + (1 - spec.continuity[N]) * (1 + spec.bias[N]) * ( cur - pre ) );

    // set coefficiant  
    for(let i = 0; i < N; i++) {  
      cur = input[i];
      next = input[i + 1];

      this.coeffiA[i] = 2 * cur - 2 * next + d0[i] + d1[i+1];
      this.coeffiB[i] = -3 * cur + 3 * next - 2 * d0[i] - d1[i+1];
      this.coeffiC[i] = d0[i];
      this.coeffiD[i] = cur;
    }
    
    // set coefficiant for end point.
    if(spec.close === true && input.length > 2) {
      cur = input[N];
      next = input[0];

      this.coeffiA[N] = 2 * cur - 2 * next + d0[N] + d1[0];
      this.coeffiB[N] = -3 * cur + 3 * next - 2 * d0[N] - d1[0];
      this.coeffiC[N] = d0[N];
      this.coeffiD[N] = cur;
    }

    // create spline.
    const size = spec.close === false ? N : N + 1;
    for(let i = 0; i < size; i++) {
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
