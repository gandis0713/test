#include <iostream>

using namespace std;

int main() {
    int n, k, size, value;
    cin >> n >> k;

    int **ppNum = new int*[n];
    for(int i = 0; i < n; i++)
    {
        cin >> size;
        ppNum[i] = new int[size];
        for(int j = 0; j < size; j++)
        {
            cin >> value;
            ppNum[i][j] = value;
        }
    }

    int q1, q2;
    for(int i = 0; i < k; i++)
    {
        cin >> q1 >> q2;
        cout << ppNum[q1][q2] << endl;
    }

    return 0;
}