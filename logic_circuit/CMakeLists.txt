CMAKE_MINIMUM_REQUIRED ( VERSION 3.12 )

PROJECT ( "LogicCircuit" )

SET ( CMAKE_BUILD_TYPE <Debug|Release> )

SET ( OUTPUT
        "${CMAKE_PROJECT_NAME}"
        )

SET ( SRC_FILES
        main.cpp 
        DataStructure/Bit.h
        DataStructure/DataType.h
        DataStructure/InputOutput.h
        DataStructure/NumberSystems.h
        LogicCircuit/Combination/NAdder.h
        LogicCircuit/Combination/NAdder.cpp
        LogicCircuit/Combination/Adder.h
        LogicCircuit/Combination/Adder.cpp
        LogicCircuit/Circuit.h
        LogicCircuit/Circuit.cpp
        LogicGate/ANDGate.h
        LogicGate/ANDGate.cpp
        LogicGate/BASEGate.h
        LogicGate/BASEGate.cpp
        LogicGate/NANDGate.h
        LogicGate/NANDGate.cpp
        LogicGate/NORGate.h
        LogicGate/NORGate.cpp
        LogicGate/NOTGate.h
        LogicGate/NOTGate.cpp
        LogicGate/ORGate.h
        LogicGate/ORGate.cpp
        LogicGate/XNORGate.h
        LogicGate/XNORGate.cpp
        LogicGate/XORGate.h
        LogicGate/XORGate.cpp
        )

ADD_EXECUTABLE( ${OUTPUT} 
                ${SRC_FILES} )