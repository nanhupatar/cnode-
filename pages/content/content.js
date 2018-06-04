// pages/content.js
const {
        globalData,
    towxml,
    cnodeApi
        } = getApp();
const { formtTopicData, fromNowTime, touchmoveDirectionCount } = require('../../utils/util');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        topic: {},
        topicCon: [],
        replyId: '',
        popupState: false,
        isOpenlogin: false,
        replyBtnState: true,
        gotopState:false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        cnodeApi.getTopicCon(options.id || "5ae6816aadea947348e75f41").then(res => {
            const { data } = res;

            if (data.success) {
                // 调用将 html或（Markdown） 转为微信小程序WXM
                const topicCon = this.towxmlHtml(data.data.content);
                for (const index in data.data.replies) {
                    const replie = data.data.replies[index];

                    replie.ups = replie.ups.length;
                    replie.content = this.towxmlHtml(replie.content);
                    replie.create_at = fromNowTime(replie.create_at);
                }

                wx.hideLoading();

                this.setData({
                    'topic': formtTopicData(data.data),
                    'topicCon': topicCon
                });
            }
        }).catch(err => {
            console.error(err)
        });
    },
    /**
     * 转为微信小程序WXM
    */
    towxmlHtml(htmlStr) {
        return towxml.toJson(htmlStr, 'html');
    },
    /**
     * 关闭 评论窗口
     */
    closePopup() {
        this.setData({ 'popupState': false });
    },
    /**
     * 点击 主要回复按钮
     */
    tapReply() {
        if (this.checkLogin(true, this.checkLoginCallback)) {
            this.setData({ 'popupState': true, 'loginname': '' });
        };
    },
    /**
     * 监听 提交回复成功
     */
    onRepliesSuccess(e) {
        const user = wx.getStorageSync('userInfo');
        if (user === '') return;
        this.setData({
            [`topic.replies[${this.data.topic.replies.length}]`]: {
                id: '',
                author: {
                    loginname: user.loginname,
                    avatar_url: user.avatar_url
                },
                content: this.towxmlHtml(e.detail.content),
                ups: 0,
                create_at: '几秒',
                reply_id: e.detail.reply_id,
                is_uped: false
            }
        });
        this.closePopup();
    },
    /**
     * 监听点击 回复评论按钮
     */
    onTapReply(e) {
        if (this.checkLogin(true, this.checkLoginCallback)) {
            this.setData(Object.assign(e.detail, { 'popupState': true }));
        };
    },
    /**
     * 监听当前滑动手势
     */
    onCurrentGesture(e) {
        if (e.detail.ty === 'up') {
            this.setData({ 'gotopState': false });
        } else if (e.detail.ty === 'down') {
            this.setData({ 'gotopState': true });
        }
    },
    checkLoginCallback(res){
        if (res.confirm) {
            this.setData({'loginState': true});
        };
    },
    checkLogin: cnodeApi.checkLogin
})