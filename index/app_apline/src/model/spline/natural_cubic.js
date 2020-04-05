function NaturalCubicSpline2D() {

  this.spline = [];

  this.create = function(input, spec, output) {
    output[0] = [];
    output[1] = [];
    this.spline[0] = new NaturalCubicSpline1D(input.data[0], spec, output[0]);
    this.spline[1] = new NaturalCubicSpline1D(input.data[1], spec, output[1]);
  }

  this.build = function() {
    this.spline[0].build();
    this.spline[1].build();
  }
}

function NaturalCubicSpline1D(input, spec, output) {
  
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
    for(let i = 0; i < input.length; i++) {
      output[i] = [];
    }

    // set coefficiant
    
    let mcC = [];
    let mcD = [];
    
    let unD = [];

    if(spec.close === true) {
      
      mcC[0] = 1.0 / 4.0;
      
      for(let i = 1; i < N - 1; i++)
      {
        mcC[i] = 1.0 / ( 4.0 - mcC[ i - 1 ] );
      }
      
      mcC[N - 1] = 1.0 / ( 4.0 - mcC[N - 2] );
      mcC[0] = 1.0 / ( 4.0 - mcC[N - 1] ); // reset index 0;
      
      mcD[0] = 3.0 * ( input[1] - input[N - 1] ) * mcC[N - 1];      
      for(let i = 1; i < N - 1; i++)
      {
        mcD[i] = ( 3.0 * ( input[i + 1] - input[i - 1] ) - mcD[i - 1]) * mcC[i];
      }
      
      mcD[N - 1] = ( 3.0 * ( input[0] - input[N - 2] ) - mcD[N - 2] ) * mcC[N - 1];
      mcD[0] = ( 3.0 * ( input[1] - input[N - 1] ) - mcD[N - 1] ) * mcC[0];  // reset index 0;
      
      unD[N - 1] = mcD[N - 1];      
      for(let i = N - 2; i >= 0; i--)
      {
        unD[i] = mcD[i] - mcC[i] * unD[i + 1];
      }
      unD[N - 1] = mcD[N - 1] - mcC[N - 1] * unD[0];  // reset index N;
      
      for(let i = 0; i < N - 1; i++)
      {
        this.coeffiA.push(2 * ( input[i] - input[i + 1] ) + unD[i] + unD[i + 1]);
        this.coeffiB.push(3 * ( input[i + 1] - input[i] ) - 2* unD[i] - unD[i + 1]);
        this.coeffiC.push(unD[i]);
        this.coeffiD.push(input[i]);
      }
      
      this.coeffiA.push(2 * ( input[N - 1] - input[0] ) + unD[N - 1] + unD[0]);
      this.coeffiB.push(3 * ( input[0] - input[N - 1] ) - 2* unD[N - 1] - unD[0]);
      this.coeffiC.push(unD[N - 1]);
      this.coeffiD.push(input[N - 1]);
      
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
    else {
      
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

      for(let i = 0; i < N - 1; i++) {
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