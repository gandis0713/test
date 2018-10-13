VTK_DLL_PATH=C:/lib/vtk/8.1.1/vc141.x64.release/bin
VTK_LIB_PATH=C:/lib/vtk/8.1.1/vc141.x64.release/lib
VTK_INCLUDE_PATH=C:/lib/vtk/8.1.1/include

LIBS += -L$${VTK_LIB_PATH}

INCLUDEPATH += $${VTK_INCLUDE_PATH}
DEPENDPATH += $${VTK_INCLUDE_PATH}

LIBS += -lvtkChartsCore-8.1
