#include <QApplication>
#include "MainWindow.h"

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    // Áp dụng Dark Theme cơ bản bằng CSS của Qt (QSS)
    app.setStyleSheet(
        "QMainWindow { background-color: #2b2b2b; }"
        "QWidget { color: #e0e0e0; font-family: Arial; }"
        "QMenuBar { background-color: #1e1e1e; color: white; }"
        "QMenu { background-color: #1e1e1e; color: white; border: 1px solid #444; }"
        "QSplitter::handle { background-color: #444444; }"
        "QLabel { background-color: #333333; border: 1px solid #555; border-radius: 4px; padding: 5px; }"
    );

    MainWindow window;
    window.resize(1280, 720); // Kích thước mặc định
    window.show();

    return app.exec();
}
