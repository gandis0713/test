#include <stdio.h>
#include <stdlib.h>

#ifdef __APPLE__
#include <OpenCL/opencl.h>
#else
#include <CL/cl.h>
#endif

#define MEM_SIZE (128)
#define MAX_SOURCE_SIZE (0x100000) // demicla 65536

#define MAX_PLATFORM_SIZE 10
#define MAX_DEVICE_SIZE 10

void print_devices_information(cl_device_id device_id)
{
    // print devices information
    char buffer[1024];
    cl_device_type device_type;
    printf("DEVICE_ID = %p\n", device_id);
    clGetDeviceInfo(device_id, CL_DEVICE_NAME, sizeof(buffer), buffer, NULL);
    printf("  DEVICE_NAME = %s\n", buffer);
    clGetDeviceInfo(device_id, CL_DEVICE_VENDOR, sizeof(buffer), buffer, NULL);
    printf("  DEVICE_VENDOR = %s\n", buffer);
    clGetDeviceInfo(device_id, CL_DEVICE_VERSION, sizeof(buffer), buffer, NULL);
    printf("  DEVICE_VERSION = %s\n", buffer);
    clGetDeviceInfo(device_id, CL_DRIVER_VERSION, sizeof(buffer), buffer, NULL);
    printf("  DRIVER_VERSION = %s\n", buffer);
    clGetDeviceInfo(device_id, CL_DEVICE_MAX_COMPUTE_UNITS, sizeof(buffer), buffer, NULL);
    printf("  DEVICE_MAX_COMPUTE_UNITS = %s\n", buffer);
    clGetDeviceInfo(device_id, CL_DEVICE_MAX_CLOCK_FREQUENCY, sizeof(buffer), buffer, NULL);
    printf("  DEVICE_MAX_CLOCK_FREQUENCY = %s\n", buffer);
    clGetDeviceInfo(device_id, CL_DEVICE_GLOBAL_MEM_SIZE, sizeof(buffer), buffer, NULL);
    printf("  DEVICE_GLOBAL_MEM_SIZE = %s\n", buffer);
}

int main(int argc, char* argv[])
{    
    cl_platform_id platform_ids[MAX_PLATFORM_SIZE];
    cl_device_id device_ids[MAX_PLATFORM_SIZE * MAX_DEVICE_SIZE];
    cl_context context = NULL;
    cl_command_queue command_queue = NULL;
    cl_mem memory_buffer = NULL;
    cl_program program = NULL;
    cl_kernel kernel = NULL;

    cl_uint num_devices = 0;
    cl_uint num_platforms = 0;

    cl_int ret = -1;

    FILE *file;

    char *file_name;
    if(argc <= 1)
    {
        file_name = "../hello.cl";
    }
    else
    {
        file_name = argv[1];
    }

    char *source_str;
    size_t source_size;

    file = fopen(file_name, "r");
    if (NULL == file)
    {
        fprintf(stderr, "Failed to open opencl kernel source. \n");
        return EXIT_FAILURE;
    }

    source_str = (char *)malloc(MAX_SOURCE_SIZE);
    if (NULL == source_str)
    {
        fprintf(stderr, "Failed to create memory for source string.");
        return EXIT_FAILURE;
    }
    source_size = fread(source_str, 1, MAX_SOURCE_SIZE, file);
    fclose(file);

    // initialize for opencl

    ret = clGetPlatformIDs(1, platform_ids, &num_platforms);
    if (ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to get platform information.\n");
        return EXIT_FAILURE;
    }
    printf("num_platforms : %d\n", num_platforms);

    for (int i = 0; i < num_platforms; i++)
    {
        ret = clGetDeviceIDs(platform_ids[i], CL_DEVICE_TYPE_GPU, MAX_DEVICE_SIZE, &device_ids[i * MAX_DEVICE_SIZE], &num_devices);
        printf("num_devices : %d\n", num_devices);
        if (ret != CL_SUCCESS)
        {
            fprintf(stderr, "Failed to get device information for GPU type.\n");
            return EXIT_FAILURE;
        }
    }

    context = clCreateContext(NULL, 1, &device_ids[0], NULL, NULL, &ret);
    if (ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to create context for device ID [%p].\n", device_ids[0]);
        return EXIT_FAILURE;
    }

    command_queue = clCreateCommandQueue(context, device_ids[0], 0, &ret);
    if (ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to create command queue for device ID [%p].\n", device_ids[0]);
        return EXIT_FAILURE;
    }

    memory_buffer = clCreateBuffer(context, CL_MEM_READ_WRITE, MEM_SIZE * sizeof(char), NULL, &ret);
    if (ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to create buffer.\n");
        return EXIT_FAILURE;
    }

    program = clCreateProgramWithSource(context, 1, (const char **)&source_str, (const size_t *)&source_size, &ret);
    if (ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to create program.\n");
        return EXIT_FAILURE;
    }

    ret = clBuildProgram(program, 1, &device_ids[0], NULL, NULL, NULL);
    if (ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to build program.\n");
        return EXIT_FAILURE;
    }

    kernel = clCreateKernel(program, "hello_opencl", &ret);
    if(ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to create kernel.\n");
        return EXIT_FAILURE;
    }

    ret = clSetKernelArg(kernel, 0, sizeof(cl_mem), (void *)&memory_buffer);
    if(ret != CL_SUCCESS)
    {
        fprintf(stderr, "Failed to set arguments for kernel.\n");
        return EXIT_FAILURE;
    }

    ret = clEnqueueTask(command_queue, kernel, 0, NULL, NULL);

    char str[MEM_SIZE];
    ret = clEnqueueReadBuffer(command_queue, memory_buffer, CL_TRUE, 0, MEM_SIZE * sizeof(char), str, 0, NULL, NULL);

    puts(str);

    ret = clFlush(command_queue);
    ret = clFinish(command_queue);
    ret = clReleaseKernel(kernel);
    ret = clReleaseProgram(program);
    ret = clReleaseMemObject(memory_buffer);
    ret = clReleaseCommandQueue(command_queue);
    ret = clReleaseContext(context);

    free(source_str);

    return EXIT_SUCCESS;
}