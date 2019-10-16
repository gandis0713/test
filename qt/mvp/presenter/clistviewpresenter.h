#ifndef CLISTVIEWPRESENTER_H
#define CLISTVIEWPRESENTER_H

#include <QString>

class IListWidgetView;

class CListViewPresenter
{
public:
    explicit CListViewPresenter(IListWidgetView *pListView);
    virtual ~CListViewPresenter();

    void Added(const QString &strNew);
    void Deleted(const int &nIndex);

private:
    IListWidgetView *m_pListView;
};

#endif // CLISTVIEWPRESENTER_H
