include(ImportGoogleTest.pri)

QT       += core network

CONFIG += no_batch

INCLUDEPATH += ../Main

TEMPLATE = app

HEADERS +=     \
    ../Main/JsonParser.h


SOURCES +=     main.cpp \
    ../Main/JsonParser.cpp \
    JsonParser_Test.cpp
