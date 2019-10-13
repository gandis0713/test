#include <iostream>
#include <algorithm>
#include <Windows.h>

using namespace std;

class cmpclass
{
public:
    explicit cmpclass(int a, int b) : m_a(a), m_b(b){}

public:
    inline bool operator()()
    {
        cout << "a : " << m_a << endl;
        cout << "b : " << m_b << endl;
        return m_a < m_b;
    }

private:
    int m_a, m_b;
};

template<typename T>
bool docomp(T func)
{
    return func();
}


int main()
{
    int a = 10;
    int b = 5;
    cmpclass cmpc(a, b);

    docomp(cmpc);

    a = 11; // set value by 11;
    auto cmplambda = [&]()->bool
    {
            cout << "a : " << a << endl;
            cout << "b : " << b << endl;
            return a < b;
    };

    a = 13; // expected value is 13 in lambda.

    docomp(cmplambda);

    return 0;
}
