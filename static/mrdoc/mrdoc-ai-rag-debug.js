/**
 * RAG 调试器 v2 - 增强详情与文档跳转
 * 依赖：layui (内含 layer、jquery)
 * 数据格式：[{ score: 0.98, section: { doc_id, doc_title, section_title, title_path, content, embedding_text, summary, keywords, tags, faqs, ... } }]
 * 使用：<button onclick="openRagDebug()">打开调试器</button>
 */

const DEFAULT_RAG_DEBUG_API = '/ai/rag-search-debug/';

(function () {
  if (typeof layui === 'undefined') {
    console.error('RAG调试器：请先引入 layui');
    return;
  }

  layui.use(['layer', 'jquery'], function () {
    var layer = layui.layer;
    var $ = layui.jquery;

    // ---------- 工具函数 ----------
    function highlightText(text, keyword) {
      if (!keyword || !text) return text || '';
      var escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var regex = new RegExp('(' + escaped + ')', 'gi');
      return text.replace(regex, '<mark style="background:#fff3cd;padding:0 2px;border-radius:2px;">$1</mark>');
    }

    function escapeHtml(text) {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // 从 section 中尝试提取 doc_id
    function getDocId(section) {
      return section.doc_id || (section.doc && (typeof section.doc === 'number' ? section.doc : section.doc.id)) || null;
    }

    // 展示本次检索实际生效的过滤范围
    function formatScope(scope) {
      if (!scope) return '全部（未过滤）';
      var parts = [];
      if (scope.project_ids && scope.project_ids.length) parts.push('文集 ' + scope.project_ids.join(','));
      if (scope.doc_ids && scope.doc_ids.length) parts.push('文档 ' + scope.doc_ids.join(','));
      return parts.length ? parts.join(' + ') : '全部（未过滤）';
    }

    // 格式化 JSON 数组为标签串
    function formatTags(arr) {
      if (!arr || !Array.isArray(arr) || arr.length === 0) return '';
      return arr.map(function (item) {
        return '<span style="display:inline-block;background:#e8f4fd;color:#1e9fff;padding:2px 8px;border-radius:4px;margin:2px;font-size:12px;">' + escapeHtml(item) + '</span>';
      }).join('');
    }

    // 格式化 FAQs
    function formatFaqs(faqs) {
      if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return '';
      return faqs.map(function (faq, idx) {
        return '<div style="margin-bottom:8px;"><strong>Q' + (idx + 1) + ':</strong> ' + escapeHtml(faq.q || faq) + '<br><strong>A:</strong> ' + escapeHtml(faq.a || '') + '</div>';
      }).join('');
    }

    // ---------- 弹窗 HTML ----------
    function buildDialogHTML() {
      return `
      <div class="rag-debugger" style="padding:20px;background:#f4f5f7;min-height:400px;">
        <style>
          .rag-debugger .layui-form { margin-bottom: 20px; }
          .rag-input-inline { display: flex; gap: 10px; align-items: flex-end; flex-wrap: wrap; }
          .rag-input-inline .layui-input-block { margin-left:0!important; flex:1; min-width:140px; }
          .rag-input-inline .layui-btn { height:38px; line-height:38px; }
          .result-card {
            background:#fff; border-radius:8px; padding:18px 20px; margin-bottom:16px;
            box-shadow:0 1px 4px rgba(0,0,0,0.04); transition:box-shadow 0.2s;
            border:1px solid #eef0f2; cursor:pointer;
          }
          .result-card:hover { box-shadow:0 4px 12px rgba(0,0,0,0.06); }
          .result-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
          .result-title { font-size:15px; font-weight:600; line-height:1.5; word-break:break-word; }
          .result-title a { color:#1e9fff; text-decoration:none; }
          .result-title a:hover { text-decoration:underline; }
          .score-badge {
            background:#5fb878; color:#fff; padding:2px 10px; border-radius:12px;
            font-size:12px; font-weight:500; white-space:nowrap; margin-left:12px;
          }
          .result-badges { display:flex; align-items:center; gap:6px; flex-shrink:0; }
          .score-badge.rerank-badge { background:#1e9fff; }
          .channel-line { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
          .channel-badge {
            font-size:11px; padding:1px 8px; border-radius:10px;
            background:#eef0f2; color:#888; white-space:nowrap;
          }
          .channel-badge.hit-vector { background:#e8f4fd; color:#1e9fff; }
          .channel-badge.hit-bm25 { background:#eaf7ee; color:#5fb878; }
          .channel-badge.miss { background:#fdecec; color:#ff5722; }
          .breadcrumb { font-size:12px; color:#888; margin-bottom:6px; display:flex; align-items:center; gap:4px; }
          .content-preview { font-size:13px; color:#555; line-height:1.7; margin-bottom:8px; }
          .detail-toggle { color:#1e9fff; font-size:12px; cursor:pointer; user-select:none; display:inline-flex; align-items:center; gap:4px; }
          .detail-toggle:hover { text-decoration:underline; }
          .detail-panel {
            margin-top:14px; padding:16px; background:#f9fafb; border-radius:6px;
            display:none; animation: ragFadeIn 0.2s ease;
          }
          .detail-panel.show { display:block; }
          @keyframes ragFadeIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
          .detail-field { margin-bottom:12px; }
          .detail-field-label { font-size:12px; color:#888; margin-bottom:4px; font-weight:500; }
          .detail-field-value { font-size:13px; color:#333; line-height:1.6; word-break:break-word; white-space:pre-wrap; background:#fff; padding:8px 12px; border-radius:4px; border:1px solid #eef0f2; }
          .no-result { text-align:center; color:#999; padding:40px; }
          .loading { text-align:center; padding:30px; }
        </style>

        <div class="layui-form">
          <div class="rag-input-inline">
            <div class="layui-input-block" style="flex:3;">
              <input type="text" name="query" placeholder="输入搜索关键词..." autocomplete="off" class="layui-input" id="ragQueryInput">
            </div>
            <div class="layui-input-block" style="flex:1;min-width:110px;">
              <input type="number" name="doc_id" placeholder="文档ID（可选）" autocomplete="off" class="layui-input">
            </div>
            <div class="layui-input-block" style="flex:1;min-width:110px;">
              <input type="number" name="project_id" placeholder="文集ID（可选）" autocomplete="off" class="layui-input">
            </div>
            <button class="layui-btn layui-btn-normal layui-btn-xs" id="ragSearchBtn">
              <i class="layui-icon layui-icon-search"></i> 检索
            </button>
            <button class="layui-btn layui-btn-normal layui-btn-xs" id="ragSearchRankingBtn">
              <i class="layui-icon layui-icon-search"></i> 检索 + 重排
            </button>
          </div>
        </div>
        <div id="ragResultContainer"></div>
      </div>`;
    }

    // ---------- 渲染结果 ----------
    function renderResults($container, data, query, debug) {
      if (!data || data.length === 0) {
        $container.html('<div class="no-result">无匹配结果</div>');
        return;
      }

      var html = '';

      // 显示耗时与生效的过滤范围
      if (debug) {
        var searchTime = debug.search_time_ms != null ? debug.search_time_ms : '-';
        var rerankTime = debug.rerank_time_ms != null ? debug.rerank_time_ms : '-';
        var totalTime = debug.total_time_ms != null ? debug.total_time_ms : '-';

        html += '<div class="debug-info" style="background:#fff3cd;padding:10px 15px;border-radius:6px;margin-bottom:16px;font-size:13px;">';
        html += '<span style="margin-right:20px;"><i class="layui-icon layui-icon-time" style="color:#ff9800;"></i> 检索耗时：<strong>' + searchTime + ' ms</strong></span>';
        if (rerankTime !== '-') {
          html += '<span style="margin-right:20px;"><i class="layui-icon layui-icon-refresh" style="color:#1e9fff;"></i> 重排耗时：<strong>' + rerankTime + ' ms</strong></span>';
        }
        html += '<span style="margin-right:20px;"><i class="layui-icon layui-icon-ok-circle" style="color:#5fb878;"></i> 总耗时：<strong>' + totalTime + ' ms</strong></span>';
        html += '<span><i class="layui-icon layui-icon-set" style="color:#888;"></i> 过滤范围：<strong>' + formatScope(debug.scope) + '</strong></span>';
        html += '</div>';
      }

      $.each(data, function (i, item) {
        var section = item.section || item;

        // 分路召回明细：RRF 融合分 + 向量/BM25 各自的排名与原始分
        var rrfScore = item.score != null ? parseFloat(item.score).toFixed(4) : '-';
        var vectorRank = item.vector_rank != null ? item.vector_rank : null;
        var bm25Rank = item.bm25_rank != null ? item.bm25_rank : null;
        var vectorScore = item.vector_score != null ? parseFloat(item.vector_score).toFixed(4) : '-';
        var bm25Score = item.bm25_score != null ? parseFloat(item.bm25_score).toFixed(4) : '-';
        var rerankScore = item.rerank_score != null ? parseFloat(item.rerank_score).toFixed(4) : null;
        var finalScore = item.final_score != null ? parseFloat(item.final_score).toFixed(4) : null;

        var docId = getDocId(section);
        var docTitle = section.doc_title || '';
        var sectionTitle = section.section_title || '';
        var titlePath = section.title_path || '';
        var content = section.content || '';
        var embeddingText = section.embedding_text || '';
        var summary = section.summary || '';
        var keywords = section.keywords || [];
        var tags = section.tags || [];
        var faqs = section.faqs || [];
        var sourceType = section.source_type || '';
        var order = section.order != null ? section.order : '';
        var llmStatus = section.llm_status || '';
        var embeddingStatus = section.embedding_status || '';

        // 高亮处理
        var hlDocTitle = highlightText(docTitle, query);
        var hlSectionTitle = highlightText(sectionTitle, query);
        var hlContent = highlightText(content, query);
        var shortContent = content.length > 300 ? content.substring(0, 300) + '...' : content;
        var hlShortContent = highlightText(shortContent, query);

        // 文档链接
        var docLinkHtml = docId
          ? '<a href="/doc/' + docId + '/" target="_blank">' + hlDocTitle + '</a>'
          : hlDocTitle;

        html += '<div class="result-card" data-index="' + i + '">';
        // 标题行
        html += '<div class="result-header">';
        html += '<div class="result-title">' + docLinkHtml + (hlSectionTitle ? ' / ' + hlSectionTitle : '') + '</div>';
        html += '<div class="result-badges">';
        html += '<span class="score-badge">融合 ' + rrfScore + '</span>';
        if (rerankScore !== null) {
          html += '<span class="score-badge rerank-badge">重排 ' + rerankScore + '</span>';
        }
        html += '</div>';
        html += '</div>';

        // 分路命中情况：一眼看出是向量语义命中还是关键词命中
        html += '<div class="channel-line">';
        html += vectorRank !== null
          ? '<span class="channel-badge hit-vector">向量 #' + vectorRank + ' · 相似度 ' + vectorScore + '</span>'
          : '<span class="channel-badge miss">向量 未命中</span>';
        html += bm25Rank !== null
          ? '<span class="channel-badge hit-bm25">BM25 #' + bm25Rank + ' · 得分 ' + bm25Score + '</span>'
          : '<span class="channel-badge miss">BM25 未命中</span>';
        html += '</div>';

        // 面包屑
        if (titlePath) {
          html += '<div class="breadcrumb">📍 ' + highlightText(titlePath, query) + '</div>';
        }

        // 内容预览
        html += '<div class="content-preview">' + hlShortContent + '</div>';

        // 展开详情按钮
        html += '<span class="detail-toggle"><i class="layui-icon layui-icon-down"></i> 查看详情</span>';

        // 详情面板（默认隐藏）
        html += '<div class="detail-panel">';

        // 完整内容
        html += '<div class="detail-field"><div class="detail-field-label">📄 完整内容</div><div class="detail-field-value">' + hlContent + '</div></div>';

        // 向量化文本
        if (embeddingText) {
          html += '<div class="detail-field"><div class="detail-field-label">🔢 向量化文本</div><div class="detail-field-value">' + highlightText(embeddingText, query) + '</div></div>';
        }

        // 摘要
        if (summary) {
          html += '<div class="detail-field"><div class="detail-field-label">📝 LLM 摘要</div><div class="detail-field-value">' + escapeHtml(summary) + '</div></div>';
        }

        // 关键词
        if (keywords.length > 0) {
          html += '<div class="detail-field"><div class="detail-field-label">🏷️ 关键词</div><div class="detail-field-value">' + formatTags(keywords) + '</div></div>';
        }

        // 标签
        if (tags.length > 0) {
          html += '<div class="detail-field"><div class="detail-field-label">📌 标签</div><div class="detail-field-value">' + formatTags(tags) + '</div></div>';
        }

        // FAQ
        if (faqs.length > 0) {
          html += '<div class="detail-field"><div class="detail-field-label">❓ FAQ</div><div class="detail-field-value">' + formatFaqs(faqs) + '</div></div>';
        }

        // 召回得分明细
        html += '<div class="detail-field"><div class="detail-field-label">🎯 召回得分明细</div><div class="detail-field-value">';
        html += '向量召回：' + (vectorRank !== null
          ? '排名 #' + vectorRank + '，余弦相似度 ' + vectorScore
          : '未命中（该切片不在向量路 top 结果中）') + '<br>';
        html += 'BM25 召回：' + (bm25Rank !== null
          ? '排名 #' + bm25Rank + '，BM25 得分 ' + bm25Score
          : '未命中（该切片不在关键词路 top 结果中）') + '<br>';
        html += 'RRF 融合分：' + rrfScore + '（向量权重 0.6 / BM25 权重 0.4）';
        if (rerankScore !== null) {
          html += '<br>重排得分：' + rerankScore + '，融合后最终分：' + finalScore;
        }
        html += '</div></div>';

        // 其他元数据
        html += '<div class="detail-field"><div class="detail-field-label">ℹ️ 元信息</div><div class="detail-field-value">';
        if (sourceType) html += '来源类型：' + escapeHtml(sourceType) + '<br>';
        if (order !== '') html += '排序：' + order + '<br>';
        if (llmStatus) html += 'LLM 状态：' + escapeHtml(llmStatus) + '<br>';
        if (embeddingStatus) html += '向量状态：' + escapeHtml(embeddingStatus);
        html += '</div></div>';

        html += '</div>'; // end detail-panel
        html += '</div>'; // end result-card
      });

      $container.html(html);

      // 绑定卡片点击展开/收起详情（点击“查看详情”文字或卡片头部均可）
      $container.off('click', '.detail-toggle').on('click', '.detail-toggle', function (e) {
        e.stopPropagation();
        var $card = $(this).closest('.result-card');
        var $panel = $card.find('.detail-panel');
        var $btn = $(this);
        if ($panel.hasClass('show')) {
          $panel.removeClass('show');
          $btn.html('<i class="layui-icon layui-icon-down"></i> 查看详情');
        } else {
          $panel.addClass('show');
          $btn.html('<i class="layui-icon layui-icon-up"></i> 收起详情');
        }
      });

      // 点击卡片其他区域也可切换详情（专业交互）
      $container.off('click', '.result-card').on('click', '.result-card', function (e) {
        // 如果点击的是链接或按钮则不触发
        if ($(e.target).closest('a, .detail-toggle').length) return;
        $(this).find('.detail-toggle').click();
      });
    }

    // ---------- 主入口 ----------
    window.openRagDebug = function (options) {
      options = options || {};
      var apiUrl = options.apiUrl || DEFAULT_RAG_DEBUG_API;

      layer.open({
        type: 1,
        title: '🔍 RAG 调试器',
        area: ['940px', '700px'],
        shadeClose: true,
        content: buildDialogHTML(),
        success: function (layero) {
          var $layer = layero;
          var $container = $layer.find('#ragResultContainer');

          $layer.find('#ragSearchBtn').on('click', function () {
            var queryVal = $layer.find('input[name="query"]').val().trim();
            var docId = $layer.find('input[name="doc_id"]').val().trim();
            var projectId = $layer.find('input[name="project_id"]').val().trim();

            if (!queryVal) {
              layer.msg('请输入查询关键词', { icon: 0, time: 1500 });
              return;
            }

            var payload = { query: queryVal };
            if (docId) payload.doc_id = docId;
            if (projectId) payload.project_id = projectId;

            $container.html('<div class="loading"><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i> 搜索中...</div>');

            $.ajax({
              url: apiUrl,
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(payload),
              dataType: 'json',
              success: function (res) {
                if (res && res.status && res.data) {
                  renderResults($container, res.data, queryVal, res.debug);
                } else {
                  $container.html('<div class="no-result">接口返回异常</div>');
                }
              },
              error: function () {
                $container.html('<div class="no-result">请求失败，请检查接口或稍后重试</div>');
                layer.msg('搜索请求失败', { icon: 2, time: 2000 });
              }
            });
          });

          $layer.find('#ragSearchRankingBtn').on('click', function () {
            var queryVal = $layer.find('input[name="query"]').val().trim();
            var docId = $layer.find('input[name="doc_id"]').val().trim();
            var projectId = $layer.find('input[name="project_id"]').val().trim();

            if (!queryVal) {
              layer.msg('请输入查询关键词', { icon: 0, time: 1500 });
              return;
            }

            var payload = { query: queryVal, rerank: true };
            if (docId) payload.doc_id = docId;
            if (projectId) payload.project_id = projectId;

            $container.html('<div class="loading"><i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i> 检索+重排中...</div>');

            $.ajax({
              url: apiUrl,
              type: 'POST',
              contentType: 'application/json',
              data: JSON.stringify(payload),
              dataType: 'json',
              success: function (res) {
                if (res && res.status && res.data) {
                  renderResults($container, res.data, queryVal, res.debug);
                } else {
                  $container.html('<div class="no-result">接口返回异常</div>');
                }
              },
              error: function () {
                $container.html('<div class="no-result">请求失败，请检查接口或稍后重试</div>');
                layer.msg('搜索请求失败', { icon: 2, time: 2000 });
              }
            });
          });

          $layer.find('#ragQueryInput').on('keypress', function (e) {
            if (e.which === 13) $('#ragSearchBtn').click();
          });
        }
      });
    };

    // console.log('✅ RAG调试器 v2 已就绪 (文档跳转+详情展开)');
  });
})();
