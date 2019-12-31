GLOBAL_O = global.o
STATIC_O = static.o
LIB = libstatic_2.a

# OBJECT = $(GLOBAL_O)
OBJECT = $(STATIC_O) $(GLOBAL_O)

all: clean build copy

build:
	g++ -c -fPIC static.cpp -o $(STATIC_O)
	g++ -c -fPIC global.cpp -o $(GLOBAL_O)

	ar rc $(LIB) $(OBJECT)

copy:
	mkdir -p ../out
	cp -f $(LIB) ../out

clean:
	rm -f $(OBJECT)
	rm -f $(LIB)