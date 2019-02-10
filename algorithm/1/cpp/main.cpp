#include <algorithm>
#include <string>
#include <vector>

using namespace std;

vector<int> solution(vector<int> array, vector<vector<int>> commands)
 {
    vector<int> vecAnswer;

    for(int nCIndex = 0; nCIndex < commands.size(); nCIndex++)
    {
        vector<int> vecArr;
        
        for(int i = commands[nCIndex][0] - 1; i < commands[nCIndex][1]; i++)
        {
            vecArr.push_back(array[i]);
        }
        sort(vecArr.begin(), vecArr.end());
        vecAnswer.push_back(vecArr[commands[nCIndex][2] - 1]);

    }
    
    return vecAnswer;
}

#include <iostream>

int main()
{
    cout << "test case : " << endl;

    vector<int> array = {1, 5, 2, 6, 3, 7, 4};
    
    vector<vector<int>> commands = {{2, 5, 3}, {4, 4, 1}, {1, 7, 3}};

    for(int i = 0; i < array.size(); i++)
    {
        cout << array[i];
    }
    cout << endl;

    for(int i = 0; i < commands.size(); i++)
    {
        for(int j = 0; j < commands[i].size(); j++)
        {
            cout << commands[i][j];
        }
        cout << endl;
    }

    vector<int> vecAnswer = solution(array, commands);

    cout << "answer : " << endl;
    for(int i = 0; i < vecAnswer.size(); i++)
    {
        cout << vecAnswer[i];
    }
    cout << endl;

    return 0;
}