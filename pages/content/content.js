// pages/content.js

/*
* 导入wxParse
*/
var WxParse = require('../../wxParse/wxParse.js');

const {
    globa,
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
        isOpenlogin: false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var self=this;
        cnodeApi.getTopicCon(options.id || "5ae6816aadea947348e75f41").then(res => {
            const { data } = res;

            if (data.success) {
                //调用将 html或（Markdown） 转为微信小程序WXM
                for (const index in data.data.replies) {
                    const replie = data.data.replies[index];
                    replie.ups = replie.ups.length;
                    //replie.content = WxParse.wxParse('replie'+1,"md",replie.content,self);
                    replie.create_at = fromNowTime(replie.create_at);
                }
                wx.hideLoading();
                // self.setData({
                //   'topic': formtTopicData(data.data)
                // })
                // var replies = data.data.replies;
                // var replies_len = replies.length;
                // for (let i = 0; i < replies_len; i++) {
                //   WxParse.wxParse('reply' + i, 'html', replies[i], self);
                //   if (i === arr.length - 1) {
                //     WxParse.wxParseTemArray("replyTemArray", 'reply', replies_len, self)
                //   }
                // }
                WxParse.wxParse('topicCon', 'html', res.data.data.content, self, 20);
                self.setData({'topic':data.data});
            }
        }).catch(err => {
            console.error(err)
        });
    },

    /**
     * 监听当前滑动手势
     */
    onCurrentGesture(e) {
        if (e.detail.ty === 'up') {
            this.setData({ 'replyBtnState': false });
        } else if (e.detail.ty === 'down') {
            this.setData({ 'replyBtnState': true });
        }
    },
    checkLoginCallback(res){
        if (res.confirm) {
            this.setData({'loginState': true});
        };
    },
    checkLogin: cnodeApi.checkLogin
})