include(ImportGoogleTest.pri)

QT       += core network

CONFIG += no_batch

INCLUDEPATH += ../Main

DEFINES += UNIT_TEST

TEMPLATE = app

HEADERS +=     \
    ../Main/JsonParser.h \
    JsonParser_Test.h


SOURCES +=     main.cpp \
    ../Main/JsonParser.cpp \
    JsonParser_Test.cpp
