

// Complete the removeDuplicates function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* removeDuplicates(SinglyLinkedListNode* head) {

SinglyLinkedListNode *pNode = head;

while(pNode->next != nullptr)
{
    if(pNode->data == pNode->next->data)
    {
        pNode->next = pNode->next->next;
    }
    else
    {
        pNode = pNode->next;
    }
}

return head;


}
