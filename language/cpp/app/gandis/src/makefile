CC = g++
NAME = main
TAR = $(NAME)/$(NAME).out
SRC = $(NAME)/$(NAME).cpp
LIB = -lmodule1 -lmodule2
LIBPATH = /home/gandis/lib
INC =
CFLAGS = 

all: clean $(TAR)

build: $(TAR)

$(TAR): $(SRC)
	make -C ../../engine/engine1 build
	make -C ../../engine/engine2 build
	make -C module1 build
	make -C module2 build
	$(CC) -o $@ $^ -L$(LIBPATH) $(LIB)

clean:
	make -C ../../engine/engine1 clean
	make -C ../../engine/engine2 clean
	make -C module1 clean
	make -C module2 clean
	rm -f $(TAR)
