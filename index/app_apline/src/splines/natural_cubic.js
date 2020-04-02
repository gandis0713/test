function NaturalCubicSpline2D(input, output, spec ) {

  this.spline = [new NaturalCubicSpline1D(input[0], output[0], spec), new NaturalCubicSpline1D(input[1], output[1], spec)];

  this.build = function() {
    const N = this.spline.length;
    for(let i = 0; i < N; i++) {
      this.spline[i].build();
    }
  }
}

function NaturalCubicSpline1D(input, output, spec) {
  
  this.coeffiA = [];
  this.coeffiB = [];
  this.coeffiC = [];
  this.coeffiD = [];

  this.build = function() {
    
    this.coeffiA = [];
    this.coeffiB = [];
    this.coeffiC = [];
    this.coeffiD = [];

    const N = input.length;

    // set coefficiant
    
    let mcC = [];
    let mcD = [];
    
    let unD = [];
    
    mcC[0] = 1.0 / 2.0;
    
    for(let i = 1; i < N - 1; i++)
    {
      mcC[i] = 1.0 / ( 4.0 - mcC[ i - 1 ] );
    }
    
    mcC[N - 1] = 1.0 / ( 2.0 - mcC[N - 2] );
    
    mcD[0] = 3.0 * ( input[1] - input[0] ) / 2.0;;
    
    for(let i = 1; i < N - 1; i++)
    {
      mcD[i] = ( 3.0 * ( input[i + 1] - input[i - 1] ) - mcD[i - 1]) * mcC[i];
    }
    
    mcD[N - 1] = ( 3.0 * ( input[N - 1] - input[N - 2] ) - mcD[N - 2] ) * mcC[N - 1];
    
    unD[N - 1] = mcD[N - 1];
    
    for(let i = N - 2; i >= 0; i--)
    {
      unD[i] = mcD[i] - mcC[i] * unD[i + 1];
    }
    
    for(let i = 0; i < N - 1; i++)
    {
      this.coeffiA.push(2 * ( input[i] - input[i + 1] ) + unD[i] + unD[i + 1]);
      this.coeffiB.push(3 * ( input[i + 1] - input[i] ) - 2* unD[i] - unD[i + 1]);
      this.coeffiC.push(unD[i]);
      this.coeffiD.push(input[i]);
    }

    // create spline.
    const size = spec.close === false ? N : N + 1;
    for(let i = 0; i < size; i++) {
      for(let j = 0; j < spec.resolution; j++) {

        const t1 = j / ( spec.resolution - 1 );
        const t2 = t1 * t1;
        const t3 = t1 * t2;

        const value = this.coeffiA[i] * t3 + this.coeffiB[i] * t2 + this.coeffiC[i] * t1 + this.coeffiD[i];
        output[(i * spec.resolution) + j] = value;
      }
    }
  } 
}