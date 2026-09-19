# coding:utf-8
# @文件: report_html2pdf.py
# @创建者：州的先生
# #日期：2020/12/27
# 博客地址：zmister.com

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager,ChromeType
from django.conf import settings
from django.utils.translation import gettext_lazy as _
import sys
import json
import base64
import time


def convert(source: str, target: str, timeout: int = 20, compress: bool = False, power: int = 0, install_driver: bool = True):
    '''
    Convert a given html file or website into PDF

    :param str source: source html file or website link
    :param str target: target location to save the PDF
    :param int timeout: 等待正文图片加载完成的秒数上限，默认 20 秒。
        图片全部加载完成后会提前结束等待，不必等到上限
    :param bool compress: whether PDF is compressed or not. Default value is False
    :param int power: power of the compression. Default value is 0. This can be 0: default, 1: prepress, 2: printer, 3: ebook, 4: screen
   '''

    result = __get_pdf_from_html(source, timeout, install_driver)

    # if compress:
    #     __compress(result, target, power)
    # else:
    with open(target, 'wb') as file:
        file.write(result)


def __send_devtools(driver, cmd, params={}):
    resource = "/session/%s/chromium/send_command_and_get_result" % driver.session_id
    # 兼容不同 selenium 版本：4.25 及以前命令执行器用 _url 属性，
    # 新版（ClientConfig 重构后）改为 client_config.remote_server_addr
    url = getattr(driver.command_executor, "_url", None)
    if url is None:
        url = driver.command_executor.client_config.remote_server_addr
    url += resource
    body = json.dumps({'cmd': cmd, 'params': params})
    response = driver.command_executor._request('POST', url, body)

    if not response:
        raise Exception(response.get('value'))

    return response.get('value')


def __wait_content_images(driver, timeout: int):
    '''
    打印前去掉图片的懒加载标记，并等待正文图片加载完成。

    MrDoc 的 Markdown 渲染器会给每张图片加上 loading="lazy"，
    而打印时页面不会滚动，首屏之外的图片不会进入加载队列，
    导出的 PDF 中这些图片就是空白（文档页打印路径已在 doc.html 中做同样处理）。
    '''
    script = '''
        var lazies = document.querySelectorAll('img[loading="lazy"], iframe[loading="lazy"]');
        for (var i = 0; i < lazies.length; i++) {
            lazies[i].removeAttribute('loading');
        }
        // 只统计还没有结果的图片：加载失败的 complete 也为 true，
        // 因此不会把它们算作在途请求，避免无谓地等到超时
        var pending = 0;
        var imgs = document.querySelectorAll('#content img');
        for (var i = 0; i < imgs.length; i++) {
            if (imgs[i].getAttribute('src') && !imgs[i].complete) pending++;
        }
        return pending;
    '''
    deadline = time.time() + timeout
    while time.time() < deadline:
        if driver.execute_script(script) == 0:
            return
        time.sleep(0.3)


def __get_pdf_from_html(path: str, timeout: int, install_driver: bool, print_options={}):
    webdriver_options = Options()
    webdriver_prefs = {}
    driver = None

    webdriver_options.add_argument('--no-sandbox')
    webdriver_options.add_argument('--headless')
    webdriver_options.add_argument('--disable-gpu')
    webdriver_options.add_argument('--disable-dev-shm-usage')
    webdriver_options.experimental_options['prefs'] = webdriver_prefs

    webdriver_prefs['profile.default_content_settings'] = {'images': 2}

    # 使用指定的chromedriver
    if settings.CHROMIUM_DRIVER_PATH is not None:
        from selenium.webdriver.chrome.service import Service
        # 创建 Service 对象
        service = Service(executable_path=settings.CHROMIUM_DRIVER_PATH)
        driver = webdriver.Chrome(service=service, options=webdriver_options)
    # 使用默认的chromedriver
    else:
        driver = webdriver.Chrome(options=webdriver_options)

    driver.get(path)

    # driver.get 返回时页面已加载完成，正文也已由 marked 渲染出来，此处只需等待图片加载
    __wait_content_images(driver, timeout)

    calculated_print_options = {
        'landscape': False,
        'displayHeaderFooter': False,
        'printBackground': True,
        'preferCSSPageSize': True,
    }
    calculated_print_options.update(print_options)
    result = __send_devtools(driver, "Page.printToPDF", calculated_print_options)
    driver.quit()
    return base64.b64decode(result['data'])

if __name__ == '__main__':
    # print(sys.argv)
    html_path, pdf_path = sys.argv[1],sys.argv[2]
    convert(html_path,pdf_path)
    # html2pdf(html_path=html_path,pdf_path=pdf_path)
