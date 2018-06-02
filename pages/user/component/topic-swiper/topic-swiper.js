// pages/user/component/topic-swiper/topic-swiper.js
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        indicatorArr: ['最近回复', '最新发布', '话题收藏'],
        swiperCurrent: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _tapIndicator(e) {
            this.setData({ 'swiperCurrent': e.target.dataset.index });
        },
        _topicSwipreChange(e) {
            if (e.detail.source === "touch") {
                this.setData({ 'swiperCurrent': e.detail.current });
            }
        },
    }
})
