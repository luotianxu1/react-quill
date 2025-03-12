import Quill from 'quill'

const Inline = Quill.import('blots/inline')

class ColorBlot extends Inline {
    static create(value) {
        const node = super.create()
        node.style.color = value
        return node
    }

    static formats(node) {
        return node.style.color || undefined
    }

    optimize(context) {
        super.optimize(context)
        // 如果没有颜色值，移除节点
        if (!this.domNode.style.color) {
            this.unwrap()
        }
    }

    format(name, value) {
        if (name === 'color') {
            if (value) {
                this.domNode.style.color = value
            } else {
                this.domNode.style.color = ''
            }
        } else {
            super.format(name, value)
        }
    }
}

ColorBlot.blotName = 'color'
ColorBlot.tagName = 'span'
ColorBlot.className = 'ql-color' // 添加类名以便识别

// 注册颜色格式
Quill.register(ColorBlot)

export default ColorBlot
