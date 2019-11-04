#ifndef CMAINWINDOWPRESENTER_H
#define CMAINWINDOWPRESENTER_H

#include <QString>
#include "model/clistmodel.h"

class IMainWindowView;
class IListWidgetView;
class ILineEditView;

class CListWidgetViewPresenter;
class CLineEditViewPresenter;

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
    // view
    IMainWindowView   *m_pMainWindow;

    // model
    CListModel         m_listModel;

    // sub presenter
    CListWidgetViewPresenter     *m_pListWidgetViewPresenter;
    CLineEditViewPresenter       *m_pLineEditViewPresenter;
};

#endif // CMAINWINDOWPRESENTER_H
