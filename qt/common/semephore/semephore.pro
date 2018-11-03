SOURCES += main.cpp
QT = core

CONFIG -= app_bundle
CONFIG += console

# install
target.path = $$[QT_INSTALL_EXAMPLES]/corelib/threads/semaphores
INSTALLS += target

QMAKE_POST_LINK += C:/Qt/5.10.1/msvc2017_64/bin/windeployqt.exe --debug semephore.exe
