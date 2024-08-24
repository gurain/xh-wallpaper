<script setup>
	import {
		ref
	} from 'vue';
	import {
		onLoad,
		onUnload,
		onReachBottom,
		onShareTimeline,
		onShareAppMessage
	} from '@dcloudio/uni-app';
	import {
		getClassListApi,
		apiUserWallList
	} from "@/api/apis";
	import {
		gotoHome
	} from "@/utils/common";


	//分享给好友
	onShareAppMessage((e) => {
		return {
			title: "小海壁纸-" + pageName,
			path: "/pages/preview/classList?id=" + queryParam.value.classid + "&name=" + pageName
		}
	})


	//分享朋友圈
	onShareTimeline(() => {
		return {
			title: "小海壁纸",
			query: "id=" + queryParam.value.classid + "&name=" + pageName
		}
	})

	// 页面名字
	const pageName = ref("")
	const queryParam = ref({
		pageNum: 1,
		pageSize: 16
	})
	const noData = ref(false)
	onLoad((e) => {
		const {
			id = null, type = null, name = null
		} = e
		if (type) queryParam.value.type = type
		if (id) queryParam.value.classid = id
		// 分享的情况下,点进去没有id,默认跳转首页
		// if (!e.id) {
		// 	gotoHome()
		// 	return;
		// }
		pageName.value = name
		uni.setNavigationBarTitle({
			title: name
		})
		getClassifyList()
	})

	// 获取分类列表
	const classList = ref([])
	const getClassifyList = async () => {
		let data = null;
		if (queryParam.value.type) {
			// 用户评分和下载界面
			data = await apiUserWallList(queryParam.value)
		} else {
			// 查询列表
			data = await getClassListApi(queryParam.value)
		}
		console.log(data)
		if (queryParam.value.pageSize > data.data.length) noData.value = true;
		classList.value = [...classList.value, ...data.data];
		uni.setStorageSync("storageList", classList.value)
	}

	// 清楚缓存
	onUnload(() => {
		classList.value.remove()
	})

	// 触底加载更多
	onReachBottom(() => {
		if (noData.value) return;
		queryParam.value.pageSize++
		getClassifyList()
	})
</script>

<template>
	<view class="classlist">
		<view class="loadingLayout" v-if="!classList.length && !noData">
			<uni-load-more status="loading"></uni-load-more>
		</view>
		<view class="content">
			<navigator :url="'/pages/preview/preview?id=' + item._id" :key="item._id" class="item"
				v-for="item in classList">
				<image :src="item.smallPicurl" mode="aspectFill"></image>
			</navigator>
		</view>
		<view class="loadingLayout" v-if="classList.length || noData">
			<uni-load-more status="noMore"></uni-load-more>
		</view>
		<view class="safe-area-inset-bottom"></view>
	</view>

</template>


<style lang="scss" scoped>
	.classlist {
		.content {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 5rpx;
			padding: 5rpx;

			.item {
				height: 440rpx;

				image {
					height: 100%;
					width: 100%;
					display: block;
				}
			}
		}
	}
</style>