const App = getApp()

Page({
	data: {
		logged: !1,
    logo:'http://lib.diygw.com/static/img/favicon.png',
    title: App.Config.title
	},
    onLoad() {},
    onShow() {
    	const openId = App.WxService.getStorageSync('openId')
    	this.setData({
    		logged: !!openId
    	})
    	openId && setTimeout(this.goIndex, 1500)
    },
    login() {
      this.wechatDecryptData(this.goIndex)
    },
    goIndex() {
    	App.WxService.switchTab({
    		url: '/pages/index/index'
    	})
    },
	showModal() {
		App.WxService.showModal({
            title: '友情提示', 
            content: '获取用户登录状态失败，请重新登录', 
            showCancel: !1, 
        })
	},
  wechatDecryptData(cb) {
    var thiz= this;
		let code;
		App.WxService.login()
		.then(data => {
			console.log('wechatDecryptData', data.code)
			code = data.code
			return App.WxService.getUserInfo()
		})
		.then(data => {
			return App.HttpService.wechatDecryptData({
				encryptedData: data.encryptedData, 
				iv: data.iv, 
				rawData: data.rawData, 
				signature: data.signature, 
				code: code, 
        debug: App.Config.debug?"1":"0"
			})
		})
		.then(data => {
        if (data.code == 0) {
          App.WxService.setStorageSync('openId', data.openId)
          cb();
        } else{
          thiz.showModal()
        }
		})
	},
	wechatSignIn(cb) {
		if (App.WxService.getStorageSync('openId')) return
		App.WxService.login()
		.then(data => {
			console.log('wechatSignIn', data.code)
			return App.HttpService.wechatSignIn({
				code: data.code
			})
		})
		.then(data => {
			console.log('wechatSignIn', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('openId', data.data.openId)
				cb()
			} else if(data.meta.code == 40029) {
				App.showModal()
			} else {
				App.wechatSignUp(cb)
			}
		})
	},
	wechatSignUp(cb) {
		App.WxService.login()
		.then(data => {
			console.log('wechatSignUp', data.code)
			return App.HttpService.wechatSignUp({
				code: data.code
			})
		})
		.then(data => {
			console.log('wechatSignUp', data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('openId', data.data.openId)
				cb()
			} else if(data.meta.code == 40029) {
				App.showModal()
			}
		})
	},
	signIn(cb) {
		if (App.WxService.getStorageSync('openId')) return
		App.HttpService.signIn({
			username: 'admin', 
			password: '123456', 
		})
		.then(data => {
			console.log(data)
			if (data.meta.code == 0) {
				App.WxService.setStorageSync('openId', data.data.openId)
				cb()
			}
		})
	},
})