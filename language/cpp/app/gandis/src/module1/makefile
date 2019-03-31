CC = g++
NAME = module1
TAR = lib$(NAME).so
OBJ = $(NAME).o
SRC = $(NAME).cpp
LIBPATH = /home/gandis/lib
LIB = -lengine1 -lengine2

all: clean build

build: $(TAR) copy

$(TAR): $(OBJ)
	$(CC) -shared -o $@ $^ -L$(LIBPATH) $(LIB)

$(OBJ): $(SRC)
	$(CC) -fPIC -c $^

clean:
	rm -f $(TAR)
	rm -f $(OBJ)

copy:
	cp -f $(TAR) $(LIBPATH)
