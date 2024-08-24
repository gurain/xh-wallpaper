import {
	request
} from "@/utils/request.js"

// 获取banner数据
export function getHomeBannerApi() {
	return request({
		url: "/homeBanner"
	})
}

// 获取banner数据
export function getRandomApi() {
	return request({
		url: "/randomWall"
	})
}

// 获取公告数据
export function getWallNewsListApi() {
	return request({
		url: "/wallNewsList",
		data:{
			select:true
		}
	})
}

// 获取分类数据
export function getClassifyApi(data) {
	return request({
		url: "/classify",
		data
	})
}


// 获取分类详情
export function getClassListApi(data = {}) {
	return request({
		url: "/wallList",
		data
	})
}


// 评分
export function setupScoreApi(data = {}) {
	return request({
		url: "/setupScore",
		data
	})
}



// 下载壁纸
export function apiWriteDownload(data = {}) {
	return request({
		url: "/downloadWall",
		data
	})
}



// 单个壁纸详情
export function apiDetailWall(data = {}) {
	return request({
		url: "/detailWall",
		data
	})
}


// 用户评分和下载
export function apiUserWallList(data = {}) {
	return request({
		url: "/userWallList",
		data
	})
}

// 用户信息
export function apiUserInfo(data = {}) {
	return request({
		url: "/userInfo",
		data
	})
}

// 最新公告
export function apiWallNewsDetail(data = {}) {
	return request({
		url: "/wallNewsDetail",
		data
	})
}


// 搜索壁纸
export function apiSearchWall(data = {}) {
	return request({
		url: "/searchWall",
		data
	})
}