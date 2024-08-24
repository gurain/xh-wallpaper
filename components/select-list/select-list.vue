<script setup>
	
	import {
		defineProps
	} from "vue"
	
	
	// 拨打电话
	const callPhone = () => {
		uni.makePhoneCall({
			phoneNumber: '114'
		});
	}

	const props = defineProps({
		data:{
			type:Object
		}
	})
</script>

<template>
	<view class="selection">
		<view class="list">
			<navigator url="/pages/classList/classList?name=我的下载&type=download">
				<view class="row">
					<view class="left">
						<uni-icons type="download" color="$brand-theme-color" size="20"></uni-icons>
						<text class="text">我的下载</text>
					</view>
					<view class="right">
						<view class="text">{{data.downloadSize}}</view>
						<uni-icons type="right" color="$brand-theme-color" size="15"></uni-icons>
					</view>

				</view>
			</navigator>

			<navigator url="/pages/classList/classList?name=我的评分&type=score">
				<view class="row">
					<view class="left">
						<uni-icons type="star-filled" color="$brand-theme-color" size="20"></uni-icons>
						<text class="text">我的评分</text>
					</view>
					<view class="right">
						<view class="text">{{data.scoreSize}}</view>
						<uni-icons type="right" color="$brand-theme-color" size="15"></uni-icons>
					</view>
				</view>
			</navigator>


			<view class="row">
				<view class="left">
					<uni-icons type="weixin" color="$brand-theme-color" size="20"></uni-icons>
					<text class="text">联系客服</text>
				</view>
				<view class="right">
					<!-- <view class="text">33</view> -->
					<uni-icons type="right" color="$brand-theme-color" size="15"></uni-icons>
				</view>
				<!-- #ifdef MP -->
				<button open-type="contact">联系客服</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<button @click="callPhone">拨打电话</button>
				<!-- #endif -->
			</view>
		</view>
	</view>
	<view class="selection">
		<view class="list">
			<navigator url="/pages/notice/detail">
				<view class="row">
					<view class="left">
						<uni-icons type="notification-filled" color="$brand-theme-color" size="20"></uni-icons>
						<text class="text">订阅更新</text>
					</view>
					<view class="right">
						<!-- <view class="text">33</view> -->
						<uni-icons type="right" color="$brand-theme-color" size="15"></uni-icons>
					</view>
				</view>
			</navigator>
			<navigator url="/pages/notice/detail">
				<view class="row">
					<view class="left">
						<uni-icons type="flag-filled" color="$brand-theme-color" size="20"></uni-icons>
						<text class="text">常见问题</text>
					</view>
					<view class="right">
						<!-- <view class="text">33</view> -->
						<uni-icons type="right" color="$brand-theme-color" size="15"></uni-icons>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>


<style lang="scss" scoped>
	@import url("@/common/style/common-style.scss");

	.selection {
		width: 690rpx;
		margin: 50rpx auto;
		border-radius: 10rpx;
		border: 1px solid #eee;
		box-shadow: 0 0 30rpx rgba(0, 0, 0, 0.05);

		.list {
			.row {
				background-color: #fff;

				button {
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					width: 100%;
					opacity: 0;
				}

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
</style>