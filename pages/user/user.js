// pages/user.js
const { cnodeApi } = getApp();
const { formtTopicData, fromNowTime, formatTime } = require('../../utils/util');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user: {},
        collectTopic: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({
            title: '努力加载中...',
        });
        const res = Promise.all([
            cnodeApi.getUserInfo(options.loginname),
            cnodeApi.getUserCollectTopic(options.loginname)
        ]);

        res.then(data => {
            const user = data[0], userCollectTopic = data[1];

            wx.hideLoading();
            if (user.success && userCollectTopic.success) {
                const recent_topics = user.data.recent_topics;
                const recent_replies = user.data.recent_replies;

                user.data.create_at = formatTime(user.data.create_at, '-');
                for (const key in recent_topics) {
                    recent_topics[key].last_reply_at = fromNowTime(recent_topics[key].last_reply_at);
                }
                for (const key in recent_replies) {
                    recent_replies[key].last_reply_at = fromNowTime(recent_replies[key].last_reply_at);
                }

                this.setData({
                    'user': user.data,
                    'collectTopic': userCollectTopic.data
                });

                wx.setNavigationBarTitle({ title: `@ ${user.data.loginname} 的个人主页`});
            }
        }).catch(err => {
            wx.hideLoading();
            wx.showToast({
                title: err || '错误',
                icon: 'none',
                image: 'http://p86t9neoe.bkt.clouddn.com/error.svg',
                duration: 2000
            });
        });
    },
    
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})