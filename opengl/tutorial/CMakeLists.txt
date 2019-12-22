cmake_minimum_required(VERSION 3.0)

project(opengl_example)

include_directories(src/drivers
                    src/core
                    ext/glad/include
                    ext/glfw/include
                    ext/stb)

option(GLFW_BUILD_DOCS OFF)
option(GLFW_BUILD_EXAMPLES OFF)
option(GLFW_BUILD_TESTS OFF)
add_subdirectory(ext/glfw)

add_subdirectory(example)