import Quill from 'quill'

const BlockEmbed = Quill.import('blots/block/embed')

class ImgText extends BlockEmbed {
    // 自定义视频：大小等属性
    static create(value) {
        let node = super.create()
        node.style.display = 'inline-grid'
        node.style.textAlign = 'center'
        node.style.justifyItems = 'start'
        node.style.width = '100%'
        node.style.margin = '0 auto'
        node.style.justifyContent = 'center'
        node.style.position = 'relative'

        const img = document.createElement('img')
        // 处理不同类型的值
        if (typeof value === 'string') {
            img.src = value
            this.addDragAndSelect(img)
            node.appendChild(img)
            return node
        } else if (typeof value === 'object') {
            img.src = value.url || value.src || ''
        }

        // 确保图片有有效的 src
        if (!img.src) {
            console.warn('Image source is undefined')
            return node
        }

        let titleDom
        let descDom
        if (value.text) {
            titleDom = document.createElement('span')
            titleDom.textContent = value.text
            titleDom.style.fontSize = '14px'
            titleDom.style.color = '#333'
            titleDom.style.justifySelf = 'center'
            titleDom.setAttribute('data-type', 'title')
            titleDom.setAttribute('disabled', 'true')
            titleDom.setAttribute('contenteditable', 'false')
        }
        if (value.desc) {
            descDom = document.createElement('span')
            descDom.textContent = value.desc
            descDom.style.fontSize = '16px'
            descDom.style.color = '#9A9A9A'
            descDom.style.justifySelf = 'start'
            descDom.style.textAlign = 'start'
            descDom.setAttribute('data-type', 'desc')
            descDom.setAttribute('disabled', 'true')
            descDom.setAttribute('contenteditable', 'false')
        }

        // 只有在明确设置了 link 属性时才创建链接
        if (
            value.link &&
            typeof value.link === 'string' &&
            value.link.trim() !== ''
        ) {
            const a = document.createElement('a')
            a.href = value.link
            a.target = '_self'
            a.style.display = 'inline-grid'
            a.style.textAlign = 'center'
            a.style.justifyItems = 'start'
            a.style.textDecoration = 'none'
            this.addDragAndSelect(img)
            a.appendChild(img)
            if (titleDom) {
                a.appendChild(titleDom)
            }
            if (descDom) {
                a.appendChild(descDom)
            }
            node.appendChild(a)
        } else {
            this.addDragAndSelect(img)
            node.appendChild(img)
            if (titleDom) {
                node.appendChild(titleDom)
            }
            if (descDom) {
                node.appendChild(descDom)
            }
        }
        return node
    }

    static value(node) {
        let img = node.getElementsByTagName('img')[0]
        if (!img) return null

        const imgSrc = img.getAttribute('src')
        if (!imgSrc) return null

        // 如果只有图片没有其他属性，直接返回 URL
        let textDomList = node.querySelectorAll('[data-type="title"]')
        let descDomList = node.querySelectorAll('[data-type="desc"]')
        let aDomList = node.querySelectorAll('a')

        if (!textDomList.length && !descDomList.length && !aDomList.length) {
            return imgSrc
        }

        // 否则返回完整的对象
        return {
            url: imgSrc,
            text: textDomList.length ? textDomList[0].innerHTML : null,
            desc: descDomList.length ? descDomList[0].innerHTML : null,
            link: aDomList.length ? aDomList[0].getAttribute('href') : null,
            isDescCenter: descDomList.length
                ? descDomList[0].style.justifySelf === 'center'
                : false,
        }
    }

    // 添加调整大小的功能
    static addDragAndSelect(img) {
        // 创建调整大小的控件
        const resizer = document.createElement('div')
        resizer.className = 'image-resizer'
        resizer.style.display = 'none'
        img.parentElement?.appendChild(resizer)

        // 添加选中状态的样式
        img.addEventListener('click', (e) => {
            e.stopPropagation()
            document.querySelectorAll('img').forEach((img) => {
                img.classList.remove('selected')
                const resizer =
                    img.parentElement?.querySelector('.image-resizer')
                if (resizer) {
                    resizer.style.display = 'none'
                }
            })
            img.classList.add('selected')
            resizer.style.display = 'block'
        })

        // 添加调整大小的功能
        let isResizing = false
        let startX, startY, startWidth, startHeight, ratio

        resizer.addEventListener('mousedown', (e) => {
            e.stopPropagation()
            isResizing = true
            startX = e.pageX
            startY = e.pageY
            startWidth = img.offsetWidth
            startHeight = img.offsetHeight
            ratio = startHeight / startWidth

            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener('mouseup', onMouseUp)
        })

        function onMouseMove(e) {
            if (!isResizing) return

            const width = startWidth + (e.pageX - startX)
            const height = width * ratio

            if (width >= 100) {
                img.style.width = width + 'px'
                img.style.height = height + 'px'
            }
        }

        function onMouseUp() {
            isResizing = false
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        // 点击其他地方取消选中
        document.addEventListener('click', (e) => {
            if (!img.contains(e.target) && e.target !== resizer) {
                img.classList.remove('selected')
                resizer.style.display = 'none'
            }
        })
    }
}

ImgText.blotName = 'image'
ImgText.tagName = 'imgText'

Quill.register(ImgText, true)

// 添加相关的 CSS 样式
const style = document.createElement('style')
style.textContent = `
    .selected {
        outline: 2px solid #1890ff;
    }
    .image-resizer {
        position: absolute;
        right: -6px;
        bottom: -6px;
        width: 12px;
        height: 12px;
        background-color: #1890ff;
        cursor: se-resize;
        border-radius: 50%;
        z-index: 1;
    }
    imgText {
        position: relative;
        display: block;
    }
`
document.head.appendChild(style)
