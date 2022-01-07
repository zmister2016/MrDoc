# coding:utf-8
# @文件: report_html2pdf.py
# @创建者：州的先生
# #日期：2020/12/27
# 博客地址：zmister.com

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.expected_conditions import staleness_of
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.utils import ChromeType
from django.conf import settings
from django.utils.translation import gettext_lazy as _
import sys
import json
import base64


def convert(source: str, target: str, timeout: int = 2, compress: bool = False, power: int = 0, install_driver: bool = True):
    '''
    Convert a given html file or website into PDF

    :param str source: source html file or website link
    :param str target: target location to save the PDF
    :param int timeout: timeout in seconds. Default value is set to 2 seconds
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
    url = driver.command_executor._url + resource
    body = json.dumps({'cmd': cmd, 'params': params})
    response = driver.command_executor._request('POST', url, body)

    if not response:
        raise Exception(response.get('value'))

    return response.get('value')


def __get_pdf_from_html(path: str, timeout: int, install_driver: bool, print_options={}):
    webdriver_options = Options()
    webdriver_prefs = {}
    driver = None

    webdriver_options.add_argument('--no-sandbox')
    webdriver_options.add_argument('--headless')
    webdriver_options.add_argument('--disable-gpu')
    webdriver_options.add_argument("--remote-debugging-port=9222")
    webdriver_options.add_argument('--disable-dev-shm-usage')
    webdriver_options.experimental_options['prefs'] = webdriver_prefs

    webdriver_prefs['profile.default_content_settings'] = {'images': 2}

    # 使用指定的chromedriver
    if settings.CHROMIUM_DRIVER_PATH is not None:
        driver = webdriver.Chrome(executable_path=settings.CHROMIUM_DRIVER_PATH,options=webdriver_options)
    # 使用默认的chromedriver
    else:
        driver = webdriver.Chrome(options=webdriver_options)

    driver.get(path)

    try:
       WebDriverWait(driver, timeout).until(staleness_of(driver.find_element_by_tag_name('html')))
    except TimeoutException:
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
