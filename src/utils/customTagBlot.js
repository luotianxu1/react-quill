import Quill from 'quill'

const Inline = Quill.import('blots/inline')

class CustomTagBlot extends Inline {
    static create(value) {
        const node = super.create()
        node.setAttribute('class', 'custom-tag')
        node.setAttribute('data-custom-tag', 'true')
        // 设置内容不可编辑
        node.setAttribute('contenteditable', 'false')
        return node
    }

    static formats(node) {
        return node.hasAttribute('data-custom-tag')
    }

    // 重写 format 方法来防止清除
    format(name, value) {
        if (name === this.statics.blotName) {
            if (value) super.format(name, value)
            return
        }
        super.format(name, value)
    }

    // 重写 removeFormat 方法来防止清除
    removeFormat() {
        return this
    }
}

CustomTagBlot.blotName = 'customTag'
CustomTagBlot.tagName = 'span'
CustomTagBlot.className = 'custom-tag'

// 注册自定义格式
Quill.register(CustomTagBlot)

export default CustomTagBlot
