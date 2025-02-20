import Quill from 'quill'

const Block = Quill.import('blots/block')

class LineHeightBlot extends Block {
    static create(value) {
        const node = super.create()
        node.style.lineHeight = value
        return node
    }

    static formats(node) {
        return node.style.lineHeight || undefined
    }

    format(name, value) {
        if (name === 'lineHeight') {
            if (value) {
                this.domNode.style.lineHeight = value
            } else {
                this.domNode.style.lineHeight = ''
            }
        } else {
            super.format(name, value)
        }
    }
}

LineHeightBlot.blotName = 'lineHeight'
LineHeightBlot.tagName = 'p'

// 注册行高格式
Quill.register({
    'formats/lineHeight': LineHeightBlot,
})

export default LineHeightBlot
