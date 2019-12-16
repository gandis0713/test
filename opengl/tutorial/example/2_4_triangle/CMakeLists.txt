cmake_minimum_required(VERSION 3.0)

project(triangle)

add_executable(${PROJECT_NAME} main.cpp ${CMAKE_SOURCE_DIR}/ext/glad/src/glad.c)

if(MSVC)
else()    
    set(GLAD_LIBRARIES dl)
endif()

target_link_libraries(${PROJECT_NAME} glfw ${GLAD_LIBRARIES})