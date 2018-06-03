// components/login.js
const { cnodeApi} = getApp();
const { showSuccessToast, showErrorToast } = require('../../utils/util');

Component({
    id: 'login',
  /**
   * 组件的属性列表
   */
  properties: {
      isOpenLogin: {
          type: 'boolean',
          value: false,
          observer(newVal){
              newVal ? this._showLogin() : this._hideLogin();
          }
      },
      isMask: {
          type: 'boolean',
          value: true
        }
  },

  /**
   * 组件的初始数据
   */
  data: {
    token: '',
    classAnim: '',
    submitState: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
      /**
       * 显示登录
      */
    _showLogin(){
        
        this.setData({
            'isOpenLogin': true,
            'classAnim': 'fadeInDown'
        });
        this._triggerLoginStateSync();
    },
    /**
     * 隐藏登录
    */
    _hideLogin() {
        this.setData({
            'classAnim': 'fadeOutDownBig'
        });
        setTimeout(() => {
            this.setData({
                'isOpenLogin': false
            });
        },200);
        this._triggerLoginStateSync();
    },
    /**
     * 触发事件，同步 侧边导航组件 与 登录组件、状态。
     */
    _triggerLoginStateSync(state){
        this.triggerEvent('loginStateSync', { isOpenLogin: this.data.isOpenLogin }, {});
    },
    /**
     * 登录成功后，触发监听的 loginSuccess 事件，传入 user 信息
    */
    _onLoginSuccess(user){
        this.triggerEvent('loginSuccess', user, {});
    },
    /**
     * 验证 accessToken 的正确性，将返回的 用户信息 和 token宣写入缓存
    */
     _userLogin(token){
         this.setData({'submitState': true});
          cnodeApi.autoAccessToken(token).then(res => {
              this.setData({ 'submitState': false });
              if (res.data.success) {
                  wx.setStorageSync('token', token);
                  wx.setStorageSync('userInfo', res.data);

                  showSuccessToast('登录成功');
                  this._onLoginSuccess(res.data);
                  this._hideLogin();
                  return;
              };
              
              showErrorToast(res.data.error_msg)
          }).catch(err => {
              console.error(err)
          });
      },
      /**
       * 调用扫码接口读取 token
      */
      _scanCodeLogin(){
          wx.scanCode({
              onlyFromCamera: true,
              success: (res) => {
                  if (res.errMsg === "scanCode:ok"){
                      this.setData({ 'token': res.result });
                      this._userLogin(res.result );
                  }
              }
          })
      },
      /**
       * 显示提示
       */
      _showTips(){
          wx.showModal({
              title:'如何获取 Access Token?',
              content: `在CNode社区网站登录你的帐号 > 
                            然后在右上角找到[设置]按钮 > 
                            点击进入后将页面滑动最底部 > 
                            查看你的 Access Token，或找到二维码扫码登录。`,
              showCancel: false
            });
      },
      /**
       * 获得表单提交 token
      */
      _submit(e){
          const token = e.detail.value.token;
          if (!token.length ) return false;
          this._userLogin(token);
    }
  }
})
