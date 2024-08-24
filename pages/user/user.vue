<script setup>
	import {
		ref
	} from 'vue';
	import {
		apiUserInfo
	} from "@/api/apis"
	import {
		getNavBarHeight
	} from "@/utils/system"

	const userInfo = ref({})

	// 获取用户信息
	async function getUserInfo() {
		const res = await apiUserInfo()
		userInfo.value = res.data
	}
	getUserInfo()
</script>

<template>
	<view class="userLayout pageBG" v-if="userInfo">
		<view :style="{height:getNavBarHeight() + 'px'}"></view>
		<view class="userInfo">
			<view class="avatar">
				<image src="../../static/images/logo2.jpg" mode="aspectFill"></image>
			</view>
			<view class="ip">{{userInfo.IP}}</view>
			<view class="address">来自于:
			{{ userInfo?.address?.city || userInfo?.address?.province || userInfo?.address?.country }}
			</view>
		</view>
		<select-list :data="userInfo"></select-list>
	</view>
	<view :style="{height:getNavBarHeight() + 'px'}" class="loadingLayout" v-else>
		<uni-load-more status="more"></uni-load-more>
	</view>
</template>


<style lang="scss" scoped>
	@import url("../../common/style/common-style.scss");

	.userLayout {
		.select {
			width: 690rpx;
			margin: 50rpx auto;
			border-radius: 10rpx;
			border: 1px solid #eee;
			box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);

			.list {
				.row {
					display: flex;
					justify-content: space-between;
					align-content: center;
					padding: 0 30rpx;
					height: 100rpx;
					border-bottom: 1px solid #eee;
					position: relative;
					background: #fff;

					&:last-child {
						border-bottom: 0
					}

					.left {
						display: flex;
						align-items: center;

						.text {
							padding-left: 20rpx;
							color: #666
						}
					}

					.right {
						display: flex;
						align-items: center;

						.text {
							font-size: 28rpx;
							color: #aaa;
						}
					}
				}
			}
		}


		.userInfo {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			padding: 50rpx 0;

			.avatar {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.ip {
				font-size: 44rpx;
				color: #333;
				padding: 20rpx 0 5rpx;
			}

			.address {
				font-size: 28rpx;
				color: #aaa;
			}
		}
	}
</style>