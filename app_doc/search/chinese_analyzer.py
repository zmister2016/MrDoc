# coding:utf-8
# @文件: chinese_analyzer.py
# @创建者：州的先生
# #日期：2020/11/22
# 博客地址：zmister.com

from whoosh.compat import u, text_type
from whoosh.analysis.filters import LowercaseFilter
from whoosh.analysis.filters import StopFilter, STOP_WORDS
from whoosh.analysis.morph import StemFilter
from whoosh.analysis.tokenizers import default_pattern
from whoosh.lang.porter import stem
from whoosh.analysis import Tokenizer, Token
from whoosh.util.text import rcompile
import jieba


class ChineseTokenizer(Tokenizer):
    """
    使用正则表达式从文本中提取 token 令牌。
    >>> rex = ChineseTokenizer()
    >>> [token.text for token in rex(u("hi there 3.141 big-time under_score"))]
    ["hi", "there", "3.141", "big", "time", "under_score"]
    """
    def __init__(self, expression=default_pattern, gaps=False):
        """
        :param expression: 一个正则表达式对象或字符串，默认为 rcompile(r"\w+(\.?\w+)*")。
            表达式的每一个匹配都等于一个 token 令牌。
            第0组匹配（整个匹配文本）用作 token 令牌的文本。
            如果你需要更复杂的正则表达式匹配处理，只需要编写自己的 tokenizer 令牌解析器即可。
        :param gaps: 如果为 True, tokenizer 令牌解析器会在正则表达式上进行分割，而非匹配。
        """
        self.expression = rcompile(expression)
        self.gaps = gaps

    def __eq__(self, other):
        if self.__class__ is other.__class__:
            if self.expression.pattern == other.expression.pattern:
                return True
        return False

    def __call__(self, value, positions=False, chars=False, keeporiginal=False,
                 removestops=True, start_pos=0, start_char=0, tokenize=True,
                 mode='', **kwargs):
        """
        :param value: 进行令牌解析的 Unicode 字符串。
        :param positions: 是否在 token 令牌中记录 token 令牌位置。
        :param chars: 是否在 token 中记录字符偏移。
        :param start_pos: 第一个 token 的位置。例如，
            如果设置 start_pos=2, 那么 token 的位置将是 2,3,4,...而非 0,1,2,...
        :param start_char: 第一个 token 中第一个字符的偏移量。
            例如, 如果设置 start_char=2, 那么文本 "aaa bbb" 解析的两个字符串位置将体现为 (2,5),(6,9) 而非 (0,3),(4,7).
        :param tokenize: 如果为 True, 文本应该被令牌解析。
        """
        # 判断传入的文本是否为字符串，如果不为字符串则抛出
        assert isinstance(value, text_type), "%s is not unicode" % repr(value)
        t = Token(positions, chars, removestops=removestops, mode=mode,
                  **kwargs)
        if not tokenize:
            t.original = t.text = value
            t.boost = 1.0
            if positions:
                t.pos = start_pos
            if chars:
                t.startchar = start_char
                t.endchar = start_char + len(value)
            yield t
        elif not self.gaps:
            # The default: expression matches are used as tokens
            # 默认情况下，正则表达式的匹配用作 token 令牌
            # for pos, match in enumerate(self.expression.finditer(value)):
            #     t.text = match.group(0)
            #     t.boost = 1.0
            #     if keeporiginal:
            #         t.original = t.text
            #     t.stopped = False
            #     if positions:
            #         t.pos = start_pos + pos
            #     if chars:
            #         t.startchar = start_char + match.start()
            #         t.endchar = start_char + match.end()
            #     yield t
            seglist = jieba.cut(value, cut_all=True)
            for w in seglist:
                t.original = t.text = w
                t.boost = 1.0
                if positions:
                    t.pos = start_pos + value.find(w)
                if chars:
                    t.startchar = start_char + value.find(w)
                    t.endchar = start_char + value.find(w) + len(w)
                yield t
        else:
            # When gaps=True, iterate through the matches and
            # yield the text between them.
            # 当 gaps=True, 遍历匹配项并在它们之间生成文本。
            prevend = 0
            pos = start_pos
            for match in self.expression.finditer(value):
                start = prevend
                end = match.start()
                text = value[start:end]
                if text:
                    t.text = text
                    t.boost = 1.0
                    if keeporiginal:
                        t.original = t.text
                    t.stopped = False
                    if positions:
                        t.pos = pos
                        pos += 1
                    if chars:
                        t.startchar = start_char + start
                        t.endchar = start_char + end
                    yield t
                prevend = match.end()
            # If the last "gap" was before the end of the text,
            # yield the last bit of text as a final token.
            if prevend < len(value):
                t.text = value[prevend:]
                t.boost = 1.0
                if keeporiginal:
                    t.original = t.text
                t.stopped = False
                if positions:
                    t.pos = pos
                if chars:
                    t.startchar = prevend
                    t.endchar = len(value)
                yield t


def ChineseAnalyzer(expression=default_pattern, stoplist=None,
                     minsize=2, maxsize=None, gaps=False, stemfn=stem,
                     ignore=None, cachesize=50000):
    """Composes a RegexTokenizer with a lower case filter, an optional stop
    filter, and a stemming filter.
    用小写过滤器、可选的停止停用词过滤器和词干过滤器组成生成器。
    >>> ana = ChineseAnalyzer()
    >>> [token.text for token in ana("Testing is testing and testing")]
    ["test", "test", "test"]
    :param expression: 用于提取 token 令牌的正则表达式
    :param stoplist: 一个停用词列表。 设置为 None 标识禁用停用词过滤功能。
    :param minsize: 单词最小长度，小于它的单词将被从流中删除。
    :param maxsize: 单词最大长度，大于它的单词将被从流中删除。
    :param gaps: 如果为 True, tokenizer 令牌解析器将会分割正则表达式，而非匹配正则表达式
    :param ignore: 一组忽略的单词。
    :param cachesize: 缓存词干词的最大数目。 这个数字越大，词干生成的速度就越快，但占用的内存就越多。
                      使用 None 表示无缓存，使用 -1 表示无限缓存。
    """
    ret = ChineseTokenizer(expression=expression, gaps=gaps)
    chain = ret | LowercaseFilter()
    if stoplist is not None:
        chain = chain | StopFilter(stoplist=stoplist, minsize=minsize,maxsize=maxsize)
    return chain | StemFilter(stemfn=stemfn, ignore=ignore,cachesize=cachesize)