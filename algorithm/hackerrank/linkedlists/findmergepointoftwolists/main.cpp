

// Complete the findMergeNode function below.

/*
 * For your reference:
 *
 * SinglyLinkedListNode {
 *     int data;
 *     SinglyLinkedListNode* next;
 * };
 *
 */

SinglyLinkedListNode* findSameNode(SinglyLinkedListNode* pNode1, SinglyLinkedListNode* pNode2)
{
    while(pNode2 != nullptr)
    {
        if(pNode1 == pNode2)
        {
            return pNode2;
        }
        else
        {
            pNode2 = pNode2->next;
        }
    }

    return nullptr;
}

int findMergeNode(SinglyLinkedListNode* head1, SinglyLinkedListNode* head2) {

    SinglyLinkedListNode *pNode1 = head1;
    SinglyLinkedListNode *pNode2 = head2;
    
    SinglyLinkedListNode *pMergeNode = findSameNode(pNode1, pNode2);
    while(nullptr == pMergeNode && pNode1 != nullptr)
    {
        pNode1 = pNode1->next;
        pNode2 = head2;

        pMergeNode = findSameNode(pNode1, pNode2);
    }

    if(pMergeNode != nullptr)
        return pMergeNode->data;

    return -1;
}