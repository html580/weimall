const App = getApp()

Page({
    data: {
    	show: !0,
        form: {
			name   : '', 
			gender : 'male', 
			tel    : '', 
			address: '', 
			is_def : !1, 
        },
        radio: [
            {
            	name: '先生', 
            	value: 'male', 
            	checked: !0, 
            },
            {
            	name: '女士', 
            	value: 'female', 
            },
        ],
    },
    onLoad(option) {
    	this.WxValidate = App.WxValidate({
			name: {
				required: true, 
				minlength: 2, 
				maxlength: 10, 
			},
			tel: {
				required: true, 
				tel: true, 
			},
			address: {
				required: true, 
				minlength: 2, 
				maxlength: 100, 
			},
		}, {
			name: {
				required: '请输入收货人姓名', 
			},
			tel: {
				required: '请输入收货人电话', 
			},
			address: {
				required: '请输入收货人地址', 
			},
		})
    	this.setData({
    		id: option.id
    	})
    },
    onShow() {
    	this.renderForm(this.data.id)
    },
    renderForm(id) {
     
      App.HttpService.getDetail({
        table: 'address',
        id: id,
      }).then(data => {
        const radio = this.data.radio
        radio.forEach(n => n.checked = n.value === data.gender)
        this.setData({
          show: !data.is_def,
          radio: radio,
          form: data,
        })
      });    	
  
    },
    radioChange(e) {		 
		console.log('radio发生change事件，携带value值为：', e.detail.value)
		const params = e.detail.value
		const value = e.detail.value
		const radio = this.data.radio
		radio.forEach(n => n.checked = n.value === value)
		this.setData({
			radio: radio, 
			'form.gender': value, 
		})
	},
	submitForm(e) {
		const params = e.detail.value
		const id = this.data.id

		console.log(params)

		if (!this.WxValidate.checkForm(e)) {
			const error = this.WxValidate.errorList[0]
			App.WxService.showModal({
				title: '友情提示', 
					content: `${error.param} : ${error.msg}`, 
					showCancel: !1, 
			})
			return false
		}
    
    params.table='address';
    params.id=id;
    //更新数据
    App.HttpService.updateData(params).then(data => {
      if (data.code == 0) {
        this.showToast(data.message);
      }
    });
	},
	del(e) {	
    const id = e.currentTarget.dataset.id

    //删除数据
    App.WxService.showModal({
      title: '友情提示',
      content: '确定要删除这个地址吗？',
    })
      .then(data => {
        if (data.confirm == 1) {
          App.HttpService.delData({
            table: 'address',
            id: id
          }).then(() => App.WxService.navigateBack());
        }
      })
	},
	showToast(message) {
		App.WxService.showToast({
			title   : message, 
			icon    : 'success', 
			duration: 1500, 
    }).then(() => App.WxService.navigateBack())
	},
	chooseLocation() {
		App.WxService.chooseLocation()
	    .then(data => {
	        console.log(data)
	        this.setData({
	        	'form.address': data.address
	        })
	    })
	},
})