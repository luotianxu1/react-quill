import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class ImageBlot extends BlockEmbed {
    static create(value) {
        const node = super.create()
        // 创建图片元素
        const img = document.createElement('img')
        img.setAttribute('src', value)
        img.setAttribute('class', 'editor-image')

        // 设置图片加载完成后的处理
        img.onload = function () {
            // 设置默认最大宽度为容器的80%
            const maxWidth = img.parentElement.offsetWidth * 0.8
            if (img.width > maxWidth) {
                const ratio = maxWidth / img.width
                img.width = maxWidth
                img.height = img.height * ratio
            }
        }

        // 创建调整大小的手柄
        const resizer = document.createElement('div')
        resizer.className = 'image-resizer'

        // 添加点击事件监听器
        img.addEventListener('click', function (e) {
            e.stopPropagation()
            document.querySelectorAll('.editor-image').forEach((img) => {
                img.classList.remove('selected')
            })
            this.classList.add('selected')
        })

        // 处理拖拽调整大小
        let isResizing = false
        let startX, startY, startWidth, startHeight

        resizer.addEventListener('mousedown', function (e) {
            e.stopPropagation()
            isResizing = true
            startX = e.pageX
            startY = e.pageY
            startWidth = img.offsetWidth
            startHeight = img.offsetHeight

            // 添加全局鼠标事件
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        })

        function onMouseMove(e) {
            if (!isResizing) return

            const width = startWidth + (e.pageX - startX)
            const height = startHeight + (e.pageY - startY)

            // 设置最小尺寸
            if (width >= 100) {
                img.style.width = width + 'px'
            }
            if (height >= 100) {
                img.style.height = height + 'px'
            }
        }

        function onMouseUp() {
            isResizing = false
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        // 创建包装容器
        const wrapper = document.createElement('div')
        wrapper.className = 'image-wrapper'
        wrapper.appendChild(img)
        wrapper.appendChild(resizer)

        return wrapper
    }

    static value(node) {
        const img = node.querySelector('img')
        return img ? img.getAttribute('src') : null
    }
}

ImageBlot.blotName = 'image'
ImageBlot.tagName = 'div'
ImageBlot.className = 'image-wrapper'

// 注册图片格式
Quill.register(ImageBlot)

export default ImageBlot
