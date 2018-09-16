#include <stdio.h>
#include "function.h"

typedef int(*AddFunc)(int, int);

void Callprint(AddFunc);

int main()
{
	AddFunc addFunc = Add;
	Callprint(addFunc);
	return 0;
}

void Callprint(AddFunc addFunc)
{
	for(int i = 1; i <= 100; i++)
	{
		int added = addFunc(i, 1);
		printf("added : %d", added);
	}
}
