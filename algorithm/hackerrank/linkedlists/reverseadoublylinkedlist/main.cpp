

// Complete the reverse function below.

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
DoublyLinkedListNode* reverse(DoublyLinkedListNode* head) {

DoublyLinkedListNode* pPreNode = nullptr;
DoublyLinkedListNode* pCurNode = head;

while(pCurNode != nullptr)
{
    DoublyLinkedListNode* pNextNode = pCurNode->next;
    pCurNode->prev = pCurNode->next;
    pCurNode->next = pPreNode;
    pPreNode = pCurNode;
    pCurNode = pNextNode;
}

head = pPreNode;

return head;

}
