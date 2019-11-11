#include <sstream>
#include <vector>
#include <iostream>
using namespace std;

vector<int> parseInts(string str)
{
    vector<int> vec;
    string strparse;

    for(int i = 0; i < str.length(); i++)
    {
        if(str[i] == ',')
        {
            istringstream istr(strparse);

            int num;
            istr >> num;
            vec.push_back(num);
            strparse = "";
        }
        else
        {
            strparse += str[i];
        }
    }

    
    istringstream istr(strparse);

    int num;
    istr >> num;
    vec.push_back(num);
    strparse = "";

    return vec;
}

int main() {
    string str;
    cin >> str;
    vector<int> integers = parseInts(str);
    for(int i = 0; i < integers.size(); i++) {
        cout << integers[i] << "\n";
    }

    return 0;
}