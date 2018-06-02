const moment = require('moment');
const { globalData } = getApp();

/**
 * 获取 至今时间
 * @param {Date} date 日期 
 */
const fromNowTime = date => {
    return moment(date).fromNow(true);
}

/**
 * 文本截取补 省略号
 * @param {String} txt 文本
 * @param {Number} len 截取长度
 */
const textEllipsis = (txt, len) => {
    if (typeof txt !== 'string') return;
    let str = filterHtml(txt).substring(0, len);
    if (str.length >= len) str += '...';
    return str;
}

/**
 * 去除字符串 Html 
 * @param {String} str HTML
 */
const filterHtml = str => {
    str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag
    str = str.replace(/[ | ]*\n/g, ''); //去除行尾空白
    str = str.replace(/\n[\s| | ]*\r/g, ''); //去除多余空行
    return str;
}

/**
 * 主题 tab 转中文
 * @param {String} str CNode主题 tab
 */
const topicsTab = str => {
    const tab = globalData.cnode.tab;
    for (const key in tab) {
        if (key === str) {
            return tab[key];
        }
    };
}

/**
 * 格式化时间
 * @param {String} time 时间  
 * @param {String} j 分隔符
 */
const formatTime = (time, j) => {
    const date = new Date(time);
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join(j || '/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
/**
 * 补 0
 * @param {Number} n 
 */
const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

/**
 * 格式化主题列表数据 
 * @param {object || Array} param 主题数据
 */
const formtTopicData = param => {
    if (Object.prototype.toString.call(param) === "[object Array]") {
        if (!param.length) return;
        param.forEach(item => {
            item.last_reply_at = fromNowTime(item.last_reply_at); // 至今时间
            item.create_at = formatTime(item.create_at, '-'); // 创建时间
            item.tab = topicsTab(item.tab); // 主题分类
            item.abs = textEllipsis(item.content, 120); // 提取内容摘要
            item.title = textEllipsis(item.title, 44); // 标题文本省略
        });
    } else {
        param.last_reply_at = fromNowTime(param.last_reply_at); // 至今时间
        param.create_at = formatTime(param.create_at, '-'); // 创建时间
        param.create_at_now = fromNowTime(param.create_at, '-'); // 创建至今时间
        param.tab = topicsTab(param.tab); // 主题分类
    };
    return param;
};

/**
 * 显示成功弹窗
 * @param {String} title 标题
 */
const showSuccessToast = title => {
    wx.showToast({
        title: title || '成功',
        icon: 'none',
        image: '/static/images/success.svg',
        duration: 2000
    });
}

/**
 * 显示错误弹窗
 * @param {String} title 标题
 */
const showErrorToast = title => {
    wx.showToast({
        title: title || '错误',
        icon: 'none',
        image: '/static/images/error.svg',
        duration: 2000
    });
}

module.exports = {
    formatTime: formatTime,
    fromNowTime,
    topicsTab,
    textEllipsis,
    formtTopicData,
    showSuccessToast,
    showErrorToast
}
