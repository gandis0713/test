#include "cmainwindowview.h"
#include "ui_cmainwindowview.h"

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

    connect(ui->btnNew, &QPushButton::clicked, this, &CMainWindowView::Add);
    connect(ui->btnDelete, &QPushButton::clicked, this, &CMainWindowView::Delete);
}

CMainWindowView::~CMainWindowView()
{
    delete ui;
}

void CMainWindowView::Add()
{
    m_pMainWindowPresenter->Add();
}
void CMainWindowView::Delete()
{
    m_pMainWindowPresenter->Delete();
}
