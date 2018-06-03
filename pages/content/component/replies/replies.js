// pages/content/component/replies/replies.js
const {
    globalData,
    cnodeApi
        } = getApp();
const { showSuccessToast, showErrorToast } = require('../../../../utils/util');

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        'topicData': {
            type: 'object',
            value: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 评论点赞
        */
        _tapReplyUps(e) {
            const index = e.currentTarget.dataset.repliitemidx;
            const item = `topicData.replies[${index}]`;
            let ups = this.data.topicData.replies[index].ups;

            cnodeApi.replyUps(e.currentTarget.dataset.id).then(res => {
                if (res.data.success) {
                    let isAction = res.data.action === 'up';

                    this.setData({
                        [`${item}.is_uped`]: isAction ? true : false,
                        [`${item}.ups`]: isAction ? ++ups : --ups
                    });
                }else{
                    wx.showToast({
                        title: res.data.error_msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }).catch(err => {
                console.error(err);
                if (err) showErrorToast(err);
            });
        }
    }
})
