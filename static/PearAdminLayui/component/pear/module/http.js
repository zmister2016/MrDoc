layui.define(['jquery', 'layer'], function (exports) {
    "use strict";

    var $ = layui.jquery;
    var layer = layui.layer;

    var http = {};
    http.ajax = function (userOptions) {
        userOptions = userOptions || {};

        var options = $.extend(true, {}, http.ajax.defaultOpts, userOptions);
        var oldBeforeSendOption = options.beforeSend;
        options.beforeSend = function (xhr) {
            if (oldBeforeSendOption) {
                oldBeforeSendOption(xhr);
            }

            xhr.setRequestHeader("Pragma", "no-cache");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Expires", "Sat, 01 Jan 2000 00:00:00 GMT");
        };

        options.success = undefined;
        options.error = undefined;

        return $.Deferred(function ($dfd) {
            $.ajax(options)
                .done(function (data, textStatus, jqXHR) {
                    $dfd.resolve(data);
                    userOptions.success && userOptions.success(data);
                })
                .fail(function (jqXHR) {
                    http.ajax.handleErrorResponse(jqXHR, userOptions, $dfd);
                });
        });
    }

    $.extend(http.ajax, {
        defaultOpts: {
            dataType: 'json',
            type: 'POST',
            contentType: 'application/json',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        },

        defaultError: {
            message: 'An error has occurred!',
            details: 'Error detail not sent by server.'
        },

        defaultError401: {
            message: 'You are not authenticated!',
            details: 'You should be authenticated (sign in) in order to perform this operation.'
        },

        defaultError403: {
            message: 'You are not authorized!',
            details: 'You are not allowed to perform this operation.'
        },

        defaultError404: {
            message: 'Resource not found!',
            details: 'The resource requested could not found on the server.'
        },

        logError: function (error) {
            console.log(error);
        },

        showError: function (error) {
            if (error.details) {
                return layer.alert(error.details, {
                    title: error.message,
                    icon: 2,
                    closeBtn: 0
                });
            } else {
                return layer.alert(http.ajax.defaultError.details, {
                    title: error.message || http.ajax.defaultError.message,
                    icon: 2,
                    closeBtn: 0
                });
            }
        },

        showErrorAndRedirectUrl: function (error, targetUrl) {
            if (error.details) {
                return layer.alert(error.details, {
                    title: error.message,
                    icon: 2,
                    closeBtn: 0,
                    end: http.ajax.handleTargetUrl(targetUrl)
                });
            } else {
                return layer.alert(http.ajax.defaultError.details, {
                    title: error.message || http.ajax.defaultError.message,
                    icon: 2,
                    closeBtn: 0,
                    end: http.ajax.handleTargetUrl(targetUrl)
                });
            }
        },

        handleTargetUrl: function (targetUrl) {
            if (!targetUrl) {
                location.href = http.appPath;
            } else {
                location.href = targetUrl;
            }
        },

        handleErrorResponse: function (jqXHR, userOptions, $dfd) {
            if (userOptions.customHandleError !== false) {
                switch (jqXHR.status) {
                    case 401:
                        http.ajax.showErrorAndRedirectUrl(http.ajax.defaultError401, http.appPath);
                        break;
                    case 403:
                        http.ajax.showError(http.ajax.defaultError403);
                        break;
                    case 404:
                        http.ajax.showError(http.ajax.defaultError404);
                        break;
                    default:
                        http.ajax.showError(http.ajax.defaultError);
                        break;
                }
            }

            $dfd.reject.apply(this, arguments);
            userOptions.error && userOptions.error.apply(this, arguments);
        },

        ajaxSendHandler: function (event, request, settings) {
            var token = http.ajax.getToken();
            if (!token) {
                return;
            }

            if (!settings.headers || settings.headers[http.ajax.tokenHeaderName] === undefined) {
                request.setRequestHeader(http.ajax.tokenHeaderName, token);
            }
        },

        getToken: function () {
            return http.ajax.getCookieValue(http.ajax.tokenCookieName);
        },

        tokenCookieName: 'XSRF-TOKEN',
        tokenHeaderName: 'X-XSRF-TOKEN',

        getCookieValue: function (key) {
            var equalities = document.cookie.split('; ');
            for (var i = 0; i < equalities.length; i++) {
                if (!equalities[i]) {
                    continue;
                }

                var splitted = equalities[i].split('=');
                if (splitted.length != 2) {
                    continue;
                }

                if (decodeURIComponent(splitted[0]) === key) {
                    return decodeURIComponent(splitted[1] || '');
                }
            }

            return null;
        }
    });

    $(document).ajaxSend(function (event, request, settings) {
        return http.ajax.ajaxSendHandler(event, request, settings);
    });

    exports('http', http);
});