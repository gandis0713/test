#include <iostream>
#include <cstdio>
using namespace std;

int main() {
    int i;
    long l;
    char c;
    float f;
    double d;

    cin >> i;
    cin >> l;
    cin >> c;
    cin >> f;
    cin >> d;



    cout << i << endl;
    cout << l << endl;
    cout << c << endl;
    cout.precision(3);
    cout<<fixed<<f<<endl;
    cout.precision(9);
    cout<<fixed<<d<<endl;

    return 0;
}