CC = g++
NAME = lib2
TAR = lib$(NAME).so
OBJ = $(NAME).o
SRC = $(NAME).cpp

all: clean $(TAR)

build: $(TAR)

$(TAR): $(OBJ)
	$(CC) -shared -fPIC -o $@ $^

$(OBJ): $(SRC)
	$(CC) -fPIC -c $^ -I .

clean:
	rm -f $(TAR)
	rm -f $(OBJ)