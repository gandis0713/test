CC = gcc
CFGS = -std=c99
OBJS = main.o
SRC = main.c
TAR = main
INCLUDE = -I./include
LDFLAGS = -L./lib
LIBS = -lOpenCL

all: clean $(TAR)


$(TAR): $(OBJS)
	$(CC) $(CFGS) $(LDFLAGS) -o $@ $^ $(LIBS)

$(OBJS): $(SRC)
	$(CC) $(CFGS) $(INCLUDE) -c -o $@ $^ $(LIBS)

clean:
	rm -f $(OBJS)
	rm -f $(TAR)
