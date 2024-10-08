const SYSTEM_INFO = uni.getSystemInfoSync()
export const getStatusBarHeight = () => SYSTEM_INFO.statusBarHeight || 15

export const getTitleBarHeight = () => {
	if (uni.getMenuButtonBoundingClientRect) {
		const {
			top,
			height
		} = uni.getMenuButtonBoundingClientRect()
		return height + (top - getStatusBarHeight()) * 2
	} else {
		return 40
	}
}

export const getNavBarHeight = () => getTitleBarHeight() + getStatusBarHeight()