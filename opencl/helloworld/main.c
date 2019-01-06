#include <stdio.h>
#include <stdlib.h>

#ifdef __APPLE__
#include <OpenCL/opencl.h>
#else
#include <CL/cl.h>
#endif

#define MEM_SIZE (128)
#define MAX_SOURCE_SIZE (0x100000) // demicla 65536

int main(int argc, char* argv[])
{
    if(argc <= 1)
    {
        fprintf(stderr, "Invalid arguments. It must be need the file path for opencl source.\n");
        exit(1);
    }
    
    cl_device_id device_id = NULL;
    cl_context context = NULL;
    cl_command_queue command_queue = NULL;
    cl_mem mem = NULL;
    cl_program program = NULL;
    cl_kernel kernel = NULL;
    cl_platform_id platform_id = NULL;

    cl_uint num_devices = 0;
    cl_uint num_platforms = 0;

    cl_int ret = -1;

//    char str[MEM_SIZE];

    FILE *file;
    char *file_name = argv[1];
    char *source_str;
    size_t source_size;

    file = fopen(file_name, "r");
    if(NULL == file)
    {
        fprintf(stderr, "Failed to open opencl kernel source. \n");
        exit(1);
    }

    source_str = (char*)malloc(MAX_SOURCE_SIZE);
    if(NULL == source_str)
    {
        fprintf(stderr, "Failed to create memory for source string.");
        exit(1);
    }
    source_size = fread(source_str, 1, MAX_SOURCE_SIZE, file);
    fclose(file);

    return 0;
}