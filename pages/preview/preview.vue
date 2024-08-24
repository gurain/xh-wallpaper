<script setup>
	import {
		ref
	} from 'vue';
	import {
		getStatusBarHeight
	} from "../../utils/system.js"
	import {
		onLoad,
		onShareAppMessage,
		onShareTimeline
	} from '@dcloudio/uni-app';

	import {
		apiDetailWall,
		setupScoreApi,
		apiWriteDownload
	} from "../../api/apis.js"
	import {
		gotoHome
	} from "../../utils/common.js"

	// 本地缓存的图片列表
	const list = ref([])
	// 当前图片位置
	const nowNum = ref(0)
	// 当前id
	const nowId = ref(0)
	// 当前图片信息
	const nowInfo = ref({})
	// 用户评分
	const userScore = ref(0)
	// 是否评分
	const isScore = ref(0)
	// 缓存集合列表
	const readImages = ref(new Set())
	const storageList = uni.getStorageSync("storageList") || []

	//返回上一级
	const goBack = () => {
		uni.navigateBack({
			fail: () => {
				uni.navigateTo({
					url: "/pages/index/index"
				})
			}
		})
	}

	//提交评分
	const submitScore = async () => {
		const {
			classid,
			_id: wallId
		} = nowInfo.value
		const data = await setupScoreApi({
			classid,
			wallId,
			userScore: userScore.value
		})
		if (data.errCode == 0) {
			uni.showToast({
				title: "评分成功",
				icon: "none"
			})
			// 在本地存储中设置用户的评分
			list.value[nowNum.value].userScore = userScore.value
			nowInfo.value.userScore = userScore.value
			//存入存储中
			uni.setStorageSync("storageList", list.value)
			closeScoreProp()
		}
	}



	//遮罩状态
	const maskState = ref(true)
	const changePic = () => {
		maskState.value = !maskState.value
	}

	// 信息弹窗
	const infoPopup = ref(null)
	const openInfoProp = () => {
		infoPopup.value.open()
	}

	// 评分弹窗
	const scorePopup = ref(null)
	const openScoreProp = () => {
		// 已经评过分了
		if (nowInfo.value.userScore) {
			userScore.value = nowInfo.value.userScore
			isScore.value = true
		}
		scorePopup.value.open()
	}

	//关闭弹出
	const closeScoreProp = () => {
		//重置评分
		// userScore.value = 0
		isScore.value = true
		scorePopup.value.close()
	}

	//从存储中获取值
	list.value = storageList.map(item => {
		return {
			...item,
			picUrl: item.smallPicurl.replace("_small.webp", ".jpg")
		}
	})

	//页面加载
	onLoad(async (e) => {
		nowId.value = e.id
		if (e.type == "share") {
			const res = await apiDetailWall({
				id: nowId.value
			})
			list.value = res.data
			list.value.map(item => {
				return {
					...item,
					picUrl: item.smallPicurl.replace("_small.webp", ".jpg")
				}
			})
		}
		// 根据传入的id找到当前图片的索引
		nowNum.value = list.value.findIndex(item => item._id == e.id)
		nowInfo.value = list.value[nowNum.value]
		userScore.value = nowInfo.value.score
		addImageId()
	})

	// 左右滑动
	const changeNum = (e) => {
		nowNum.value = e.detail.current
		nowInfo.value = list.value[nowNum.value]
		//缓存的信息中存在userScore，说明已经评分过了，设置当前分数为用户评分后的分数
		if(nowInfo.value.userScore){
			nowInfo.value.score = nowInfo.value.userScore
		}
		userScore.value = nowInfo.value.score
		addImageId()
	}

	// 添加已浏览图片
	function addImageId() {
		readImages.value.add(nowNum.value <= 0 ? list.value.length - 1 : nowNum.value - 1)
		readImages.value.add(nowNum.value)
		readImages.value.add(nowNum.value >= list.value.length - 1 ? 0 : nowNum.value + 1)
	}

	//分享给好友
	onShareAppMessage((e) => {
		return {
			title: "小海壁纸",
			path: "/pages/preview/preview?id=" + nowId.value + "&type=share"
		}
	})


	//分享朋友圈
	onShareTimeline(() => {
		return {
			title: "小海壁纸",
			query: "id=" + nowId.value + "&type=share"
		}
	})

	// 点击下载逻辑
	async function clickDownload() {
		// #ifdef H5
		uni.showModal({
			content: "请长按保存壁纸",
			showCancel: false
		})
		// #endif

		// #ifndef H5
		try {
			uni.showLoading({
				title: "下载中...",
				mask: true
			})
			let {
				classid,
				_id: wallId
			} = nowInfo.value;
			let res = await apiWriteDownload({
				classid,
				wallId
			})
			if (res.errCode != 0) throw res;
			uni.getImageInfo({
				src: nowInfo.value.picurl,
				success: (res) => {
					uni.saveImageToPhotosAlbum({
						filePath: res.path,
						success: (res) => {
							uni.showToast({
								title: "保存成功，请到相册查看",
								icon: "none"
							})
						},
						fail: err => {
							if (err.errMsg == 'saveImageToPhotosAlbum:fail cancel') {
								uni.showToast({
									title: '保存失败，请重新点击下载',
									icon: "none"
								})
								return;
							}
							uni.showModal({
								title: "授权提示",
								content: "需要授权保存相册",
								success: res => {
									if (res.confirm) {
										uni.openSetting({
											success: (setting) => {
												console.log(
													setting);
												if (setting
													.authSetting[
														'scope.writePhotosAlbum'
													]) {
													uni.showToast({
														title: "获取授权成功",
														icon: "none"
													})
												} else {
													uni.showToast({
														title: "获取权限失败",
														icon: "none"
													})
												}
											}
										})
									}
								}
							})
						},
						complete: () => {
							uni.hideLoading();
						}
					})
				}
			})
		} catch (err) {
			console.log(err);
			uni.hideLoading();
		}
		// #endif
	}
</script>

<template>
	<view class="preview">
		<!-- 轮播壁纸 -->
		<swiper @change="changeNum" circular :current="nowNum">
			<swiper-item v-for="item in list" :key="item._id">
				<image v-if="readImages.has(nowNum)" @click="changePic" :src="item.picUrl" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- 壁纸上的遮罩 -->
		<view class="mask" v-show="maskState">
			<view class="goBack" @click="goBack" :style="{ top:getStatusBarHeight() + 'px'}">
				<uni-icons type="back" color="#fff" size="20"></uni-icons>
			</view>
			<view class="count">{{nowNum + 1}} / {{list.length}}</view>
			<view class="time">
				<uni-dateformat :date="new Date()" format="hh : mm"></uni-dateformat>
			</view>
			<view class="date">
				<uni-dateformat :date="new Date()" format="MM月dd日"></uni-dateformat>
			</view>
			<view class="footer">
				<view class="box" @click="openInfoProp()">
					<uni-icons type="info" size="23"></uni-icons>
					<view class="text">信息</view>
				</view>
				<view class="box" @click="openScoreProp()">
					<uni-icons type="star" size="23"></uni-icons>
					<view class="text">{{userScore}}分</view>
				</view>
				<view class="box" @click="clickDownload">
					<uni-icons type="download" size="23"></uni-icons>
					<view class="text">下载</view>
				</view>
			</view>
		</view>

		<!-- 信息弹窗 -->
		<uni-popup ref="infoPopup" type="bottom">
			<view class="infoPopup">
				<view class="popHeader">
					<view></view>
					<view class="title">{{isScore ? "评分过了" : "壁纸信息"}}</view>
					<view class="close" @click="infoPopup.close()">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>
				<scroll-view scroll-y>
					<view class="content" v-if="nowInfo">
						<view class="row">
							<view class="label">壁纸ID：</view>
							<text selectable class="value">{{nowInfo._id}}</text>
						</view>
						<view class="row">
							<view class="label">发布者：</view>
							<text class="value">{{nowInfo.nickname}}</text>
						</view>

						<view class="row">
							<text class="label">评分：</text>
							<view class='value roteBox'>
								<uni-rate readonly touchable :value="nowInfo.score" size="16" />
								<text class="score">{{nowInfo.score}}分</text>
							</view>
						</view>

						<view class="row">
							<text class="label">摘要：</text>
							<view class='value'>
								{{nowInfo.description}}
							</view>
						</view>

						<view class="row">
							<text class="label">标签：</text>
							<view class='value tabs'>
								<view class="tab" v-for="tab in nowInfo.tabs" :key="tab">
									{{tab}}
								</view>
							</view>
						</view>

						<view class="copyright">
							声明：本图片来用户投稿，非商业使用，用于免费学习交流，如侵犯了您的权益，您可以拷贝壁纸ID举报至平台，邮箱513894357@qq.com，管理将删除侵权壁纸，维护您的权益。

						</view>

						<view class="safe-area-inset-bottom"></view>
					</view>
				</scroll-view>

			</view>
		</uni-popup>
		<!-- 评分弹窗 -->
		<uni-popup ref="scorePopup" :is-mask-click="false" type="center">
			<view class="scorePopup">
				<view class="popHeader">
					<view></view>
					<view class="title">{{isScore ? "已经评过分了~" : "壁纸评分"}}</view>
					<view class="close" @click="scorePopup.close()">
						<uni-icons type="closeempty" size="18" color="#999"></uni-icons>
					</view>
				</view>
				<view class="content">
					<uni-rate :disabled="isScore" disabled-color="#FFCA3E" v-model="userScore" allow-half touchable />
					<view class="text">{{userScore}}分</view>
				</view>
				<view class="footer" v-if="nowInfo">
					<button @click="submitScore" :disabled="!userScore || isScore" type="default" size="mini"
						plain>确认评分</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>


<style lang="scss" scoped>
	.preview {
		width: 100%;
		height: 100vh;
		position: relative;

		swiper {
			width: 100%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.mask {
			&>view {
				position: absolute;
				left: 0;
				right: 0;
				margin: auto;
				width: fit-content;
				color: #fff;
			}

			.goBack {
				width: 38px;
				height: 38px;
				background: rgba(0, 0, 0, 0.5);
				left: 30rpx;
				margin-left: 0;
				border-radius: 100px;
				top: 0;
				backdrop-filter: blur(10rpx);
				border: 1rpx solid rgba(255, 255, 255, 0.3);
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.count {
				top: 10vh;
				font-size: 28rpx;
				background: rgba(0, 0, 0, 0.3);
				padding: 8rpx 28rpx;
				border-radius: 40rpx;
				backdrop-filter: blur(10rpx);
			}

			.time {
				font-size: 140rpx;
				top: calc(10vh + 80rpx);
				font-weight: 100;
				line-height: 1em;
				text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
			}

			.date {
				font-size: 34rpx;
				top: calc(10vh + 230rpx);
				text-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
			}

			.footer {
				position: absolute;
				background-color: rgba(255, 255, 255, 0.8);
				width: 65vw;
				height: 120rpx;
				left: 0;
				bottom: 10vh;
				border-radius: 120rpx;
				color: #000;
				display: flex;
				justify-content: space-around;
				box-shadow: 0 4rpx rgba(0, 0, 0, 0.3);
				backdrop-filter: blur(20rpx);

				.box {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-content: center;
					padding: 2rpx 12rpx;

					.text {
						font-size: 26rpx;
						color: $text-font-color-2;
					}
				}
			}
		}

		.popHeader {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.title {
				color: $text-font-color-2;
				font-size: 26rpx;
			}

			.close {
				padding: 10rpx;
			}
		}

		.infoPopup {
			background: #fff;
			padding: 30rpx;
			border-radius: 30rpx 30rpx 0 0;
			overflow: hidden;


			scroll-view {
				max-height: 60vh;

				.content {
					.row {
						display: flex;
						line-height: 1.7em;
						padding: 16rpx 0;

						font-size: 32rpx;

						.label {
							color: $text-font-color-3;
							width: 140rpx;
							text-align: right;
							font-size: 30rpx;
						}

						.value {
							width: 0;
							flex: 1;
						}

						.roteBox {
							display: flex;
							justify-content: left;
							align-items: center;

							.score {
								font-size: 26rpx;
								color: $text-font-color-2;
								padding-left: 15rpx;
							}
						}

						.tabs {
							display: flex;
							flex-wrap: wrap;

							.tab {
								color: $brand-theme-color;
								margin-right: 10rpx;
								border-radius: 30rpx;
								padding: 3rpx 10rpx;
								font-size: 30rpx;
								border: 1rpx solid $brand-theme-color;
							}
						}

						.class {
							color: $brand-theme-color;
						}
					}

					.copyright {
						font-size: 28rpx;
						padding: 20rpx;
						background: #F6F6F6;
						color: #666;
						border-radius: 10rpx;
						margin: 20rpx 0;
						line-height: 1.6em;
					}
				}
			}
		}

		.scorePopup {
			background: #fff;
			padding: 30rpx;
			border-radius: 30rpx;
			width: 70vw;

			.content {
				padding: 30rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;

				.text {
					color: #FFCA3E;
					padding-left: 10rpx;
					width: 80rpx;
					line-height: 1em;
					text-align: right;
				}
			}

			.footer {
				padding: 10rpx 0;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

	}
</style>