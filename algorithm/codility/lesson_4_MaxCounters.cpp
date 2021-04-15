#include <algorithm>

vector<int> solution(int N, vector<int> &vec) {
    // write your code in C++14 (g++ 6.2.0)
    vector<int> vecResult(N, 0);
    vector<int>::iterator it;
    int maxValue = 0;
    for(it = vec.begin(); it != vec.end(); it++) {
        const int &value = *it;
        if(value == N + 1) {
            vecResult.assign(N, maxValue); // TODO : performance
            continue;
        }
        int curValue = vecResult[value - 1] + 1;
        vecResult[value - 1] = curValue;
        if(curValue > maxValue) maxValue = curValue;
    }

    return vecResult;
}