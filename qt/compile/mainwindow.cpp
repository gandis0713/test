#include "mainwindow.h"
#include "ui_mainwindow.h"

/**
 * @brief MainWindow::MainWindow
 * @param parent
 */
MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    Initialize();
}


/**
 * @brief MainWindow::Initialize
 */
void MainWindow::Initialize()
{
    connect(ui->btn_run, SIGNAL(clicked(bool)), this, SLOT(SlotBtnRun()));
}

/**
   @brief MainWindow::~MainWindow
 */
MainWindow::~MainWindow()
{
    delete ui;
}

/**
 * @brief MainWindow::SlotBtnRun
 */
void MainWindow::SlotBtnRun()
{
    ui->label_result->setText("clicked");
}
