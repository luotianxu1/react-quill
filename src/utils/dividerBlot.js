import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class DividerBlot extends BlockEmbed {
    static create() {
        const node = super.create()
        // 使用行内样式替代类名
        node.style.border = 'none'
        node.style.height = '1px'
        node.style.backgroundColor = '#e8e8e8'
        node.style.margin = '1em 0'
        return node
    }
}

DividerBlot.blotName = 'divider'
DividerBlot.tagName = 'hr'

// 注册分割线格式
Quill.register(DividerBlot)

export default DividerBlot
