#include <vector>
#include <iostream>
#include <numeric>

using namespace std;

#define IntMax                     numeric_limits<int>::max()

void addEdge(vector<vector<pair<int, int>>> &graph, int a, int b, int w)
{
    graph[a][b] = make_pair(1, w);
    graph[b][a] = make_pair(1, w);

//    for(int i = 0; i < graph.size(); i++)
//    {
//        for(int j = 0; j < graph.size(); j++)
//        {
//            cout << graph[i][j].first << " ";
//        }
//        cout << endl;
//    }
//    cout << endl;
}

void createWeight(const vector<vector<pair<int, int>>> &graph, vector<vector<int>> &weight)
{
    int size = graph.size();
    for(int i = 0; i < size; i++)
    {
        for(int j = 0; j < size; j++)
        {
            if(i == j)
            {
                weight[i][j] = 0;
            }
            else if(i != j && graph[i][j].second != 0)
            {
                weight[i][j] = graph[i][j].second;
            }
        }
    }

//    for(int i = 0; i < size; i++)
//    {
//        for(int j = 0; j < size; j++)
//        {
//            cout << weight[i][j] << " ";
//        }
//        cout << endl;
//    }
//    cout << endl;
}

int getMinDistance(const vector<int> &minDis, const vector<bool> &visited)
{
    int min = numeric_limits<int>::max();
    int nodeNum = -1;
    for(int i = 0; i < minDis.size(); i++)
    {
        if(visited[i] == false && min > minDis[i])
        {
            min = minDis[i];
            nodeNum = i;
        }
    }

    return nodeNum;
}

void dijkstraEdges(vector<int> &edges, const vector<vector<int>> &weight, int nodeNum)
{
    int size = weight.size();
    edges.clear();
    edges.push_back(nodeNum);

    // 선택된 노드와 각 노드간의 거리를 저장할 배열을 초기화한다.
    // 저장은 선택된 노드와 각 노드간의 Weight값을 사용해 초기화한다.
    vector<int> minDis;
    vector<bool> visited(size, false);
    for(int i = 0; i < size; i++)
    {
        minDis[i] = weight[nodeNum][i];
    }

    // 현재 선택된 노드를 방문한 상태로 변경한다.
    visited[nodeNum] = true;

    // 현재 선택된 노드를 제외한 나머지 노트를 탐색하기 위해 반복문을 실행한다.
    int index = 0;
    while(index < size - 1)
    {
        // 방문하지 않은 노드중에, 가장 작은 Distance값을 가지고 잇는 노드를 가져온다. (Weight 아님)
        int selectedNode =  getMinDistance(minDis, visited);

        // 가장 작은 Distance 값을 가지고 있는 노드를 방문한다. 이미 방문한적이 있거나, 연결되어있지 않은 노드들은 무시한다.
        visited[selectedNode] = true;

        for(int i = 0; i < size; i++)
        {
            if(visited[i] == false && weight[selectedNode][i] != IntMax && weight[selectedNode][i] != 0)
            {
                // 해당노드와의 연결되어 있는 노드들의 Weight값을 얻어와 연결된 노드까지의 Distance를 구한다.
                int newDis = minDis[selectedNode] + weight[selectedNode][i];
                // 가장 작은 Distance로 변경해준다.
                minDis[i] = minDis[i] > newDis ? newDis : minDis[i];
            }
        }
        index++;
    }

    for(int i = 0; i < minDis.size(); i++)
    {
        cout << minDis[i] << " ";
    }
    cout << endl;
}

void dijkstraDistance(vector<int> &minDis, const vector<vector<int>> &weight, int nodeNum)
{
    int size = minDis.size();

    // 선택된 노드와 각 노드간의 거리를 저장할 배열을 초기화한다.
    // 저장은 선택된 노드와 각 노드간의 Weight값을 사용해 초기화한다.
    vector<bool> visited(size, false);
    for(int i = 0; i < size; i++)
    {
        minDis[i] = weight[nodeNum][i];
    }

    // 현재 선택된 노드를 방문한 상태로 변경한다.
    visited[nodeNum] = true;

    // 현재 선택된 노드를 제외한 나머지 노트를 탐색하기 위해 반복문을 실행한다.
    int index = 0;
    while(index < size - 1)
    {
        // 방문하지 않은 노드중에, 가장 작은 Distance값을 가지고 잇는 노드를 가져온다. (Weight 아님)
        int selectedNode =  getMinDistance(minDis, visited);

        // 가장 작은 Distance 값을 가지고 있는 노드를 방문한다. 이미 방문한적이 있거나, 연결되어있지 않은 노드들은 무시한다.
        visited[selectedNode] = true;

        for(int i = 0; i < size; i++)
        {
            if(visited[i] == false && weight[selectedNode][i] != IntMax && weight[selectedNode][i] != 0)
            {
                // 해당노드와의 연결되어 있는 노드들의 Weight값을 얻어와 연결된 노드까지의 Distance를 구한다.
                int newDis = minDis[selectedNode] + weight[selectedNode][i];
                // 가장 작은 Distance로 변경해준다.
                minDis[i] = minDis[i] > newDis ? newDis : minDis[i];
            }
        }
        index++;
    }

    for(int i = 0; i < minDis.size(); i++)
    {
        cout << minDis[i] << " ";
    }
    cout << endl;
}

int main()
{
//    int count = 7;
//    int count = 9;
    int count = 8;

    vector<vector<pair<int, int>>> graph(count, vector<pair<int, int>>(count, make_pair(0, 0)));

//    addEdge(graph, 0, 1, 7);
//    addEdge(graph, 0, 4, 3);
//    addEdge(graph, 0, 5, 10);
//    addEdge(graph, 1, 2, 4);
//    addEdge(graph, 1, 3, 10);
//    addEdge(graph, 1, 5, 6);
//    addEdge(graph, 2, 3, 2);
//    addEdge(graph, 4, 1, 2);
//    addEdge(graph, 4, 3, 11);
//    addEdge(graph, 4, 6, 5);
//    addEdge(graph, 5, 3, 9);
//    addEdge(graph, 6, 3, 4);

//    addEdge(graph, 0, 1, 4);
//    addEdge(graph, 0, 7, 8);
//    addEdge(graph, 1, 7, 11);
//    addEdge(graph, 1, 2, 8);
//    addEdge(graph, 7, 8, 7);
//    addEdge(graph, 7, 6, 1);
//    addEdge(graph, 2, 8, 2);
//    addEdge(graph, 2, 5, 4);
//    addEdge(graph, 2, 3, 7);
//    addEdge(graph, 8, 6, 6);
//    addEdge(graph, 6, 5, 2);
//    addEdge(graph, 3, 5, 14);
//    addEdge(graph, 3, 4, 9);
//    addEdge(graph, 5, 4, 10);

    addEdge(graph, 0, 1, 8);
    addEdge(graph, 0, 2, 10);
    addEdge(graph, 0, 7, 1);
    addEdge(graph, 1, 4, 3);
    addEdge(graph, 2, 7, 5);
    addEdge(graph, 2, 5, 3);
    addEdge(graph, 3, 6, 2);
    addEdge(graph, 4, 6, 5);
    addEdge(graph, 5, 6, 4);

    vector<vector<int>> weight(count, vector<int>(count, IntMax));
    createWeight(graph, weight);

    vector<int> minDis(count, 0);
    dijkstraDistance(minDis, weight, 0);
    dijkstraDistance(minDis, weight, 1);
    dijkstraDistance(minDis, weight, 2);
    dijkstraDistance(minDis, weight, 3);
    dijkstraDistance(minDis, weight, 4);
    dijkstraDistance(minDis, weight, 5);
    dijkstraDistance(minDis, weight, 6);
    dijkstraDistance(minDis, weight, 7);


//    vector<int> edges;
//    dijkstraEdges(edges, weight, 0);
//    dijkstraEdges(edges, weight, 1);
//    dijkstraEdges(edges, weight, 2);
//    dijkstraEdges(edges, weight, 3);
//    dijkstraEdges(edges, weight, 4);
//    dijkstraEdges(edges, weight, 5);
//    dijkstraEdges(edges, weight, 6);
//    dijkstraEdges(edges, weight, 7);
//    dijkstraEdges(edges, weight, 8);


    return 0;
}
