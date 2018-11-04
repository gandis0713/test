#include <iostream>

using namespace std;

#define ARR_SIZE_K     3
#define ARR_SIZE_J     3
#define ARR_SIZE_I     3

int main(int argc, char **argv)
{
	int (*arrChar)[ARR_SIZE_I] = new int[ARR_SIZE_J][ARR_SIZE_I];


	for(int j = 0; j < ARR_SIZE_J; j++)
	{
		for(int i = 0; i < ARR_SIZE_I; i++)
		{
			arrChar[j][i] = (j * ARR_SIZE_J) + i;
		}
	}

	for(int j = 0; j < ARR_SIZE_J; j++)
	{
		for(int i = 0; i < ARR_SIZE_I; i++)
		{
			cout << arrChar[j][i] << endl;
		}
	}

	// for(int k = 0; k < ARR_SIZE_K; k++)
	// {
	// 	for(int j = 0; j < ARR_SIZE_J; j++)
	// 	{
	// 		for(int i = 0; i < ARR_SIZE_I; i++)
	// 		{
	// 			arrChar[k][j][i] = ((k * j) + (k * i) + k) +
	// 							((j * i) + j) + 
	// 							i;
	// 		}
	// 	}
	// }

	// for(int k = 0; k < ARR_SIZE_K; k++)
	// {
	// 	for(int j = 0; j < ARR_SIZE_J; j++)
	// 	{
	// 		for(int i = 0; i < ARR_SIZE_I; i++)
	// 		{
	// 			cout << arrChar[k][j][i] << endl;
	// 		}
	// 	}
	// }

	return 0;
}
