<script setup>
	import {
		ref
	} from 'vue';
	import {
		getHomeBannerApi,
		getRandomApi,
		getWallNewsListApi,
		getClassifyApi
	} from "@/api/apis";

	const bannerList = ref([])
	// 获取banner数据
	const getHomeBanner = async () => {
		const data = await getHomeBannerApi()
		bannerList.value = data.data
	}
	getHomeBanner()

	const randomList = ref([])
	// 获取随机图片
	const getRandom = async () => {
		const data = await getRandomApi()
		randomList.value = data.data
	}
	getRandom()

	const noticeList = ref([])
	const getWallNewsList = async () => {
		const data = await getWallNewsListApi()
		noticeList.value = data.data;
	}
	getWallNewsList()

	// 获取分类列表
	const classifyList = ref([])
	const getClassifyList = async () => {
		const data = await getClassifyApi({
			select: true
		})
		classifyList.value = data.data;
	}
	getClassifyList()

	// 前往阅览
	const goPreview = (id) => {
		uni.setStorageSync("storageList", randomList.value);
		uni.navigateTo({
			url: "/pages/preview/preview?id=" + id
		})
	}


	const clickBanner = (i) => {
		if (i.target == "miniProgram") {
			uni.navigateTo({
				url: `/classList/classList?id=${i.url}`
			})
		} else {
			uni.navigateBackMiniProgram({
				appId: i.appid,
				path: i.url,
				extraData: {
					// 需要传递给目标小程序的数据
				},
				success: function() {
					console.log('跳转成功');
				},
				fail: function(err) {
					console.error('跳转失败', err);
				}
			});
		}
	}
</script>

<template>
	<view class="homeLayout pageBG">
		<custom-nav-bar title="推荐"></custom-nav-bar>
		<view class="banner">
			<swiper indicator-dots indicator-color="rgba(255,255,255,0.5)" indicator-active-color="#fff" autoplay
				circular>
				<swiper-item v-for="i in bannerList" :key="i._id">
					<image @click="clickBanner(i)" mode="aspectFill" :src="i.picurl"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="notice">
			<view class="left">
				<uni-icons color="$brand-theme-color" type="sound-filled" size="16"></uni-icons>

				<view class="text">
					公告
				</view>

			</view>
			<view class="center">
				<swiper vertical autoplay interval="1500" duration="1000" circular>
					<swiper-item :key="item._id" v-for="item in noticeList">
						<navigator url="/pages/notice/detail">
							{{item.title}}
						</navigator>
					</swiper-item>
				</swiper>
			</view>
			<view class="right">
				<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		<view class="select">
			<common-title>
				<template #name>每日推荐</template>
				<template #custom>
					<view class="date">
						<uni-icons type="calendar" size="18"></uni-icons>
						<view class="text">
							<uni-dateformat :date="Date.now()" format="dd日"></uni-dateformat>
						</view>
					</view>
				</template>
			</common-title>
			<view class="content">
				<scroll-view scroll-x>
					<view class="box" :key="item._id" v-for="item in randomList">
						<image @click="goPreview(item._id)" :src="item.smallPicurl" mode="aspectFill">
						</image>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="theme">
			<common-title>
				<template #name>
					专题精选
				</template>
				<template #custom>
					<navigator class="more" url="">More+</navigator>
				</template>
			</common-title>
			<view class="content">
				<theme-item :data="item" v-for="item in classifyList" :key="item._id"></theme-item>
				<theme-item :isMore="true"></theme-item>
			</view>
		</view>
	</view>
</template>


<style lang="scss" scoped>
	@import url("../../common/style/common-style.scss");

	.homeLayout {
		.banner {
			width: 750rpx;
			padding: 30rpx 0;

			swiper {
				width: 750rpx;
				height: 340rpx;

				&-item {
					border-radius: 10rpx;
					padding: 0 30rpx;
					width: 100%;
					height: 100%;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}

		.notice {
			width: 690rpx;
			height: 80rpx;
			margin: 0 auto;
			background-color: #f9f9f9;
			border-radius: 80rpx;
			display: flex;

			.left {
				width: 140rpx;
				justify-content: center;
				align-items: center;
				display: flex;

				:deep() {
					.uni-icons {
						color: $brand-theme-color !important;
					}
				}

				.text {
					color: $brand-theme-color;
					font-weight: 600;
					font-size: 28rpx
				}
			}

			.center {
				flex: 1;
				height: 100%;

				swiper {
					height: 100%;

					&-item {
						height: 100%;
						font-size: 30rpx;
						color: #666;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						display: flex;
						align-items: center;
					}
				}
			}

			.right {
				widows: 70rpx;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}

		.select {
			margin-top: 50rpx;

			.date {
				display: flex;
				align-items: center;
				color: $brand-theme-color;

				:deep() {
					.uni-icons {
						color: $brand-theme-color !important;
					}
				}


				.text {
					margin-left: 5rpx;
				}
			}

			.content {
				width: 720rpx;
				margin-left: 30rpx;
				margin-top: 30rpx;

				scroll-view {
					width: 100%;
					white-space: nowrap;

					.box {
						width: 200rpx;
						height: 430rpx;
						display: inline-block;
						margin-right: 15rpx;

						image {
							width: 100%;
							width: 100%;
							border-radius: 10rpx;
						}
					}

					.box:last-child {
						margin-right: 30rpx;
					}
				}
			}
		}


		.theme {
			padding: 50rpx 0;

			.more {
				color: #888;
				font-size: 32rpx;
			}

			.content {
				margin-top: 30rpx;
				padding: 0 30rpx;
				display: grid;
				gap: 15rpx;
				grid-template-columns: repeat(3, 1fr);
			}
		}


	}
</style>