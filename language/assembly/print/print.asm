[ORG 0x00]
[BITS 16]

SECTION .text
;To initialize the segment register

jmp 0x07C0:START ;Set 'CS' segment register to 0x07C0 and move to START label

START:
    mov ax, cs
    mov ds, ax
    mov ax, 0xB800
    mov es, ax

    mov si, 0

SCREEN_CLEAR_LOOP:

    mov byte [es: si], 0
    mov byte [es: si + 1 ], 0x0A

    add si, 2

    cmp si, 80 * 25 * 2

    jl SCREEN_CLEAR_LOOP

    mov si, 0
    mov di, 0

CALLMESSASGE:
	push MESSAGE1
	push 0
	push 0
	call PRINTMESSAGE
	add sp, 6

	push MESSAGE2
	push 1
	push 0
	call PRINTMESSAGE
	add sp, 6

PRINTMESSAGE:
	push bp
	mov bp, sp

	mov ax, 0xB800
	mov es, ax
	
	mov ax, word [ bp + 4 ]
	mov si, 2
	mul si
	mov di, ax

	mov ax, word [ bp + 6 ]
	mov si, 2 * 80
	mul si
	add di, ax

	mov si, word [ bp + 8 ]

MESSAGE_LOOP:
    mov cl, byte [ si ]

    cmp cl, 0
    je MESSAGE_END

    mov byte[es : di], cl

    add si, 1
    add di, 2

    jmp MESSAGE_LOOP

MESSAGE_END:
	pop bp
	ret

MESSAGE1:	db "message 1", 0
MESSAGE2:	db "message 2", 0
	jmp $
times 510 - ( $ - $$ ) db 0x00
db 0x55
db 0xAA
