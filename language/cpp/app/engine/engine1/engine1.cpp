#include "../inc/engine1.h"

#include <iostream>

using namespace std;

static int result = 0;

int Plus(int a)
{
	result += a;
	return result;
}
int Substract(int a)
{
	result -= a;
	return result;
}