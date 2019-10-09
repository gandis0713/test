#include <iostream>

typedef int Func(int, int);

int add(int a, int b)
{
    return a + b;
}

void print_add(int a, int b, Func func)
{
    std::cout << func(a, b) << std::endl;
}

int main()
{
    Func *func = add;
    print_add(3, 8, func);

    return 0;
}
