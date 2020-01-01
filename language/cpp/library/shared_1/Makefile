GLOBAL_O = global.o
STATIC_O = static.o
LIB = libshared_1.so

OBJECTS = $(GLOBAL_O) $(STATIC_O)

all: clean build copy

build:
	g++ -c -fPIC global.cpp -o $(GLOBAL_O)
	g++ -c -fPIC static.cpp -o $(STATIC_O)

	g++ -shared $(OBJECTS) -o $(LIB)

copy:
	mkdir -p ../out
	cp -f $(LIB) ../out

clean:
	rm -f $(OBJECTS)
	rm -f $(LIB)