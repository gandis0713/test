function KochanekSpline2D( spline ) {

  this.spline = [new KochanekSpline1D(spline), new KochanekSpline1D(spline)];  

  this.build = function() {

  }

}

function KochanekSpline1D( spline ) {

  this.coeffiA = [];
  this.coeffiB = [];
  this.coeffiC = [];
  this.coeffiD = [];

  this.build = function() {

    if(this.data.length < 2) {
      console.log("data is not enough in kochanek spline.");
      return;
    }
    
    this.coeffiA = [];
    this.coeffiB = [];
    this.coeffiC = [];
    this.coeffiD = [];
    
    let pre;
    let cur;
    let next;

    let p0 = [];
    let p1 = [];
    let d0 = [];
    let d1 = [];

    let n0;
    let n1;

    const N = spline.data.length - 1;
    
    const intervalLength = spline.close === false ? N : N + 1;
    
    if(spline.intervals.length === 0) {
      for(let i = 0; i <= intervalLength; i++) {
        spline.intervals[i] =  i / intervalLength;
      }
    }

    // set hermite parameter.
    for(let i = 1; i < N; i++) {

      pre = spline.data[i - 1];
      cur = spline.data[i];
      next = spline.data[i + 1];
      
      n0 = spline.intervals[i] - spline.intervals[i - 1];
      n1 = spline.intervals[i + 1] - spline.intervals[i];
      
      p0[i] = cur;
      p1[i] = next;
      d0[i] = (n1 / (n0 + n1)) * (1 - spline.tension[i]) * ( (1 - spline.continuity[i]) * (1 - spline.bias[i]) * ( next - cur ) + (1 + spline.continuity[i]) * (1 + spline.bias[i]) * ( cur - pre ) );
      d1[i] = (n0 / (n0 + n1)) * (1 - spline.tension[i]) * ( (1 + spline.continuity[i]) * (1 - spline.bias[i]) * ( next - cur ) + (1 - spline.continuity[i]) * (1 + spline.bias[i]) * ( cur - pre ) );
    }
            
    // set hermite parameter at start point.
    pre = spline.close === false ? spline.data[0] : spline.data[N];
    cur = spline.data[0];
    next = spline.data[1];
      
    n0 = spline.close === false ? 0 : spline.intervals[1] - spline.intervals[0];
    n1 = spline.close === false ? spline.intervals[1] - spline.intervals[0] : spline.intervals[N + 1] - spline.intervals[N];

    p0[0] = cur;
    p1[0] = next;
    d0[0] = (n1 / (n0 + n1)) * (1 - spline.tension[0]) * ( (1 - spline.continuity[0]) * (1 - spline.bias[0]) * ( next - cur ) + (1 + spline.continuity[0]) * (1 + spline.bias[0]) * ( cur - pre ) );
    d1[0] = (n0 / (n0 + n1)) * (1 - spline.tension[0]) * ( (1 + spline.continuity[0]) * (1 - spline.bias[0]) * ( next - cur ) + (1 - spline.continuity[0]) * (1 + spline.bias[0]) * ( cur - pre ) );
    
    // set hermite parameter at end point.
    pre = spline.data[N - 1];
    cur = spline.data[N];
    next = spline.close === false ? spline.data[N] : spline.data[0];
      
    n0 = spline.close === false ? spline.intervals[N] - spline.intervals[N - 1] : spline.intervals[1] - spline.intervals[0];
    n1 = spline.close === false ? spline.intervals[N] - spline.intervals[N] : spline.intervals[N + 1] - spline.intervals[N];

    p0[N] = cur;
    p1[N] = next;
    d0[N] = (n1 / (n0 + n1)) * (1 - spline.tension[N]) * ( (1 - spline.continuity[N]) * (1 - spline.bias[N]) * ( next - cur ) + (1 + spline.continuity[N]) * (1 + spline.bias[N]) * ( cur - pre ) );
    d1[N] = (n0 / (n0 + n1)) * (1 - spline.tension[N]) * ( (1 + spline.continuity[N]) * (1 - spline.bias[N]) * ( next - cur ) + (1 - spline.continuity[N]) * (1 + spline.bias[N]) * ( cur - pre ) );

    // set coefficiant  
    for(let i = 0; i < N; i++) {  
      cur = spline.data[i];
      next = spline.data[i + 1];

      this.coeffiA[i] = 2 * cur - 2 * next + d0[i] + d1[i+1];
      this.coeffiB[i] = -3 * cur + 3 * next - 2 * d0[i] - d1[i+1];
      this.coeffiC[i] = d0[i];
      this.coeffiD[i] = cur;
    }
    
    // set coefficiant for end point.
    if(spline.close === true && spline.data.length > 2) {
      cur = spline.data[N];
      next = spline.data[0];

      this.coeffiA[N] = 2 * cur - 2 * next + d0[N] + d1[0];
      this.coeffiB[N] = -3 * cur + 3 * next - 2 * d0[N] - d1[0];
      this.coeffiC[N] = d0[N];
      this.coeffiD[N] = cur;
    }
  }

  this.getSpline = function() {

    let spline = [];

    for(let i = 0; i < spline.data.length; i++) {
      for(let j = 0; j < spline.resolution; j++) {

        const t1 = j / ( spline.resolution - 1 );
        const t2 = t1 * t1;
        const t3 = t1 * t2;

        const value = this.coeffiA[i] * t3 + this.coeffiB[i] * t2 + this.coeffiC[i] * t1 + this.coeffiD[i];

        spline.push(value);

      }
    }

    return spline;
  }
}
