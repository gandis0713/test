CC = g++
NAME = engine2
TAR = lib$(NAME).so
OBJ = $(NAME).o
SRC = $(NAME).cpp
LIBPATH = /home/gandis/lib

all: clean build

build: $(TAR) copy

$(TAR): $(OBJ)
	$(CC) -shared -o $@ $^

$(OBJ): $(SRC)
	$(CC) -fPIC -c $^

clean:
	rm -f $(TAR)
	rm -f $(OBJ)

copy:
	cp -f $(TAR) $(LIBPATH)
