GLOBAL_O = global.o
STATIC_O = static.o
LIB = libshared_1_with_lib.so

OBJECTS = $(GLOBAL_O) $(STATIC_O)

all: clean build copy

build:
	g++ -c -fPIC global.cpp -o $(GLOBAL_O)
	g++ -c -fPIC static.cpp -o $(STATIC_O)

	g++ -shared $(OBJECTS) -o $(LIB) -L ../out -lstatic_1 -lshared_1

copy:
	mkdir -p ../out
	cp -f $(LIB) ../out

clean:
	rm -f $(OBJECTS)
	rm -f $(LIB)