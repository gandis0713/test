[bits 16]
[org 0x0000]

jmp 0x07C0:Initialize	; set Code Segment address to 0x7C00. master boot record is loaded at 0x7C00.
						; however set 0x07C0 here. because of physical address is calculated 4 bit to the left shift.  

Initialize:
	mov ax, cs
	mov ds, ax	; set data segment address to code segment address.

	call CleanDisplay
	call SetRegistersForPrint
	call Print

CleanDisplay:
	call SetRegistersForCleanDisplay
	call CleanLoop

SetRegistersForCleanDisplay:
	mov ax, 0xB800
	mov es, ax	; set display address.

	mov cx, 0x07D0	; set count by display size. ( 0x0080 * 0x0025 * 0x0002 )

	mov di, 0x0000	; initialize the offset address for target text.

	mov ax, word [msgClean]	; set text property as 2 byte.

CleanLoop:
	mov word [ es : di ], ax
	add di, 0x0002
	dec cx

	jnz CleanLoop

SetRegistersForPrint:
	mov ax, 0x0000
	mov ss, ax
	mov bp, 0xFFFF
	mov sp, 0xFFFF

	mov si, 0x0000
	mov di, 0x0000

Print:
	push msgStart
	push 0
	push 0

	push bp
	mov bp, sp

	mov di, 0

	mov ax, word [ bp + 2 ]
	mov si, 2
	mul si
	add di, ax

	mov ax, word [ bp + 4 ]
	mov si, 160
	mul si
	add di, ax

	mov si, word [ bp + 6 ]
MessageLoop:

	mov cl, byte [ si ]

	cmp cl, 0

	je Done

	mov byte [ es : di ], cl
	inc si
	add di, 2

	jmp MessageLoop
Done:
	jmp $

msgClean dw 0x0A00
msgStart db "gandis's os is started.", 0

times 510 - ( $ - $$ ) db 0x0

db 0x55
db 0xAA
