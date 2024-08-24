<script setup>
	import {
		formatTimeDifference
	} from "../../utils/common.js"
	import {
		defineProps
	} from "vue"

	const props = defineProps({
		isMore: {
			type: Boolean,
			default: false
		},
		data: {
			type: Object,
			default () {
				return {
					name: "默认名称",
					picurl: "../../common/images/classify1.jpg",
					updateTime: Date.now() - 1000 * 60 * 60 * 5
				}
			}
		}
	})


	function getTime() {
		const data = props["data"]
		// console.log(Math.ceil((Date.now() - data.updateTime) / (1000 * 60 * 60 * 24)))
	}
	getTime()
</script>

<template>
	<view class="themeItem">
		<navigator class="box" :url="'../../pages/classList/classList?id=' + data._id + '&name=' + data.name "
			v-if="!isMore">
			<image class="img" :src="data.picurl" mode="aspectFill"></image>
			<view class="mask">
				{{data.name}}
			</view>
			<view v-show="formatTimeDifference(data.updateTime)!==null" class="tab">
				{{formatTimeDifference(data.updateTime)}}前更新
			</view>
		</navigator>
		<navigator class="box more" open-type="reLaunch" url="/pages/classify/classify" v-else>
			<image class="img" src="../../common/images/more.jpg" mode="aspectFill"></image>
			<view class="mask">
				<uni-icons type="more-filled" size="34" color="#fff"></uni-icons>
				<view class="text">
					更多
				</view>
			</view>
		</navigator>
	</view>
</template>

<style lang="scss" scoped>
	.themeItem {
		.box {
			height: 340rpx;
			overflow: hidden;
			position: relative;
			border-radius: 10rpx;

			.img {
				width: 100%;
				height: 100%;
			}

			.mask {
				width: 100%;
				height: 70rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				background-color: rgba(0, 0, 0, 0.2);
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 30rpx;
				color: #fff;
				font-weight: 600;
				backdrop-filter: blur(20rpx);
			}

			.tab {
				position: absolute;
				left: 0;
				top: 0;
				padding: 7rpx 14rpx;
				background-color: rgba(250, 128, 90, 0.7);
				backdrop-filter: blur(20rpx);
				font-size: 22rpx;
				color: #fff;
				border-radius: 0 0 20rpx 0;
			}
		}

		.box.more {
			.mask {
				height: 100%;
				width: 100%;
				flex-direction: column;
			}

			.text {
				font-size: 28rpx
			}
		}
	}
</style>