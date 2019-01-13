CC = gcc
NAME = opencl_wrapper
TAR = lib$(NAME).so
OBJ = $(NAME).o
SRC = $(NAME).c
LIB = -lOpenCL

all: clean $(TAR)


$(TAR): $(OBJ)
	$(CC) -shared -fpic -o $@ $^ $(LIB)

$(OBJ): $(SRC)
	$(CC) -c -fpic -o $@ $^

clean:
	rm -f $(OBJ) $(TAR)

