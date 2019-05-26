CONFIG += c++11

QT += opengl

TEMPLATE = app

# The following define makes your compiler emit warnings if you use
# any Qt feature that has been marked deprecated (the exact warnings
# depend on your compiler). Please consult the documentation of the
# deprecated API in order to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

DESTDIR = output

# You can also make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

PCH_PATH = ./pch

PRECOMPILED_HEADER += $${PCH_PATH}/precompileheader.h \
    $${PCH_PATH}/qtheader.h

INCLUDEPATH += /usr/include/glm \
    ./pch

SOURCES += \
        main.cpp \
    glwidget.cpp \
    window.cpp \
    pathmanager.cpp
HEADERS += \
    glwidget.h \
    window.h \
    $${PCH_PATH}/precompileheader.h \
    pathmanager.h \
    $${PCH_PATH}/qtheader.h

FORMS += \
    window.ui

DISTFILES += \
    glsl/fragment.glsl \
    glsl/vertex.glsl

