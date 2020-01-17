cmake_minimum_required(VERSION 3.0)

project(coordinate)

file(GLOB EXT_SOURCES ${CMAKE_SOURCE_DIR}/ext/glad/src/glad.c)
file(GLOB SRC_SOURCES ${CMAKE_SOURCE_DIR}/src/drivers/*.cpp 
                      ${CMAKE_SOURCE_DIR}/src/core/math/*.cpp)
file(GLOB PRO_SOURCES main.cpp)

add_executable(${PROJECT_NAME} ${PRO_SOURCES} ${SRC_SOURCES} ${EXT_SOURCES})

file( COPY ${CMAKE_CURRENT_SOURCE_DIR}/shaders DESTINATION ${CMAKE_CURRENT_BINARY_DIR})
file( COPY ${CMAKE_SOURCE_DIR}/resource/2_6 DESTINATION ${CMAKE_CURRENT_BINARY_DIR}/resource)

# add_custom_target(
#         COPY_SHADER
#         ${CMAKE_COMMAND}
#         -D SOURCE_DIR=${CMAKE_CURRENT_SOURCE_DIR}
#         -D DESTINATION_DIR=${CMAKE_CURRENT_BINARY_DIR}
#         -P CopyFile.cmake
#         COMMENT "Copying Files for target: shader"
#         )

# add_dependencies(${PROJECT_NAME} COPY_SHADER)


if(MSVC)
else()    
    set(GLAD_LIBRARIES dl)
endif()

target_link_libraries(${PROJECT_NAME} glfw ${GLAD_LIBRARIES})

