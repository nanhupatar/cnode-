// components/bar-slider.js
const { globalData,cnodeApi} = getApp();

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        sliderState: { // 侧边导航状态 打开 false 关闭 true
            type: 'boolean',
            value: true,
            observer: '_triggerbindSliderState'
        },
        currentTab: {
            type: 'String',
            value: 'index'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        tips: '',
        sliderAin: {},
        user: {},
        isOpenLogin: false,
        nav: [
            {
                tab: 'index',
                name: '全部',
                icon: 'icon-icon-yxj-all'
            },
            {
                tab: 'good',
                name: '精华',
                icon: 'icon-dianzan'
            },
            {
                tab: 'share',
                name: '分享',
                icon: 'icon-fenxiang'
            },
            {
                tab: 'ask',
                name: '问答',
                icon: 'icon-wenda'
            },
            {
                tab: 'job',
                name: '招聘',
                icon: 'icon-zhaopin-copy-copy'
            },
        ]
    },
    /**
     * 组件的方法列表
     */
    ready(){
        cnodeApi.autoLogin().then((res) => {
            if (res) {
                this.setData({ 'user': res});
                wx.setStorageSync('userInfo', res);
            }
        }, err => console.error(err));

    },
    methods: {
        /**
         * 触发监听 侧边导航状态 事件(回调)。
         */
        _triggerbindSliderState(sliderState){
            this.triggerEvent("bindSliderState", { sliderState: sliderState});
            if (!sliderState) {
              this._showSlider();
            }
        },
        /**
         * 注销登录
         */
        _outLogin(){
            wx.showModal({
                title: '确定要注销登录吗？',
                 success: (res) => {
                    if (res.confirm) {
                        wx.removeStorageSync('token');
                        wx.removeStorageSync('userInfo');
                        this.setData({'user': {}});
                    };
                }
            });
           
        },
        /**
         * 显示登录窗口
        */
        _openLogin(){
            this.setData({ 'isOpenLogin': true });
        },
        _LoginSateSync(opi){
            this.setData({ 'isOpenLogin': opi.detail.isOpenLogin });
        },
        /**
         * 监听登录完成
        */
        _onLoginSuccess(opi){
            this.setData({ 'user': opi.detail});
        },
        /**
         * 点击触发监听导航事件
        */
        _triggerNavTap(event) {
            this.triggerEvent('bindNavTap', event.currentTarget.dataset, {});
        },
        /**
         * 监听点击遮罩
        */
        _onClickMask(){
            this._hiddenSlider()
        },
        /**
         * 切换侧边导航栏
        */
        _sliderswitch(event){
            this.data.sliderState ? this._showSlider() : this._hiddenSlider();
        },
        /**
         * 显示侧边导航栏
        */
        _showSlider(duration){
            const animation  = wx.createAnimation({
                duration: duration||500,
                timingFunction: 'ease'
            });

            let userInfo = {};

            animation.opacity(1).translateX(0).step();

            if (!Object.keys(this.data.user).length){
                userInfo.user = wx.getStorageSync('userInfo');
            };

            this.setData(Object.assign(
                {
                    'sliderAin': animation.export(),
                    'sliderState': false
                },
                userInfo
            ));
            
        },
         /**
         * 隐藏侧边导航栏
        */
        _hiddenSlider(duration,x){
            const animation = wx.createAnimation({
                duration: duration||200,
                timingFunction: 'ease'
            });

            animation.opacity(0).translateX(-320).step();

            this.setData({
                'sliderAin': animation.export(),
                'sliderState': true
            });
        },
        /**
         * 处理滑动带动不可见层的问题，捕捉touchmove事件，不冒泡
        */
        _onNoScroll(ev) {
          // console.log(ev)
        }
    }
})
