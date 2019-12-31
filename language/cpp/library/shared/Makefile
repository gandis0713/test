GLOBAL_O = global.o
STATIC_O = static.o
LIB_SO = libshared.so
OBJECTS = $(GLOBAL_O)
# OBJECTS = $(GLOBAL_O) $(STATIC_O)

all: clean build copy

build:
	g++ -c -fPIC global.cpp -o $(GLOBAL_O)
	g++ -c -fPIC static.cpp -o $(STATIC_O)

	g++ -shared $(OBJECTS) -o $(LIB_SO) -L../static -lstatic

copy:
	mkdir -p ../out
	cp -f $(LIB_SO) ../out

clean:
	rm -f $(OBJECTS)