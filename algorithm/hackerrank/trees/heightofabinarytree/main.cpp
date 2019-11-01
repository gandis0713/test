
/*The tree node has data, left child and right child 
class Node {
    int data;
    Node* left;
    Node* right;
};

*/
    int height(Node* root) {
        if(root == nullptr)
            return -1;
        
        int left_height = height(root->left);
        int right_height = height(root->right);

        int current_height = left_height > right_height ? left_height : right_height;

        return 1 + current_height;        
    }
