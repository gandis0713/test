/* Hidden stub code will pass a root argument to the function below. Complete the function to solve the challenge. Hint: you may want to write one or more helper functions.  

The Node struct is defined as follows:
	struct Node {
		int data;
		Node* left;
		Node* right;
	}
*/

int getMax(Node* root)
{
    Node *pNode = root;
    while(pNode->right != nullptr)
        pNode = pNode->right;
    
    return pNode->data;
}

int getMin(Node* root)
{
    Node *pNode = root;
    while(pNode->left != nullptr)
        pNode = pNode->left;
    
    return pNode->data;
}

vector<int> vec;
bool checkBST(Node* root) {
    if(root == nullptr)
        return true;
    
    for(int num : vec)
    {
        if(num == root->data)
            return false;
    }
    
    vec.push_back(root->data);
    
    if(root->left != nullptr && getMax(root->left) > root->data)
        return false;
    
    if(root->right != nullptr && getMin(root->right) < root->data)
        return false;
    
    if(!checkBST(root->left) || !checkBST(root->right))
        return false;
    
    return true;
}