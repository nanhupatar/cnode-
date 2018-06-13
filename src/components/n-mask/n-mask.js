// components/mask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      'maskState': {
          type: "boolean",
          value: false
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
    _onTap(){
        this.triggerEvent('clickMask');
    },
    _showMask(){
        this.setData({'maskState': true});
    },
    _hideMask(){
        this.setData({ 'maskState': false });
    }
  }
})
