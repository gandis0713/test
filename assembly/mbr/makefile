all: clean build floppy iso printHex

build:
	nasm -f bin -o mbr.bin mbr.asm


floppy:
	dd if=mbr.bin of=mbr.flp

iso:
	mkisofs -no-emul-boot -boot-load-size 4 -o mbr.iso -b mbr.bin .

printHex:
	hexdump -C mbr.bin

clean:
	rm -f mbr.bin
	rm -f mbr.flp
	rm -f mbr.iso
