import Quill from 'quill'

const Parchment = Quill.import('parchment')

// 创建一个对齐方式样式属性
class AlignAttributor extends Parchment.StyleAttributor {
    constructor() {
        super('align', 'text-align', {
            scope: Parchment.Scope.BLOCK,
        })
    }

    add(node, value) {
        // 设置行内样式
        if (value === 'center') {
            node.style.textAlign = 'center'
        } else if (value === 'right') {
            node.style.textAlign = 'right'
        } else if (value === 'justify') {
            node.style.textAlign = 'justify'
        } else {
            node.style.textAlign = 'left'
        }
        return true
    }

    remove(node) {
        node.style.textAlign = ''
    }

    value(node) {
        return node.style.textAlign || ''
    }
}

const align = new AlignAttributor()

// 注册对齐方式格式
Quill.register({
    'formats/align': align,
})

export default align 