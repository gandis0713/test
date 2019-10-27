

// Complete the insertNodeAtPosition function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */
SinglyLinkedListNode* insertNodeAtPosition(SinglyLinkedListNode* head, int data, int position) {

    SinglyLinkedListNode *pPreNode = head;
    SinglyLinkedListNode *pNextNode = head->next;
    for(int i = 0; i < position - 1; i++)
    {
        pPreNode = pPreNode->next;
        pNextNode = pNextNode->next;
    }

    SinglyLinkedListNode *pNewNode = new SinglyLinkedListNode(data);
    pNewNode->next = pNextNode;
    pPreNode->next = pNewNode;

    return head;
}
