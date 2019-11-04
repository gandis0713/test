#include <list>
#include <algorithm>
#include <iostream>
#include <vector>
#include <stack>
#include <queue>

#define TEST 1

using namespace std;

template <typename Type>
class GraphNode
{
public:
    GraphNode()
        : marked(false)
    {}
    GraphNode(Type data)
        : data(data)
        , marked(false)
    {}

    bool contains(GraphNode *node)
    {
        return std::find(lstAdjacent.begin(), lstAdjacent.end(), node) != lstAdjacent.end();
    }

    GraphNode<Type>* GraphNode<Type>::operator=(GraphNode &node)
    {
        return *this;
    }

    Type data;
    bool marked;
    list<GraphNode*> lstAdjacent;
};

template <typename Type>
class Graph
{
public:
    Graph()
        : node_size(0)
    {}
    Graph(int node_size = 0)
        : node_size(node_size)
    {
        vecNode.reserve(node_size);
        int index = 0;
        while(index < node_size)
        {
            vecNode.push_back(new GraphNode<Type>(index));
            index++;
        }
    }

    void addEdge(int index1, int index2)
    {
        if(index1 >= node_size || index2 >= node_size)
            return;

        GraphNode<Type> *node1 = vecNode[index1];
        GraphNode<Type> *node2 = vecNode[index2];

        if(false == node1->contains(node2))
        {
            node1->lstAdjacent.push_back(node2);
        }

        if(false == node2->contains(node1))
        {
            node2->lstAdjacent.push_back(node1);
        }
    }

    void addEdge(GraphNode<Type> *node1, GraphNode<Type> *node2)
    {
        if(node1 == NULL || node2 == NULL)
            return;

        if(false == node1->contains(node2))
        {
            node1->lstAdjacent.push_back(node2);
        }

        if(false == node2->contains(node1))
        {
            node2->lstAdjacent.push_back(node1);
        }
    }

    void initMark()
    {
        int index = 0;
        while(index < node_size)
        {
            GraphNode<Type>* node = vecNode[index];
            if(node)
            {
                node->marked = false;
            }
            index++;
        }
    }

    vector<GraphNode<Type>*> dfs(int index = 0)
    {
        vector<GraphNode<Type>*> vecGraphNode;

        if(index >= node_size)
            return vecGraphNode;

        initMark();

        GraphNode<Type> *node = this->vecNode[index];

        stack<GraphNode<Type>*> stc;
        stc.push(node);

        node->marked = true;

        while(false == stc.empty())
        {
            GraphNode<Type>* nodeTop = stc.top();
            vecGraphNode.push_back(nodeTop);

            stc.pop();

            for(GraphNode<Type> *nodeFor : nodeTop->lstAdjacent)
            {
                if(nodeFor->marked == false)
                {
                    nodeFor->marked = true;
                    stc.push(nodeFor);
                }
            }
        }

        return vecGraphNode;
    }

    void dfsPrint(int index = 0)
    {
        if(index >= node_size)
            return;

        initMark();

        GraphNode<Type> *node = this->vecNode[index];

        stack<GraphNode<Type>*> stc;
        stc.push(node);

        node->marked = true;

        while(false == stc.empty())
        {
            GraphNode<Type>* nodeTop = stc.top();
            cout << nodeTop->data << " ";

            stc.pop();

            for(GraphNode<Type> *nodeFor : nodeTop->lstAdjacent)
            {
                if(nodeFor->marked == false)
                {
                    nodeFor->marked = true;
                    stc.push(nodeFor);
                }
            }
        }

        cout << endl;
    }

    vector<GraphNode<Type>*> bfs(int index = 0)
    {
        vector<GraphNode<Type>*> vecGraphNode;

        if(index >= node_size)
            return vecGraphNode;

        initMark();

        GraphNode<Type>* node = vecNode[index];
        queue<GraphNode<Type>*> que;
        que.push(node);

        node->marked = true;

        while(!que.empty())
        {
            GraphNode<Type>* nodeFront = que.front();
            vecGraphNode.push_back(nodeFront);

            que.pop();

            for(GraphNode<Type>* nodeAdj : nodeFront->lstAdjacent)
            {
                if(!nodeAdj->marked)
                {
                    nodeAdj->marked = true;
                    que.push(nodeAdj);
                }
            }
        }

        return vecGraphNode;
    }

#ifdef TEST
    void dfsPrint(int index = 0)
    {
        if(index >= node_size)
            return;

        initMark();

        GraphNode<Type> *node = this->vecNode[index];

        stack<GraphNode<Type>*> stc;
        stc.push(node);

        node->marked = true;

        while(false == stc.empty())
        {
            GraphNode<Type>* nodeTop = stc.top();
            cout << nodeTop->data << " ";

            stc.pop();

            for(GraphNode<Type> *nodeFor : nodeTop->lstAdjacent)
            {
                if(nodeFor->marked == false)
                {
                    nodeFor->marked = true;
                    stc.push(nodeFor);
                }
            }
        }

        cout << endl;
    }

    void bfsPrint(int index = 0)
    {
        if(index >= node_size)
            return;

        initMark();

        GraphNode<Type>* node = vecNode[index];
        queue<GraphNode<Type>*> que;
        que.push(node);

        node->marked = true;

        while(!que.empty())
        {
            GraphNode<Type>* nodeFront = que.front();
            cout << nodeFront->data << " ";

            que.pop();

            for(GraphNode<Type>* nodeAdj : nodeFront->lstAdjacent)
            {
                if(!nodeAdj->marked)
                {
                    nodeAdj->marked = true;
                    que.push(nodeAdj);
                }
            }
        }

        cout << endl;
    }

#endif

private:
    int node_size;
    vector<GraphNode<Type>*> vecNode;
};

int main()
{
    Graph<int> graph(9);

    graph.addEdge(0, 1);
    graph.addEdge(1, 2);
    graph.addEdge(1, 3);
    graph.addEdge(2, 4);
    graph.addEdge(2, 3);
    graph.addEdge(3, 4);
    graph.addEdge(3, 5);
    graph.addEdge(5, 6);
    graph.addEdge(5, 7);
    graph.addEdge(6, 8);

    graph.bfsPrint();
    graph.dfsPrint();

    return 0;
}
