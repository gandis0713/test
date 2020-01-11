CC = g++
OBJECTS = main.o define.o
EXECUTE = main.out

# STATIC = -lstatic_1 -lstatic_2
# SHARED = -lshared_1 -lshared_2
SHARED_WITH = -lshared_1_with_lib -lshared_2_with_lib
# STATIC_WITH = -lstatic_1_with_lib -lstatic_2_with_lib
STATIC = 
SHARED = 
# SHARED_WITH =
STATIC_WITH =

LIB_PATH = /home/gandis/Desktop/git/prototype/language/cpp/library/out

all: clean build

build:
	$(CC) main.cpp -o $(EXECUTE) -L$(LIB_PATH) $(SHARED) $(STATIC) $(SHARED_WITH) $(STATIC_WITH)

clean:
	rm -f $(EXECUTE)
	rm -f $(OJBECTS)