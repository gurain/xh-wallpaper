<script setup>
	import {
		ref
	} from "vue";
	import {
		onLoad,
		onUnload,
		onReachBottom
	} from "@dcloudio/uni-app";
	import {
		apiSearchWall
	} from "@/api/apis";

	//查询参数
	const queryParams = ref({
		pageNum: 1,
		pageSize: 12,
		keyword: ""
	})


	//搜索历史词
	const historySearch = ref([]);
	// 读取历史词
	onLoad(() => {
		historySearch.value = uni.getStorageSync("historySearch");
	})

	//热门搜索词
	const recommendList = ref(["美女", "风景", "卡通", "帅哥"]);

	//没有更多
	const noData = ref(false);
	//没有搜索结果
	const noSearch = ref(false);

	//搜索结果列表
	const classList = ref([]);

	//点击搜索
	const onSearch = () => {
		uni.showLoading()
		initParams(queryParams.value.keyword);
		searchData();
		if (queryParams.value.keyword) {
			historySearch.value = [...new Set([queryParams.value.keyword, ...historySearch.value])].slice(0, 10);
			uni.setStorageSync("historySearch", historySearch.value);
		}
	}

	// 进行搜索，设置图片列表缓存等
	const searchData = async () => {
		try {
			const res = await apiSearchWall(queryParams.value)
			classList.value = [...classList.value, ...res.data]
			if (classList.value.length > res.data.length) noData.value = true
			if (res.data.length == 0 && classList.value.length == 0) noSearch.value = true
			uni.setStorageSync("storageList", classList.value);
		} finally {
			uni.hideLoading()
		}
	}

	// 初始化参数
	const initParams = (value = '') => {
		classList.value = [];
		noData.value = false;
		noSearch.value = false;
		queryParams.value = {
			pageNum: 1,
			pageSize: 12,
			keyword: value || ""
		}
	}

	//点击清除按钮
	const onClear = () => {
		uni.showModal({
			title: "是否清空历史搜索？",
			success: res => {
				if (res.confirm) {
					uni.removeStorageSync("historySearch");
					historySearch.value = []
				}
			}
		})
	}


	//点击标签进行搜索
	const clickTab = (value) => {
		initParams(value)
		onSearch()
	}


	//点击清空搜索记录
	const removeHistory = () => {
		uni.showModal({
			title: "是否清空历史搜索？",
			success: res => {
				if (res.confirm) {
					console.log("确认删除");
				}
			}
		})
	}

	//触底加载更多
	onReachBottom(() => {
		if (!noData.value) {
			queryParams.value.pageNum++
			searchData();
		}
	})

	//关闭有页面
	onUnload(() => {
		uni.removeStorageSync("storageList");
	})
</script>

<template>
	<view class="searchLayout">
		<view class="search">
			<uni-search-bar @confirm="onSearch" @cancel="onClear" @clear="onClear" focus placeholder="搜索"
				v-model="queryParams.keyword">
			</uni-search-bar>
		</view>
		<view v-if="!classList.length || noSearch">
			<view class="history">
				<view class="topTitle">
					<view class="text">最近搜索</view>
					<view class="icon" @click="removeHistory">
						<uni-icons type="trash" size="25"></uni-icons>
					</view>
				</view>
				<view class="tabs">
					<view class="tab" v-for="tab in historySearch" :key="tab" @click="clickTab(tab)">{{tab}}</view>
				</view>
			</view>

			<view class="recommend">
				<view class="topTitle">
					<view class="text">热门搜索</view>
				</view>
				<view class="tabs">
					<view class="tab" v-for="tab in recommendList" :key="tab" @click="clickTab(tab)">{{tab}}</view>
				</view>
			</view>
		</view>

		<view class="noSearch" v-if="noSearch">
			<uv-empty mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png"></uv-empty>
		</view>
		<view v-else>
			<view class="list">
				<navigator :url="`/pages/preview/preview?id=${item._id}`" class="item" v-for="item in classList"
					:key="item._id">
					<image :src="item.smallPicurl" mode="aspectFill"></image>
				</navigator>
			</view>
			<view v-if="noData || classList.length"><uni-load-more :status="noData?'noMore':'loading'" /></view>
		</view>
	</view>
</template>



<style lang="scss" scoped>
	.searchLayout {
		.search {
			padding: 0 10rpx;
		}

		.topTitle {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 32rpx;
			color: #999;
		}

		.history {
			padding: 30rpx;
		}

		.recommend {
			padding: 30rpx;
		}

		.tabs {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			padding-top: 20rpx;

			.tab {
				background: #F4F4F4;
				font-size: 28rpx;
				color: #333;
				padding: 10rpx 28rpx;
				border-radius: 50rpx;
				margin-right: 20rpx;
				margin-top: 20rpx;
			}
		}

		.list {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 20rpx 5rpx;

			.item {
				height: 440rpx;

				image {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
		}
	}
</style>