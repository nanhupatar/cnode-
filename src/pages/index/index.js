const { globalData, cnodeApi } = getApp();
const util = require('../../utils/util');
let title = globalData.cnode.tab['index'];

Page({

    /**
     * 页面的初始数据
     */
    data: {
        topicsList: [],
        page: 1,
        tab: '',
        isScrollY: true,
        isShowTop: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.tab !== undefined) {
            const tab = options.tab === 'index' ? '' : options.tab;
            this.setData({ 'tab': tab })
        };
        cnodeApi.getTopicData({
            page: 0,
            limit: 20,
            tab: this.data.tab||''
        }).then(this.dataResFormt).then(null, err => {
            console.error(err)
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setBarTitle();
    },
    /**
     * 监听当前滑动手势
     */
    onCurrentGesture(e) {
        if (e.detail.ty === 'up') {
            this.setData({ 'isShowTop': false });
        } else if (e.detail.ty === 'down') {
            this.setData({ 'isShowTop': true });
        } 
    },
    /**
     * 设置窗口标题
    */
    setBarTitle(){
        wx.setNavigationBarTitle({
            title: title,
            success(){
                console.log('success')
            },
        })
    },
    /**
     * 获得点击导航的 name
    */
    onNavTap(opi){
        title = globalData.cnode.tab[opi.detail.tab];
    },
    // 处理获取主题数据结果
    dataResFormt(res) {
        return new Promise((resolve, reject) => {
            if (res.data.success) {
                if (this.data.page >= 2) {
                    this.setData({ 'topicsList': this.data.topicsList.concat(util.formtTopicData(res.data.data)) });
                } else {
                    this.setData({ 'topicsList': util.formtTopicData(res.data.data) });
                }
                resolve();
            } else {
                reject();
            }
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.setData({ 'page': 1 });

        cnodeApi.getTopicData({
            page: 1,
            limit: 20,
            tab: this.data.tab || ''
        }).then(this.dataResFormt).then(() => {
            wx.stopPullDownRefresh();
        }).then(null, err => {
            console.error(err)
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let num = ++this.data.page;

        cnodeApi.getTopicData({
            page: num,
            limit: 20,
            tab: this.data.tab || ''
        }).then(this.dataResFormt).then(() => {
            this.setData({ 'page': num });
        }).then(null, err => {
            console.error(err)
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})