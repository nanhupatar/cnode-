// pages/content/component/topic-header/topic-header.js
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
        topic: {
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
         * 点击收藏
        */
        _tapCollect() {
            cnodeApi.collectTopic(this.data.topic.id).then(res => {
                if (res.data.success) {
                    this.setData({ 'topic.is_collect': true });
                }
            }).catch(err => {
                console.error(err);
                if(err) showErrorToast(err);
            });

        },
        /**
         * 点击取消收藏
        */
        _tapDeCollect() {
            cnodeApi.deCollectTopic(this.data.topic.id).then(res => {
                if (res.data.success) {
                    this.setData({ 'topic.is_collect': false });
                }
            }).catch(err => {
                console.error(err);
                if (err) showErrorToast(err);
            });
        },
    }
})
