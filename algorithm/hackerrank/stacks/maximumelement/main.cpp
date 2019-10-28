#include <cmath>
#include <cstdio>
#include <vector>
#include <stack>
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <functional>
using namespace std;

vector<string> getString(string str)
{
    vector<string> vecStr;
    string strSep;
    const char* cChar = str.c_str();
    for(int i = 0; i < str.length(); i++)
    {
        if(cChar[i] != ' ')
        {
            strSep += cChar[i];
            continue;
        }

        vecStr.push_back(strSep);
        strSep.clear();
    }

    vecStr.push_back(strSep);
    strSep.clear();

    return vecStr;
}


int main()
{
    /* Enter your code here. Read input from STDIN. Print output to STDOUT */

    int count;
    cin >> count;

    cin.clear();
    cin.ignore(256, '\n');

    int index = 0;
    string str;
    stack<long> vec;
    stack<long> vecMax;

    while(index < count)
    {
        getline(cin, str);

        vector<string> vecStr = getString(str);
        int type = atoi(vecStr[0].c_str());
        switch (type)
        {
        case 1:
        {
            int value = atoi(vecStr[1].c_str());
            vec.push(value);
            
            if(vecMax.empty())
            {
                vecMax.push(value); 
            }               
            else
            {
                if(vecMax.top() <= value)
                vecMax.push(value);
            } 
        }
            break;

        case 2:
        {
            if(vec.size() <= 0)
            {
                while(!vecMax.empty())
                    vecMax.pop();
                break;

            }
            if(!vecMax.empty() && vecMax.top() == vec.top())
                vecMax.pop();
                
            vec.pop();
        }
            break;

        case 3:
        {
            cout << vecMax.top() << endl;
        }
            break;
        }

        index++;
    }

    return 0;
}
