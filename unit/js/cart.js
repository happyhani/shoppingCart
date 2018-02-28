new Vue({
	el:"#app",
	data: {
		totalMoney: 0,
		productList: [],
		checkAllFlag: false,  //item是循环，没有办法定义，需要set
		isShow: false,
		index: ''

	},
	filters: {
		formatMoney: function (value,type) {
//			toFixed是四舍五入的,应该由后端做格式化在返给前端
			return "￥ " + value.toFixed(2) + type;
		}
	},
	mounted: function () {
		 this.$nextTick(function () {
		    // 代码保证 this.$el 在 document 中
		    //一进来就执行cartView()方法
		    this.cartView();
		  })
	},
	methods: {
		cartView: function () {
			let _this = this;
			this.$http.get("data/cartData.json").then(res => {
				//在方法内部，this指向改变
				this.productList = res.data.result.list;  //将接口的数据保存到模型里data的productList变量中，用v-for来遍历列表
//				this.totalMoney = res.data.result.totalMoney; //先不用后台返回的数据，总金额
//				箭头函数里面的作用域和外面的作用域一样
			});
		},
		//增加减少一件商品
		changeMoney: function (product, way) {
			//不会操作DOM，是操作变量，或者是操作模型，data里的都是模型
			if (way>0) {
				product.productQuantity++;
			}else {
				product.productQuantity--;
				if (product.productQuantity<1){
					product.productQuantity = 1;
				}
			}
			this.calcTotalMoney();
			
		},
		//单选
		selectedProduct: function (item) {
			//如果数据不在data中或后台返回的数据中，js是对这个数据监听不到的
//			如果一个对象的变量不存在应该怎么办？2种方法
//			不存在的话有2中方式: 1.全局使用,将checked注册到item中 2.局部注册
			if (typeof item.checked == 'undefined') {
				
//Vue.set( target, key, value )  全局注册
				Vue.set(item,'checked',true);
				//this.$set(item,'checked',true); //局部注册
			}else {
				item.checked = !item.checked;
				
			}
			this.calcTotalMoney();
			
		},
		//全选
		checkAll: function (flag) {
			this.checkAllFlag = flag;
			var _this = this;
			//如果选中全选，就遍历 for或者forEach
			
//				for (var i=0; i<this.productList.length; i++) {
//					this.productList[i].checked = true;
//				}
			this.productList.forEach(function (item,index) {
				//value.checked = true; //只有点击过后才有checked属性，否则无效
				if (typeof item.checked == 'undefined') {
					Vue.set(item,'checked',_this.checkAllFlag);
				}else {
					item.checked = _this.checkAllFlag;
					
//					if (item.checked) {
//						_this.totalMoney += item.productPrice*item.productQuantity;
//					}
				}
			});
			this.calcTotalMoney();
		},
		//商品总金额
		calcTotalMoney: function () {
			var _this = this;
			this.totalMoney = 0;
			this.productList.forEach(function (item,index) {
				if (item.checked) {
					_this.totalMoney += item.productPrice*item.productQuantity;
				}
			});
		},
		//删除商品弹窗
		delConfirm: function (index) {
			this.index = index;
			this.isShow = true;
		},
		//删除商品
		delProduct: function (index) {
			//点击yes 需要知道删除哪个 用$http删除，向后台传数据商品id
			this.productList.splice(this.index, 1);
			this.isShow = false;
		}
	}
})

//任意页面进行调用，全局过滤器
Vue.filter('money', function (value, type) {
	return "￥ " + value.toFixed() + type;
})
