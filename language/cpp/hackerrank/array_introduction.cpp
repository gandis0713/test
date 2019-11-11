#include <cmath>
#include <cstdio>
#include <vector>
#include <iostream>
#include <algorithm>
using namespace std;


int main() {
    int size;
    vector<int> vec;

    cin >> size;

    int index = 0;
    while(index < size)
    {
        int num;
        cin >> num;
        vec.push_back(num);
        index++;
    }  

    std::reverse(vec.begin(), vec.end());

    index = 0;
    while(index < size)
    {
        cout << vec[index] << " ";
        index++;
    }
    return 0;
}