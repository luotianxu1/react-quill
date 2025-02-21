import Quill from 'quill'

const Block = Quill.import('blots/block')

class CustomStyleBlot extends Block {
    static create(value) {
        const node = super.create()
        // 只在value不为null或undefined时设置label属性
        if (value !== null && value !== undefined) {
            node.setAttribute('label', value)
            // 确保空内容时也有一个不可见的空格
            if (!node.textContent) {
                node.innerHTML = '&#8203;' // 使用零宽空格
            }
        }
        return node
    }

    static formats(node) {
        // 如果label属性存在，即使是空字符串也返回
        const label = node.getAttribute('label')
        return label !== null ? label : undefined
    }

    // 添加删除方法
    deleteAt(index, length) {
        const textLength = this.domNode.textContent.length
        super.deleteAt(index, length)

        // 如果删除后内容为空或只剩零宽空格，移除标签
        const remainingText = this.domNode.textContent
        if (
            remainingText === '' ||
            remainingText === '\u200B' ||
            (index === 0 && length >= textLength)
        ) {
            this.domNode.removeAttribute('label')
            // 同时移除零宽空格
            if (remainingText === '\u200B') {
                this.domNode.textContent = ''
            }
        }
    }

    // 重写 split 方法来控制换行行为
    split(index, force) {
        const clone = super.split(index, force)

        // 确保新的块不会继承label属性
        if (clone) {
            // 移除label属性
            clone.domNode.removeAttribute('label')

            // 重置格式
            if (clone.domNode.getAttribute('class')) {
                clone.domNode.removeAttribute('class')
            }
        }

        return clone
    }

    length() {
        const length = super.length()
        // 如果有label属性，即使内容为空也返回1
        if (this.domNode.hasAttribute('label')) {
            return Math.max(length, 1)
        }
        return length
    }

    optimize(context) {
        super.optimize(context)

        // 只在内容完全为空时移除标签
        const text = this.domNode.textContent
        if (
            (text === '' || text === '\u200B') &&
            this.domNode.hasAttribute('label')
        ) {
            this.domNode.removeAttribute('label')
            this.domNode.textContent = ''
            if (typeof context.optimize === 'function') {
                context.optimize()
            }
        }
    }
}

CustomStyleBlot.blotName = 'customStyle'
CustomStyleBlot.tagName = 'p'

// 注册自定义格式
Quill.register(CustomStyleBlot)

export default CustomStyleBlot
