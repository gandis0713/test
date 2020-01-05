GLOBAL_O = global.o
STATIC_O = static.o
OUT = libshared_1_with_lib.so
LIBS = -lstatic_1 -lshared_1
# LIBS = -lstatic_1
# LIBS = -lshared_1
# LIBS = 

OBJECTS = $(GLOBAL_O) $(STATIC_O)

all: clean build copy

build:
	g++ -c $(SHARED_PIC) global.cpp -o $(GLOBAL_O)
	g++ -c $(SHARED_PIC) static.cpp -o $(STATIC_O)

	# g++ -shared $(OBJECTS) -L$(LIB_PATH) $(LIBS) -o $(OUT)
	g++ -shared $(OBJECTS) -o $(OUT)
	
copy:
	mkdir -p ../out
	cp -f $(OUT) ../out

clean:
	rm -f $(OBJECTS)
	rm -f $(OUT)