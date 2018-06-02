module.exports = class CNodeApi {
    constructor(){
        this.api = "https://cnodejs.org/api/v1";
    }
    /**
     * 获取主题列表
     * @param {Json} param
     * @param {Number } param.page 页数
     * @param {String } param.tab 主题分类。目前有 ask share job good
     * @param {Number } param.limit 每一页的主题数量
     * @param {boolean } param.mdrender  每一页的主题数量
     * @return {Promise[Array] } 承载主题列表 Promise
    */
    getTopicData(param){
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '拼命加载中...',
            });
            wx.request({
                url: `${this.api}/topics`,
                data: param,
                method: 'GET',
                dataType: 'json',
                success: (res) => {
                    resolve(res);
                    wx.hideLoading();
                },
                fail(err){
                    reject(err);
                }
            });
        });
    }
    /**
     * 获取主题详情
     * @param {Number } id 
     * @param {String } mdrender 当为 false 时，不渲染。默认为 true，渲染出现的所有 markdown 格式文本。
     * @param {String } accesstoken String 当需要知道一个主题是否被特定用户收藏以及对应评论是否被特定用户点赞时，才需要带此参数。会影响返回值中的 is_collect 以及 replies 列表中的 is_uped 值。
     * @return {Promise[Json] } 承载主题内容 Promise
    */
    getTopicCon(id, ismdrender) {
        
        return new Promise((resolve, reject) => {
            wx.showLoading({
                title: '拼命加载中...',
            });

            wx.request({
                url: `${this.api}/topic/${id}`,
                data: {
                    mdrender: ismdrender||true,
                    accesstoken: this.checkLogin()||''
                },
                method: 'GET',
                dataType: "json",
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                    wx.hideLoading();
                }
            })
        });
    }
    /**
     * accesstoken 验证 accessToken 的正确性
     * @param {String} token 用户的 accessToken
     * @return {Promise[json]} 如果成功匹配上用户，返回成功信息。否则 403。
    */
    autoAccessToken(token){
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${this.api}/accesstoken`,
                data: {
                    accesstoken: token
                },
                method: 'POST',
                dataType: 'json',
                success(res){
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            });
        });
    }
    /**
     * 收藏主题
     * @param {String} id 主题 id
     * @return {Promise[json]} 返回值示例 {"success": true}
    */
    collectTopic(id){
        return new Promise((resolve, reject) => {
            const token = this.checkLogin();
            if (!token) return reject('No login!');
            
            wx.request({
                url: `${this.api}/topic_collect/collect `,
                data: {
                    accesstoken: token,
                    topic_id: id
                },
                method: 'POST',
                dataType: 'json',
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            });
        });
    }
    /**
   * 取消收藏主题
   * @param {String} id 主题 id
   * @return {Promise[json]} 返回值示例 {"success": true}
  */
    deCollectTopic(id) {
        return new Promise((resolve, reject) => {
            const token = this.checkLogin();
            if (!token) return reject('No login!');

            wx.request({
                url: `${this.api}/topic_collect/de_collect  `,
                data: {
                    accesstoken: token,
                    topic_id: id
                },
                method: 'POST',
                dataType: 'json',
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            });
        });
    }
    /**
     * 为评论点赞
     *  说明：接口会自动判断用户是否已点赞，如果否，则点赞；如果是，则取消点赞。点赞的动作反应在返回数据的 action 字段中，up or down。
     * 返回值示例： {"success": true, "action": "down"}
     * @param {String} id 评论id
    */
    replyUps(id){
        return new Promise((resolve, reject) => {
            const token = this.checkLogin();
            if (!token) return reject('No login!');

            wx.request({
                url: `${this.api}/reply/${id}/ups `,
                data: {
                    accesstoken: token
                },
                method: 'POST',
                dataType: 'json',
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                }
            });
        });
    }
    /**
     * 获取用户详情
     * @param {String} loginname 用户名称
    */
    getUserInfo(loginname){
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${this.api}/user/${loginname} `,
                method: 'GET',
                dataType: 'json',
                success(res) {
                    resolve(res.data);
                },
                fail(err) {
                    reject(err);
                }
            });
        });
    }
    /**
     * 获取用户收藏主题
     * @param {String} loginname 用户名称
    */
    getUserCollectTopic(loginname){
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${this.api}/topic_collect/${loginname} `,
                method: 'GET',
                dataType: 'json',
                success(res) {
                    resolve(res.data);
                },
                fail(err) {
                    reject(err);
                }
            });

        });
    }
    /**
     * 新建评论
     * @param {String} id 主题 id
     * @param {String} content 评论主体内容 
     * @param {String} replyId 如果这个评论是对另一个评论的回复，请务必带上此字段。这样前端就可以构建出评论线索图。
     * @return {Promise[json]} 示例：{success: true, reply_id: '5433d5e4e737cbe96dcef312'}
     */
    buildReplies(id, content, replyId ){
        return new Promise((resolve, reject) => {
            const token = this.checkLogin();
            if (!token) return reject('No login!');

            wx.request({
                url: `${this.api}/topic/${id}/replies`,
                data: {
                    content: content,
                    reply_id: replyId||'',
                    accesstoken: token
                },
                method: 'POST',
                dataType: 'json',
                success(res) {
                    resolve(res.data);
                },
                fail(err) {
                    reject(err);
                }
            });

        });
    }
    /**
     * 检查是否登录
     * @param {boolean} isShowModal 如果没登录是否打开弹窗，需要挂载在 Page 上，示例：Page({checkLogin: cnodeApi.checkLogin});
     * @param {Function} callback 确定回调
     * @return {String} token
    */
    checkLogin(isShowModal, callback){
        const token = wx.getStorageSync('token');
        
        if (token === '' ){
            if (isShowModal){
                wx.showModal({
                    title: '还没登录，是否登录？',
                    success: res => callback && callback(res)
                });
            }
            return false;
        }
        return token;
    }
    /**
     * 验证登录
     * @return {Promise[Json]} 承载用户信息 Promise
    */
    autoLogin(){
        return new Promise((resolve,reject) => {
            const token = this.checkLogin();
            if (!token) return reject('No login!');

            this.autoAccessToken(token).then(res => {
                if (res.data.success) {
                    return resolve(res.data);
                }
                return resole(false);
            }).catch(err => reject(err));
        });
    }
}