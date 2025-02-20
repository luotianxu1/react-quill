import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class ImageBlot extends BlockEmbed {
    static create(value) {
        const node = super.create()
        node.setAttribute('src', value)
        node.setAttribute('class', 'editor-image')
        // 添加点击事件监听器
        node.addEventListener('click', function (e) {
            e.stopPropagation() // 阻止事件冒泡
            // 移除其他图片的选中效果
            document.querySelectorAll('.editor-image').forEach((img) => {
                img.classList.remove('selected')
            })
            // 添加当前图片的选中效果
            this.classList.add('selected')
        })
        return node
    }

    static value(node) {
        return node.getAttribute('src')
    }
}

ImageBlot.blotName = 'image'
ImageBlot.tagName = 'img'

// 注册图片格式
Quill.register(ImageBlot)

export default ImageBlot
