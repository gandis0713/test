#include <stdio.h>

void main()
{
    printMessage("hello", 1, 5);
}

void printMessage(char* message, int x, int y)
{
    printf("Message : %s, x : %d, y : %d \n", message, x, y);
}