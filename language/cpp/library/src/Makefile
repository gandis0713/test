CC = g++
OBJECTS = main.o define.o
EXECUTE = main.out

STATIC = -lstatic_1 -lstatic_2
SHARED = -lshared_1 -lshared_2
SHARED_WITH = -lshared_1_with_static_1 -lshared_2_with_static_1
STATIC_WITH = -lstatic_1_with_static_1 -lstatic_2_with_static_1

all: clean build

build:
	$(CC) main.cpp -L../out $(STATIC) $(SHARED) $(SHARED_WITH) $(STATIC_WITH) -o $(EXECUTE)

clean:
	rm -f $(EXECUTE)
	rm -f $(OJBECTS)