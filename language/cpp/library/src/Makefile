CC = g++
OBJECTS = main.o define.o
EXECUTE = main.out

STATIC = -lstatic_1 -lstatic_2
SHARED = -lshared_1 -lshared_2
SHARED_WITH = -lshared_1_with_static_1 -lshared_2_with_static_1

all: clean build

build:
	# $(CC) main.cpp -Wl,-Bdynamic -L../shared -I../shared -lshared -o main
	# $(CC) main.cpp -Wl,-Bdynamic -L../shared -I../shared -lshared -Wl,-Bstatic -L../static -I../static -lstatic -o main
	# $(CC) main.cpp -L../static -lstatic -L../shared -lshared -o main
	# $(CC) main.cpp -static -L../static -I../static -lstatic -o main
	# $(CC) main.cpp -L../shared -lshared -o main
	$(CC) main.cpp -L../out $(STATIC) $(SHARED) $(SHARED_WITH) -o $(EXECUTE)

clean:
	rm -f $(EXECUTE)
	rm -f $(OJBECTS)