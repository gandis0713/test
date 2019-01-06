cmake_minimum_required (VERSION 2.8)
project (OpenCL_Hello)

set (CMAKE_MODULE_PATH "${CMAKE_SOURCE_DIR}/CMake")

set(CMAKE_C_FLAGS "-std=c99")

find_package(OpenCL REQUIRED)

include_directories(${OPENCL_INCLUDE_DIRS})

add_executable(main main.c)

target_link_libraries(main ${OPENCL_LIBRARIES})
