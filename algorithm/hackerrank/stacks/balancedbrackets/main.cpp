#include <bits/stdc++.h>

using namespace std;

// Complete the isBalanced function below.
string isBalanced(string s)
{
    stack<char> stackChar;
    
    if(s[0] == ']' || s[0] == '}' || s[0] == ')')
    {
        return "NO";
    }

    for(int i = 0; i < s.length(); i++)
    {
        if(s[i] == '[' || s[i] == '{' || s[i] == '(')
        {
            stackChar.push(s[i]);
        }
        
        if(stackChar.empty() == true)
            continue;

        char cChar = stackChar.top();
        if(s[i] == ']')
        {
            if(cChar == '[')
            {
                stackChar.pop();
                continue;
            }
            break;
        }
        
        if(s[i] == '}')
        {
            if(cChar == '{')
            {
                stackChar.pop();
                continue;
            }
            break;
        }
        
        if(s[i] == ')')
        {
            if(cChar == '(')
            {
                stackChar.pop();
                continue;
            }
            break;
        }
    }
    
    if(stackChar.empty() == true)
        return "YES";
    else
        return "NO";
}

int main()
{
    ofstream fout(getenv("OUTPUT_PATH"));

    int t;
    cin >> t;
    cin.ignore(numeric_limits<streamsize>::max(), '\n');

    for (int t_itr = 0; t_itr < t; t_itr++) {
        string s;
        getline(cin, s);

        string result = isBalanced(s);

        fout << result << "\n";
    }

    fout.close();

    return 0;
}