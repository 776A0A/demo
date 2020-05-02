/**
 * 懒加载
 * 预加载的方案是将img设置为 display: none 或者使用 new Image 或者使用 ajax 请求回来
 */

const viewHeight = document.documentElement.clientHeight

const eles = Array.from(document.querySelectorAll('img[data-src][lazy]'))

// 加载的图片需要有个宽和高
function lazyload() {
	eles.forEach(el => {
		const {
			loading,
			dataset: { src }
		} = el

		if (!src || loading) return

		const rect = el.getBoundingClientRect()

		const { bottom, top } = rect

		if (bottom > 0 && top < viewHeight) {
			const img = new Image()

			img.src = src

			el.loading = true

			img.onload = () => (el.src = img.src)
			img.onerror = () => (el.loading = false)

			el.removeAttribute('data-src')
			el.removeAttribute('lazy')
		}
	})
}

lazy()

document.addEventListener('scroll', lazy)
