cmake_minimum_required(VERSION 3.0)

project(main)

option(GLFW_BUILD_DOCS OFF)
option(GLFW_BUILD_EXAMPLES OFF)
option(GLFW_BUILD_TESTS OFF)
add_subdirectory(ext/glfw)

include_directories(ext/glad/include
                    ext/glfw/include)

add_executable(${PROJECT_NAME} main.cpp ext/glad/src/glad.c)

target_link_libraries(${PROJECT_NAME} glfw dl)

