cmake_minimum_required(VERSION 3.0)

project(opengl_example)

set(CMAKE_INCLUDE_CURRENT_DIR ON)

option(GLFW_BUILD_DOCS OFF)
option(GLFW_BUILD_EXAMPLES OFF)
option(GLFW_BUILD_TESTS OFF)
add_subdirectory(ext/glfw)

include_directories(ext/glad/include
                    ext/glfw/include)

add_subdirectory(example)