#ifndef __opencl_wrapper_h__
#define __opencl_wrapper_h__

#ifdef __APPLE__
	#include <OpenCL/opencl.h>
#else
	#include <CL/cl.h>
#endif

extern void CreateGPUContext();


#endif // __opencl_wrapper_h__
