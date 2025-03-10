import Quill from 'quill'

const Parchment = Quill.import('parchment')

// 创建一个缩进样式属性
class IndentAttributor extends Parchment.StyleAttributor {
    constructor() {
        super('indent', 'padding-left', {
            scope: Parchment.Scope.BLOCK,
        })
    }

    add(node, value) {
        // 将缩进值转换为像素
        const indent = parseInt(value, 10) * 2
        node.style.paddingLeft = `${indent}em`
        return true
    }

    remove(node) {
        node.style.paddingLeft = ''
    }

    value(node) {
        const paddingLeft = node.style.paddingLeft || '0'
        // 将像素值转换回缩进级别
        const value = parseInt(paddingLeft, 10) / 2
        return value || undefined
    }
}

const indent = new IndentAttributor()

// 注册缩进格式
Quill.register({
    'formats/indent': indent,
})

export default indent 