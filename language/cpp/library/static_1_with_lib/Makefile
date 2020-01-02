GLOBAL_O = global.o
STATIC_O = static.o
OUT = libstatic_1_with_lib.a

OBJECT = $(STATIC_O) $(GLOBAL_O)
LIBS = -lstatic_1 -lshared_1

all: clean build copy

build:
	g++ -c $(STATIC_PIC) static.cpp -o $(STATIC_O)
	g++ -c $(STATIC_PIC) global.cpp -o $(GLOBAL_O)

	ar rc $(OUT) $(OBJECT)

copy:
	mkdir -p ../out
	cp -f $(OUT) ../out

clean:
	rm -f $(OBJECT)
	rm -f $(OUT)