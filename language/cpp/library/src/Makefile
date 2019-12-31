CC = g++
OBJECTS = main.o define.o
EXECUTE = main

all: clean build

build:
	# $(CC) main.cpp -Wl,-Bdynamic -L../shared -I../shared -lshared -o main
	# $(CC) main.cpp -Wl,-Bdynamic -L../shared -I../shared -lshared -Wl,-Bstatic -L../static -I../static -lstatic -o main
	# $(CC) main.cpp -L../static -lstatic -L../shared -lshared -o main
	# $(CC) main.cpp -static -L../static -I../static -lstatic -o main
	# $(CC) main.cpp -L../shared -lshared -o main
	$(CC) main.cpp -L../out -lshared2 -lshared -o main

clean:
	rm -f $(EXECUTE)
	rm -f $(OJBECTS)