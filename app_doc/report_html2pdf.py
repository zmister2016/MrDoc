# coding:utf-8
# @文件: report_html2pdf.py
# @创建者：州的先生
# #日期：2020/12/27
# 博客地址：zmister.com

import sys
from urllib.parse import quote
from PyQt5 import QtCore, QtWidgets, QtWebEngineWidgets, QtGui
# print(sys.path)


def html2pdf(html_path,pdf_path):
    html_path = '/'.join(html_path.split('\\'))
    html_path = quote(html_path, safe='/:?=')
    # 实例化一个Qt应用
    app = QtWidgets.QApplication(sys.argv)
    # 实例化一个WebEngineView
    loader = QtWebEngineWidgets.QWebEngineView()
    # 设置视图缩放比例
    loader.setZoomFactor(1)
    # 设置页码打印完成后的槽
    loader.page().pdfPrintingFinished.connect(loader.close)
    # 请求HTML文件
    loader.load(QtCore.QUrl("file:///{}".format(html_path)))

    def emit_pdf(finished):
        layout = QtGui.QPageLayout()
        layout.setPageSize(QtGui.QPageSize(QtGui.QPageSize.A4Extra))
        layout.setLeftMargin(20)
        layout.setRightMargin(20)
        layout.setTopMargin(20)
        layout.setBottomMargin(20)
        layout.setOrientation(QtGui.QPageLayout.Portrait)
        loader.page().printToPdf(pdf_path, pageLayout=layout)

    # 加载完成后连接到PDF打印方法
    loader.loadFinished.connect(emit_pdf)
    app.exec_()


if __name__ == '__main__':
    # print(sys.argv)
    html_path, pdf_path = sys.argv[1],sys.argv[2]
    html2pdf(html_path=html_path,pdf_path=pdf_path)
