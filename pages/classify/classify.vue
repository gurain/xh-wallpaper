<script setup>
	import {
		ref
	} from 'vue';
	import {
		getClassifyApi
	} from "@/api/apis";
	
	// 获取分类列表
	const classifyList = ref([])
	const getClassifyList = async () => {
		const data = await getClassifyApi({
			pageSize:15
		})
		classifyList.value = data.data;
	}
	getClassifyList()
</script>

<template>
	<view class="layout pageBG">
		<custom-nav-bar title="分类"></custom-nav-bar>
		<view class="classify">
			<theme-item :key="item._id" :data="item" v-for="item in classifyList"></theme-item>
		</view>
	</view>
</template>


<style lang="scss" scoped>
	@import url("../../common/style/common-style.scss");

	.classify {
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15rpx;
	}
</style>