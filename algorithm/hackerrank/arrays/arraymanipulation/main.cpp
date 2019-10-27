#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

// this is original my code.
//long arrayManipulation(int n, vector<vector<int>> queries) {

//    // initialize
//    vector<long> vecArr;
//    for(int i = 0; i < n; i++)
//    {
//        vecArr.push_back(0);
//    }

//    // add number
//    for(vector<int> vecNum : queries)
//    {
//        int startIndex;
//        if(vecNum[0] < 1)
//            startIndex = 0;
//        else
//            startIndex = vecNum[0] - 1;

//        int endIndex;
//        if(vecNum[1] > n)
//            endIndex = n;
//        else
//            endIndex = vecNum[1];

//        for(int i = startIndex; i < endIndex; i++)
//        {
//            vecArr[i] += vecNum[2];
//        }
//    }

//    // check max number
//    long max = numeric_limits<long>::min();
//    for(long num : vecArr)
//    {
//        if(max < num)
//            max = num;
//    }

//    return max;
//}

long arrayManipulation(int n, vector<vector<int>> queries) {

    // initialize
    vector<long> vecArr;
    for(int i = 0; i < n; i++)
    {
        vecArr.push_back(0);
    }

    // add number
    for(vector<int> vecNum : queries)
    {
        int startIndex = vecNum[0] - 1;
        int endIndex = vecNum[1];

        vecArr[startIndex] += vecNum[2];
        if(endIndex <= n)
             vecArr[endIndex] -= vecNum[2];
    }

    // check max number
    long max = 0;
    long sum = 0;
    for(long num : vecArr)
    {
        sum += num;
        if(max < sum)
            max = sum;
    }

    return max;
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string nm_temp;
    getline(cin, nm_temp);

    vector<string> nm = split_string(nm_temp);

    int n = stoi(nm[0]);

    int m = stoi(nm[1]);

    vector<vector<int>> queries(m);
    for (int i = 0; i < m; i++) {
        queries[i].resize(3);

        for (int j = 0; j < 3; j++) {
            cin >> queries[i][j];
        }

        cin.ignore(numeric_limits<streamsize>::max(), '\n');
    }

    long result = arrayManipulation(n, queries);

    fout << result << "\n";

    fout.close();

    return 0;
}

vector<string> split_string(string input_string) {
    string::iterator new_end = unique(input_string.begin(), input_string.end(), [] (const char &x, const char &y) {
        return x == y and x == ' ';
    });

    input_string.erase(new_end, input_string.end());

    while (input_string[input_string.length() - 1] == ' ') {
        input_string.pop_back();
    }

    vector<string> splits;
    char delimiter = ' ';

    size_t i = 0;
    size_t pos = input_string.find(delimiter);

    while (pos != string::npos) {
        splits.push_back(input_string.substr(i, pos - i));

        i = pos + 1;
        pos = input_string.find(delimiter, i);
    }

    splits.push_back(input_string.substr(i, min(pos, input_string.length()) - i + 1));

    return splits;
}
