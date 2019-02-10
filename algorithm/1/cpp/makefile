NAME = main
TAR = $(NAME).out
SRC = $(NAME).cpp
COM = g++

all: clean build

build: $(TAR)

$(TAR): $(SRC)
	$(COM) -o $@ $^

clean:
	rm -f $(TAR)



