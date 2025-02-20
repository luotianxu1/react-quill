import Quill from 'quill'

const Block = Quill.import('blots/block')

class CustomStyleBlot extends Block {
    static create(value) {
        const node = super.create()
        node.setAttribute('label', value)
        return node
    }

    static formats(node) {
        return node.getAttribute('label')
    }

    // 重写 split 方法来控制换行行为
    split(index) {
        const clone = super.split(index)

        // 如果是换行产生的新块，移除 label 属性
        if (clone && clone.domNode) {
            clone.domNode.removeAttribute('label')
        }

        return clone
    }
}

CustomStyleBlot.blotName = 'customStyle'
CustomStyleBlot.tagName = 'p'

// 注册自定义格式
Quill.register(CustomStyleBlot)

export default CustomStyleBlot
