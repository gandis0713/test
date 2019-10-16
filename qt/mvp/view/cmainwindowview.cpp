#include "cmainwindowview.h"
#include "ui_mainwindow.h"

#include "presenter/cmainwindowpresenter.h"

CMainWindowView::CMainWindowView(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::CMainWindowView),
    m_pMainWindowPresenter(NULL)
{
    ui->setupUi(this);

    m_pMainWindowPresenter = new CMainWindowPresenter(this,
                                                      ui->listWidget,
                                                      ui->editNew);

    connect(ui->btnNew, &QPushButton::clicked, this, &CMainWindowView::SlotClieckAdded);
    connect(ui->btnDelete, &QPushButton::clicked, this, &CMainWindowView::SlotClieckDeleted);
}

CMainWindowView::~CMainWindowView()
{
    delete ui;
}

void CMainWindowView::SlotClieckAdded(bool bState)
{
    Q_UNUSED(bState);
    m_pMainWindowPresenter->Add();
}
void CMainWindowView::SlotClieckDeleted(bool bState)
{
    Q_UNUSED(bState);
    m_pMainWindowPresenter->Delete();
}
