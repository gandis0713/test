all: clean build image Hexdump

build:
	nasm -o print.bin print.asm

image:

Hexdump:
	hexdump -C print.bin

clean:
	rm -f print.bin
