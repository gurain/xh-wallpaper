<template>
	<view class="common-title">
		<view class="name">
			<slot name="name"></slot>
		</view>
		<view class="custom">
			<slot name="custom"></slot>
		</view>
	</view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
	.common-title {
		display: flex;
		margin: 0 30rpx;
		align-items: center;
		justify-content: space-between;

		.name {
			color: $brand-theme-color;
			font-size: 40rpx;
			font-weight: 600;
		}
	}
</style>