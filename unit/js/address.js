new Vue({
	el:'.container',
	data: {
		//vue模型
		addressList:[],
		limitNum:3,
		currentIndex:0, //点击选中当前，默认第0个.点击的索引等于它自身的索引就添加check类
		shippingMethod:1 //配送方式
		
	},
	mounted: function () {
		//初始化加载，确保vue实例已经插入到DOM中
		this.$nextTick(function () {
			this.getAddressList();
		});
	},
	computed: {
		//实现对v-for的过滤，例如：一共10条数据，只显示3条
		filterAddress: function () {
			return this.addressList.slice( 0,this.limitNum ); //返回全新数组，该方法并不会修改数组，而是返回一个子数组
		}
	},
	methods: {
		getAddressList: function () {
			this.$http.get('data/address.json').then(res => {
				this.addressList = res.data.result;
			})
		},
		loadMore: function () {
			//点击加载更多，可以在html写表达式，不再写方法
		},
		//点击卡片，设置默认地址
		setDefault: function (addressId) {
			this.addressList.forEach(function (item ,index) {
				
				if (item.addressId == addressId) {
					item.isDefault = true;
					
				}else {
					item.isDefault = false;
					
				}
			
			});
			
		},
		//删除地址
		delAddress: function (index) {
			return this.addressList.splice( index, 1 );
		}
	}
})
