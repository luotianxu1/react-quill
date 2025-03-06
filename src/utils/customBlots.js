import Quill from 'quill'

const Block = Quill.import('blots/block')

class CustomStyleBlot extends Block {
    static create(value) {
        const node = super.create()

        // 设置 label 属性
        if (value) {
            node.setAttribute('label', value)
        }

        // 根据不同的值应用不同的内联样式
        switch (value) {
            case 'highlight':
                node.style.backgroundColor = '#fff3cd'
                node.style.padding = '2px 4px'
                node.style.borderRadius = '2px'
                break
            case 'quote':
                node.style.color = '#6c757d'
                node.style.fontStyle = 'italic'
                node.style.borderLeft = '3px solid #dee2e6'
                node.style.paddingLeft = '10px'
                node.style.margin = '5px 0'
                break
            case 'note':
                node.style.color = '#0066cc'
                node.style.backgroundColor = '#e6f3ff'
                node.style.padding = '2px 4px'
                node.style.borderRadius = '2px'
                node.style.fontSize = '0.9em'
                break
            default:
                break
        }

        return node
    }

    static formats(node) {
        // 优先使用 label 属性
        const label = node.getAttribute('label')
        if (label) {
            return label
        }
        return undefined
    }

    optimize(context) {
        super.optimize(context)
        // 如果没有任何样式和 label，移除节点
        if (
            !this.domNode.style.cssText &&
            !this.domNode.hasAttribute('label')
        ) {
            this.unwrap()
        }
    }

    // 修改 split 方法
    split(index, force = false) {
        const node = super.split(index, force)
        if (node && node.domNode) {
            // 确保 node 和 domNode 存在
            // 移除所有样式和 label
            node.domNode.removeAttribute('style')
            node.domNode.removeAttribute('label')
        }
        return node
    }
}

CustomStyleBlot.blotName = 'customStyle'
CustomStyleBlot.tagName = 'p' // 使用 p 标签

// 注册自定义格式
Quill.register(CustomStyleBlot)

export default CustomStyleBlot
