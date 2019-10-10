#include <iostream>
#include <algorithm>
#include <Windows.h>

using namespace std;

class cmpclass
{
public:
    inline bool operator()(int a, int b)
    {
        return a < b;
    }
};


bool cmpfunc(int a, int b)
{
    return a < b;
}

int main()
{
    const int SIZE = 50000000;
    int *num1 = new int[SIZE];
    int *num2 = new int[SIZE];

    for(int i = 0; i < SIZE; i++)
    {
        num1[i] = rand();
        num2[i] = num1[i];
    }

    cmpclass cmpc;

    int time = GetTickCount64();

    sort(num1, num1 + SIZE, cmpc);

    time = GetTickCount64() - time;

    cout << "Function Object : " << time << endl;

    time = GetTickCount64();

    sort(num2, num2 + SIZE, cmpfunc);

    time = GetTickCount64() - time;

    cout << "Function Pointer : " << time << endl;

    return 0;
}
