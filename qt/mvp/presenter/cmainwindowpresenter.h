#ifndef CMAINWINDOWPRESENTER_H
#define CMAINWINDOWPRESENTER_H

#include <QString>
#include "model/clistmodel.h"

class IMainWindowView;
class IListWidgetView;
class ILineEditView;

class CMainWindowPresenter
{
public:
     CMainWindowPresenter(IMainWindowView *pMainWindow,
                          IListWidgetView *pListView,
                          ILineEditView *pLineEditView);
    virtual ~CMainWindowPresenter();

    void Add();
    void Delete();

private:
    IMainWindowView   *m_pMainWindow;
    IListWidgetView     *m_pListView;
    CListModel     m_listModel;
    ILineEditView *m_pLineEditView;
};

#endif // CMAINWINDOWPRESENTER_H
