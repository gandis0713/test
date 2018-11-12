
cmake_minimum_required(VERSION 2.8)
 
PROJECT(CreateBrush)
 
find_package(VTK REQUIRED)
include(${VTK_USE_FILE})
 
add_executable(CreateBrush MACOSX_BUNDLE CreateBrush.cxx )
 
target_link_libraries(CreateBrush ${VTK_LIBRARIES})
