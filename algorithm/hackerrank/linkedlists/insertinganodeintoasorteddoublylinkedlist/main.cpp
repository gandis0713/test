

// Complete the sortedInsert function below.

/*
 * For your reference:
 *
 * DoublyLinkedListNode {
 *     int data;
 *     DoublyLinkedListNode* next;
 *     DoublyLinkedListNode* prev;
 * };
 *
 */
DoublyLinkedListNode* sortedInsert(DoublyLinkedListNode* head, int data) {

DoublyLinkedListNode* pPreNode = head->prev;
DoublyLinkedListNode* pCurNode = head;
DoublyLinkedListNode* pNewNode = new DoublyLinkedListNode(data);

bool bInserted = false;
while(pCurNode != nullptr && pCurNode->next != nullptr)
{
    if(pCurNode->data > pNewNode->data)
    {
        pNewNode->next = pCurNode;
        pCurNode->prev = pNewNode;
        bInserted = true;
        head = pNewNode;
        break;
    }
    else if(pCurNode->data <= pNewNode->data && pCurNode->next->data >= pNewNode->data)
    {
        pNewNode->next = pCurNode->next;
        pCurNode->next = pNewNode;
        pNewNode->prev = pCurNode;
        bInserted = true;
        break;
    }
    else
    {
        pPreNode = pCurNode;
        pCurNode = pCurNode->next;
    }
}

if(bInserted == false)
{
    pCurNode->next = pNewNode;
}

return head;
}