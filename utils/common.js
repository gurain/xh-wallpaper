export function formatTimeDifference(timestamp) {
	const now = Date.now();
	const past = new Date(timestamp);
	const diff = now - past.getTime();

	const oneMinute = 60 * 1000;
	const oneHour = 60 * oneMinute;
	const oneDay = 24 * oneHour;
	const oneMonth = 30 * oneDay; // 这里简化为30天一个月
	const threeMonths = 3 * oneMonth;

	if (diff < 0) {
		return null; // 如果时间戳是未来的，返回null
	}

	if (diff < oneMinute) {
		return '1分钟';
	} else if (diff < oneHour) {
		const minutes = Math.floor(diff / oneMinute);
		return `${minutes}分钟`;
	} else if (diff < oneDay) {
		const hours = Math.floor(diff / oneHour);
		return `${hours}小时`;
	} else if (diff < oneMonth) {
		const days = Math.floor(diff / oneDay);
		return `${days}天`;
	} else if (diff < threeMonths) {
		const months = Math.floor(diff / oneMonth);
		return `${months}月`;
	} else {
		return null;
	}
}

export function gotoHome() {
	uni.showModal({
		title: "提示",
		content: "页面有误将返回首页",
		showCancel: false,
		success: (res) => {
			if (res.confirm) {
				uni.reLaunch({
					url: "/pages/index/index"
				})
			}
		}
	})
}