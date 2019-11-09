#include <iostream>

using namespace std;

template <typename T>
void print(T arg)
{
    cout << arg << endl;
}


template<typename T, typename... Ts>
void print(T arg, Ts... args)
{
    cout << arg << ", ";
    print(args...);
}


int main()
{
    print("test", "test1", "test2");
    return 0;
}
