all: clean build objdump

build:
	gcc -o main main.c
	mingw-gcc -o mainwin_fast.exe mainwin_fast.c
	mingw-gcc -o mainwin_std.exe mainwin_std.c
	mingw-gcc -o mainwin_cdecl.exe mainwin_cdecl.c

objdump:
	./run_objdump main
	./run_objdump mainwin_fast.exe
	./run_objdump mainwin_std.exe
	./run_objdump mainwin_cdecl.exe

clean:
	rm -f main
	rm -f *.exe
	rm -f *.obj
