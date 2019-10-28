#include <bits/stdc++.h>

using namespace std;

vector<string> split_string(string);

inline bool compare(const vector<int>& vecCount)
{
    int value = vecCount[0];
    for(int i = 1; i < vecCount.size(); i++)
    {
        if(value != vecCount[i])
        {
            return false;
        }
    }

    return true;
}

int equalStacks(vector<int> h1, vector<int> h2, vector<int> h3)
{
    vector<vector<int>> vecNum;
    vecNum.reserve(3);
    vecNum.push_back(h1);
    vecNum.push_back(h2);
    vecNum.push_back(h3);

    vector<int> vecCount;
    for(int i = 0; i < 3; i++)
    {
        int count = 0;
        for(int j = 0; j < vecNum[i].size(); j++)
        {
            count += vecNum[i][j];
        }
        vecCount.push_back(count);
    }

    while(compare(vecCount) == false)
    {
        int maxIndex = numeric_limits<int>::min();
        int maxCount = numeric_limits<int>::min();

        for(int i = 0; i < 3; i++)
        {
            if(maxCount < vecCount[i])
            {
                maxCount = vecCount[i];
                maxIndex = i;
            }
        }

        vecCount[maxIndex] -= vecNum[maxIndex][0];
        vecNum[maxIndex].erase(vecNum[maxIndex].begin());
    }

    return vecCount[0];
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    string n1N2N3_temp;
    getline(cin, n1N2N3_temp);

    vector<string> n1N2N3 = split_string(n1N2N3_temp);

    int n1 = stoi(n1N2N3[0]);

    int n2 = stoi(n1N2N3[1]);

    int n3 = stoi(n1N2N3[2]);

    string h1_temp_temp;
    getline(cin, h1_temp_temp);

    vector<string> h1_temp = split_string(h1_temp_temp);

    vector<int> h1(n1);

    for (int h1_itr = 0; h1_itr < n1; h1_itr++) {
        int h1_item = stoi(h1_temp[h1_itr]);

        h1[h1_itr] = h1_item;
    }

    string h2_temp_temp;
    getline(cin, h2_temp_temp);

    vector<string> h2_temp = split_string(h2_temp_temp);

    vector<int> h2(n2);

    for (int h2_itr = 0; h2_itr < n2; h2_itr++) {
        int h2_item = stoi(h2_temp[h2_itr]);

        h2[h2_itr] = h2_item;
    }

    string h3_temp_temp;
    getline(cin, h3_temp_temp);

    vector<string> h3_temp = split_string(h3_temp_temp);

    vector<int> h3(n3);

    for (int h3_itr = 0; h3_itr < n3; h3_itr++) {
        int h3_item = stoi(h3_temp[h3_itr]);

        h3[h3_itr] = h3_item;
    }

    int result = equalStacks(h1, h2, h3);

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