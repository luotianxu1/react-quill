import Quill from 'quill'

const Parchment = Quill.import('parchment')

// 创建一个行高样式属性
class LineHeightAttributor extends Parchment.StyleAttributor {
    constructor() {
        super('lineHeight', 'line-height', {
            scope: Parchment.Scope.BLOCK,
        })
    }

    add(node, value) {
        node.style.lineHeight = value
        return true
    }

    remove(node) {
        node.style.lineHeight = ''
    }

    value(node) {
        return node.style.lineHeight || ''
    }
}

const lineHeight = new LineHeightAttributor()

// 注册行高格式
Quill.register({
    'formats/lineHeight': lineHeight,
})

export default lineHeight
