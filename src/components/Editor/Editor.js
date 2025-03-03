import React, { Component } from 'react'
import Quill from 'quill'
import EditorToolbar from '../EditorToolbar/EditorToolbar'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import './Editor.css'
import '../../utils/customBlots'
import '../../utils/customTagBlot'
import '../../utils/lineHeightBlot'
import '../../utils/sizeBlot'
import '../../utils/imageBlot'
import '../../utils/dividerBlot'

class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            quill: null,
        }
        this.editorRef = React.createRef()
    }

    componentDidMount() {
        if (this.editorRef.current) {
            const quill = new Quill(this.editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: '#toolbar',
                        handlers: {
                            customTag: () => {
                                const range = quill.getSelection()
                                if (range && range.length > 0) {
                                    quill.format('customTag', true)
                                }
                            },
                            clean: () => {
                                const range = quill.getSelection()
                                if (range) {
                                    console.log(range)

                                    // 获取当前内容
                                    const contents = quill.getContents(
                                        range.index,
                                        range.length
                                    )

                                    // 创建新的 Delta，保留图片
                                    const cleanDelta = []
                                    contents.ops.forEach((op) => {
                                        if (
                                            op.insert &&
                                            typeof op.insert === 'object' &&
                                            op.insert.image
                                        ) {
                                            // 保留图片及其所有属性
                                            cleanDelta.push(op)
                                        } else {
                                            // 清除文本格式
                                            cleanDelta.push({
                                                insert: op.insert,
                                            })
                                        }
                                    })

                                    // 使用 updateContents 替换内容
                                    quill.updateContents(
                                        [
                                            { delete: range.length },
                                            ...cleanDelta,
                                        ],
                                        'user'
                                    )
                                }
                            },
                            divider: () => {
                                const range = quill.getSelection(true)
                                if (range) {
                                    // 在当前位置插入分割线
                                    quill.insertEmbed(
                                        range.index,
                                        'divider',
                                        true,
                                        'user'
                                    )
                                    // 移动光标到分割线后面
                                    quill.setSelection(range.index + 1, 0)
                                }
                            },
                        },
                    },
                },
                placeholder: '请输入内容...',
            })

            this.setState({ quill }, () => {
                quill.root.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('editor-image')) {
                        document
                            .querySelectorAll('.editor-image')
                            .forEach((img) => {
                                img.classList.remove('selected')
                            })
                    }
                })

                quill.on('text-change', () => {
                    const content = quill.root.innerHTML
                    this.setState({ content })
                    if (this.props.onChange) {
                        this.props.onChange(content)
                    }
                })
            })
        }
    }

    componentWillUnmount() {
        if (this.quill) {
            this.quill.off('text-change')
            // 移除点击事件监听器
            this.quill.root.removeEventListener('click')
        }
    }

    render() {
        return (
            <div className='editor-wrapper'>
                <EditorToolbar quill={this.state.quill} />
                <div ref={this.editorRef}></div>
            </div>
        )
    }
}

export default Editor
