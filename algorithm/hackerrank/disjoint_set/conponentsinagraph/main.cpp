#include <iostream>
#include <list>
#include <vector>
#include <algorithm>

using namespace std;

class Node
{
public:
    Node()
        : data(-1)
        , marked(false)
    {}

    Node(int data)
        : data(data)
        , marked(false)
    {}

    bool contains(Node *node)
    {
        return std::find(lstAdjacent.begin(), lstAdjacent.end(), node) != lstAdjacent.end();
    }

    int data;
    bool marked;
    list<Node*> lstAdjacent;
};

class Graph
{
public:
    Graph(){}

    Node* getNode(int data)
    {
        for(int i = 0; i < vecNode.size(); i++)
        {
            if(data == vecNode[i]->data)
                return vecNode[i];
        }

        return NULL;
    }

    bool contains(Node *node)
    {
        return std::find(vecNode.begin(), vecNode.end(), node) != vecNode.end();
    }

    void addEdge(Node *node1, Node *node2)
    {
        if(!contains(node1))
        {
            vecNode.push_back(node1);
        }
        if(!contains(node2))
        {
            vecNode.push_back(node2);
        }

        if(!node1->contains(node2))
        {
            node1->lstAdjacent.push_back(node2);
        }

        if(!node2->contains(node1))
        {
            node2->lstAdjacent.push_back(node1);
        }
    }

    void initMark()
    {
        int index = 0;
        while(index < vecNode.size())
        {
            vecNode[index]->marked = false;
            index++;
        }
    }

    int getSmallest()
    {
        int min = numeric_limits<int>::max();
        for(Node *node : vecNode)
        {
            initMark();
            node->marked  = true;
            int height = minHeight(node);
            if(min > height)
                min = height;
        }

        return min + 1;
    }

    int getLargest()
    {
        int max = numeric_limits<int>::min();
        for(Node *node : vecNode)
        {
            initMark();
            node->marked  = true;
            int height = maxHeight(node);
            if(max < height)
                max = height;
        }

        return max;
    }

    vector<Node*> vecNode;

private:

    int maxHeight(Node *node)
    {
        if(node == NULL)
            return 0;

        int count = 0;
        int max = 0;
        for(list<Node*>::iterator iter = node->lstAdjacent.begin(); iter != node->lstAdjacent.end(); iter++)
        {
            Node *node = (*iter);
            if(!node->marked)
            {
                node->marked = true;
                int height = maxHeight(node);
                if(max < height)
                    max = height;

                count++;
            }
        }

        return 1 + max;
    }

    int minHeight(Node *node)
    {
        if(node == NULL)
            return 0;

        int count = 0;
        int min = 0;
        for(list<Node*>::iterator iter = node->lstAdjacent.begin(); iter != node->lstAdjacent.end(); iter++)
        {
            Node *node = (*iter);
            if(!node->marked)
            {
                node->marked = true;
                int height = maxHeight(node);
                if(min > height)
                    min = height;

                count++;
            }
        }

        return 1 + min;
    }
};

int main()
{
    int size = 0;
    cin >> size;

    int index = 0;
    Graph graph;
    while(index < size)
    {
        int index1, index2;
        cin >> index1 >> index2;

        Node *node1 = graph.getNode(index1);
        if(NULL == node1)
        {
            node1 = new Node(index1);
        }

        Node *node2 = graph.getNode(index2);
        if(NULL == node2)
        {
            node2 = new Node(index2);
        }

        graph.addEdge(node1, node2);

        index++;
    }

    cout << graph.getSmallest() << " " << graph.getLargest() << endl;

    return 0;
}
