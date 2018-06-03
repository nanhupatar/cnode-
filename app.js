//app.js
const CNodeApi = require("/utils/CNodeApi");

App({
    cnodeApi: new CNodeApi(),
    onLaunch: function () {
        wx.showLoading({
            title: '拼命加载中...',
        });
    },
    globalData: {
        userInfo: null,
        
        cnode: {
            api: "https://cnodejs.org/api/v1",
            tab: {
                ask: '问答',
                share: '分享',
                job: '招聘',
                good: '精华',
                index: '首页'
            }
        }
    }
})