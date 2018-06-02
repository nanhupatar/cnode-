// pages/content/component/reply-popup/reply-popup.js
const {cnodeApi} = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: 'string',
      value: '',
      
    },
    pupupState: {
      type: 'boolean',
      value: false
    },
    topicId: {
      type: "string",
      value: ''
    },
    replyId: {
      type: "string",
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    submitState: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _fromsubmit(e){
      this.triggerEvent('bindSubmit', { replyValue: e.detail.value.textareaValue});
      this._submitReply( e.detail.value.textareaValue)
    },
    _submitReply(con){
      if(!con.length)return;
      this.setData({'submitState': true});

      cnodeApi.buildReplies(this.data.topicId, con, this.data.replyId).then( res => {
        this.setData({ 'submitState': false });
        if (res.success){
          this.triggerEvent('bindRepliesSuccess', { result: res, content: con});
          wx.showToast({
            title: '回复成功',
            icon: 'success',
            duration: 2000
          })
        }else{
          wx.showToast({
            title: res.error_msg,
            icon: 'none',
            duration: 2000
          });
        }
      }).catch(err => console.error(err));
    }
  }
})
