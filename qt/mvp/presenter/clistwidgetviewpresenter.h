#ifndef CLISTWIDGETVIEWPRESENTER_H
#define CLISTWIDGETVIEWPRESENTER_H

#include <QString>

class IListWidgetView;

class CListWidgetViewPresenter
{
public:
    explicit CListWidgetViewPresenter(IListWidgetView *pListView);
    virtual ~CListWidgetViewPresenter();

    void Add(const QString &strNew);
    void Delete(const int &nIndex);

    int GetSelectedIndex();

private:
    IListWidgetView *m_pListView;
};

#endif // CLISTWIDGETVIEWPRESENTER_H
