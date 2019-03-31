#include "../inc/engine1.h"

#include <iostream>

using namespace std;

static int result = 0;

void Plus(int a)
{
	result = result + a;
}
void Substract(int a)
{
	result = result - a;
}

int GetResult()
{
	return result;
}