CC = cc 
LD = ld 
RM = rm -f 
CFLAGS = -O2 -Wall -Werror -fomit-frame-pointer -v -c 
#LDFLAGS = -lc -m elf_i386 -dynamic-linker /lib/ld-linux.so.2
LDFLAGS = -lc -m elf_i386 -dynamic-linker  /lib64/ld-linux-x86_64.so.2
# STARTUP = /usr/lib/crt1.o /usr/lib/crti.o /usr/lib/crtn.o 
STARTUP = /usr/lib/x86_64-linux-gnu/crt1.o /usr/lib/x86_64-linux-gnu/crti.o /usr/lib/x86_64-linux-gnu/crtn.o

BUILD = test 
OBJS = test.o hello.o 

.PHONY: all clean 

all: $(BUILD) 
clean: ; $(RM) *.o $(BUILD) 
test: $(OBJS) ; $(LD) $(LDFLAGS) -o $@ $(STARTUP) $^ 

# 의존관계 성립 
hello.o: $($@:.o=.c) $($@:.o=.h) Makefile 
test.o: $($@:.o=.c) hello.h Makefile 

# 확장자 규칙 (컴파일 공통 규칙) 
.c.o: ; $(CC) $(CFLAGS) -o $@ $< 