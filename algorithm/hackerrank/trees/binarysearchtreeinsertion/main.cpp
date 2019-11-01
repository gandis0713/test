

/*
Node is defined as 

class Node {
    public:
        int data;
        Node *left;
        Node *right;
        Node(int d) {
            data = d;
            left = NULL;
            right = NULL;
        }
};

*/

void insertNode(Node *&root, int data)
{
    if(root == nullptr)
    {
        root = new Node(data);
        return;
    }

    if(root->data > data)
        insertNode(root->left, data);
    else
        insertNode(root->right, data);
}

Node *insert(Node * root, int data) 
{
    insertNode(root, data);

    return root;
}
