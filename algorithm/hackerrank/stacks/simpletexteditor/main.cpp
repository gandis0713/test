#include <cmath>
#include <cstdio>
#include <vector>
#include <stack>
#include <iostream>
#include <algorithm>
#include <sstream>
using namespace std;

vector<string> split_string(string input_string) {
    string::iterator new_end = unique(input_string.begin(), input_string.end(), [] (const char &x, const char &y) {
        return x == y && x == ' ';
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

int main()
{
    int size;
    cin >> size;

    int count = 0;
    stack<vector<char>> vecTotal;
    vector<char> vecChar;
    vector<string> vec;

    cin.clear();
    cin.ignore(256,'\n');

    while(count < size)
    {
        count++;
        string str;
        getline(cin,str);

        vec = split_string(str);
        if(vec.size() <= 0)
            continue;

        int type = atoi(vec[0].c_str());
        if(type == 1)
        {
            if(vec.size() <= 1)
            {
                // do nothing.
            }
            else
            {
                for(int i = 0; i < vec[1].length(); i++)
                {
                    vecChar.push_back(vec[1][i]);
                }
            }

            vecTotal.push(vecChar);
        }
        else if(type == 2)
        {
            if(vec.size() <= 1)
            {
                // do nothing.
            }
            else
            {
                int cutsize = atoi(vec[1].c_str());
                if(vecChar.size() < atoi(vec[1].c_str()))
                    cutsize = vecChar.size();

                vecChar.erase(vecChar.end() - cutsize, vecChar.end());
            }

            vecTotal.push(vecChar);
        }
        else if(type == 3)
        {
            if(vec.size() <= 1)
            {
                // do nothing.
            }
            else
            {
                int index = atoi(vec[1].c_str());
                if(vecChar.size() < index)
                {
                    cout << "" << endl;
                }
                else
                {
                    cout << vecChar[index - 1] << endl;
                }


            }
        }
        else if (type == 4)
        {
            if(vecTotal.empty())
                continue;

            vecTotal.pop();

            if(vecTotal.empty())
                continue;

            vecChar = vecTotal.top();
        }
    }

    return 0;
}
