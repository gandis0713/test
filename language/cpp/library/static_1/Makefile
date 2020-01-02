GLOBAL_O = global.o
STATIC_O = static.o
LIB = libstatic_1.a

OBJECT = $(STATIC_O) $(GLOBAL_O)

all: clean build copy

build:
	g++ -c $(STATIC_PIC) static.cpp -o $(STATIC_O)
	g++ -c $(STATIC_PIC) global.cpp -o $(GLOBAL_O)

	ar rc $(LIB) $(OBJECT)

copy:
	mkdir -p ../out
	cp -f $(LIB) ../out

clean:
	rm -f $(OBJECT)
	rm -f $(LIB)