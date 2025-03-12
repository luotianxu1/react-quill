import Quill from 'quill'

const Inline = Quill.import('blots/inline')

class BackgroundBlot extends Inline {
    static create(value) {
        const node = super.create()
        node.style.backgroundColor = value
        return node
    }

    static formats(node) {
        return node.style.backgroundColor || undefined
    }

    optimize(context) {
        super.optimize(context)
        // 如果没有背景色值，移除节点
        if (!this.domNode.style.backgroundColor) {
            this.unwrap()
        }
    }

    format(name, value) {
        if (name === 'background') {
            if (value) {
                this.domNode.style.backgroundColor = value
            } else {
                this.domNode.style.backgroundColor = ''
            }
        } else {
            super.format(name, value)
        }
    }
}

BackgroundBlot.blotName = 'background'
BackgroundBlot.tagName = 'span'

// 注册背景色格式
Quill.register(BackgroundBlot)

export default BackgroundBlot
