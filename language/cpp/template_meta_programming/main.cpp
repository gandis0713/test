#include <iostream>

using namespace std;

template <int N>
class Factorial
{
public:
    static const int fac = N * Factorial<N - 1>::fac;
};

template <>
class Factorial<1>
{
public:
    static const int fac = 1;
};

int main()
{
    cout << Factorial<6>::fac << endl;
    return 0;
}
