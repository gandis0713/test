
/*
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

void levelOrder(Node * root) {

    if(root == nullptr)
        return;

    queue<Node*> que;
    que.push(root);

    while(!que.empty())
    {
        Node *pNode = que.front();
        que.pop();
        cout << pNode->data << " ";

        if(pNode->left != nullptr)
            que.push(pNode->left);

        if(pNode->right != nullptr)
            que.push(pNode->right);
    }
}
