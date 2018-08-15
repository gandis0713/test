CC = cc 
LD = ld 
CFLAGS = -O2 -Wall -Werror -fomit-frame-pointer -c 
LDFLAGS = -m elf_i386 -dynamic-linker /lib64/ld-linux-x86_64.so.2 
STARTUP = /usr/lib/x86_64-linux-gnu/crt1.o /usr/lib/x86_64-linux-gnu/crti.o /usr/lib/x86_64-linux-gnu/crtn.o

all: nasm gcc

nasm:
	nasm -o main.bin main.asm

gcc:
	gcc -S -masm=intel main.c
	gcc -c -masm=intel main.c
	gcc -o main main.c

man:
	cpp main.c > main.pre
	/usr/lib/gcc/x86_64-linux-gnu/7/cc1 -masm=intel main.pre
	as main.pre



test: tests
	$(LD) $(LDFLAGS) -o main $(STARTUP) main.o -lc 
tests:
	$(CC) -o main.o main.c
clean:
	rm -f *.bin *.s *.o *.pre *.out