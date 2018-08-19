all: clean build

build:
	nasm -o mbr.bin mbr.asm
	hexdump -C mbr.bin

clean:
	rm -f mbr.bin
