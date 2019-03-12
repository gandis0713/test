CC = g++
NAME = main
TAR = $(NAME).out
SRC = $(NAME)/$(NAME).cpp

all: clean $(TAR)

build: $(TAR)

$(TAR): $(SRC)
	make -C lib1 build
	# make -C lib2 build
	$(CC) -o $@ $^ -L. -llib1

clean:
	make -C lib1 clean
	# make -C lib2 clean
	rm -f $(TAR)