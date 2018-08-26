[bits 16]
[org 0x0000]

jmp 0x07C0:Initialize	; set Code Segment address to 0x7C00. master boot record is loaded at 0x7C00.
						; however set 0x07C0 here. because of physical address is calculated 4 bit to the left shift.  

Initialize:
	mov ax, cs
	mov ds, ax	; set data segment address to code segment address.

	mov ax, 0xB800
	mov es, ax	; set display address.
	
	mov ax, 0x0000
	mov ss, ax	; initialize Stack Segment address.
	mov bp, 0xFFFF	; initialize Stack Base Pointer address.
	mov sp, 0xFFFF	; initialize Stack Pointer address.

	jmp Start

Start:
	call CleanDisplay
	call StartBooting

CleanDisplay:
	call SetRegistersForCleanDisplay
	call CleanLoop

	ret

SetRegistersForCleanDisplay:
	mov cx, 0x07D0	; set count by display size. ( 0x0080 * 0x0025 * 0x0002 )
	mov di, 0x0000	; initialize the offset address for target text.
	mov ax, word [msgClean]	; set text property as 2 byte.

	ret

CleanLoop:
	mov word [ es : di ], ax
	add di, 0x0002
	dec cx

	jnz CleanLoop

	ret

StartBooting:
	push msgStart	; push text message.
	push 0x0000	; push Y position of text.
	push 0x0000	; push X position of text.

	call Print
	call Done

Print:
	mov si, 0x0000
	mov di, 0x0000

	push bp
	mov bp, sp

	mov di, 0x0000

	mov ax, word [ bp + 0x0004 ]
	mov si, 0x0002
	mul si
	add di, ax

	mov ax, word [ bp + 0x0006 ]
	mov si, 0x0160
	mul si
	add di, ax

	mov si, word [ bp + 0x0008 ]

.PrintLoop:
	mov cl, byte [ si ]

	cmp cl, 0x0000

	je Done

	mov byte [ es : di ], cl
	inc si
	add di, 0x0002

	jmp .PrintLoop

	pop bp
	ret

Done:
	jmp $
	
msgClean dw 0x0A00
msgStart db "gandis's os is started.", 0x0000

times 0x01FE - ( $ - $$ ) db 0x0000

dw 0xAA55
