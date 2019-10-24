

// Complete the reverse function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* reverse(SinglyLinkedListNode* head)
{
    SinglyLinkedListNode *pPreNode = nullptr;
    SinglyLinkedListNode *pCurrentNode = head;
    SinglyLinkedListNode *pNextNode = nullptr;

    while(pCurrentNode->next != nullptr)
    {
        pNextNode = pCurrentNode->next;
        pCurrentNode->next = pPreNode;
        pPreNode = pCurrentNode;
        pCurrentNode = pNextNode;
    }

    pCurrentNode->next = pPreNode;

    return pCurrentNode;
}
