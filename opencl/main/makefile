CC = gcc
NAME = main
TAR = $(NAME).out
OBJ = $(NAME).o
SRC = $(NAME).c
LIB = -lopencl_wrapper
INC = -I../common
LDFLAGS = -L../common


all: clean $(TAR)

$(TAR): $(OBJ)
	$(CC) $(LDFLAGS) -o $@ $^ $(LIB)

$(OBJ): $(SRC)
	$(CC) $(INCLUDE) -c -o $@ $^ 

clean:
	rm -f $(OBJ)
	rm -f $(TAR)
