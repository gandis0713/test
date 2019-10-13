#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    m_pMainControllerObs(NULL),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    connect(ui->btnNew, &QPushButton::clicked, this, [&](bool bState){ Q_UNUSED(bState); if(m_pMainControllerObs != NULL)m_pMainControllerObs->OnClickedNew(ui->editNew->text());});
    connect(ui->btnDelete, &QPushButton::clicked, this, [&](bool bState){ Q_UNUSED(bState); if(m_pMainControllerObs != NULL)m_pMainControllerObs->OnClickedDelete(ui->listWidget->currentIndex().row());});
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::OnAdded(const QString &strNew)
{
    ui->listWidget->addItem(strNew);
}

void MainWindow::OnDeleted(const int &nIndex)
{
    ui->listWidget->model()->removeRow(nIndex);
}

void MainWindow::setMainControllerObs(IMainControllerObs *pMainControllerObs)
{
    m_pMainControllerObs = pMainControllerObs;
}
