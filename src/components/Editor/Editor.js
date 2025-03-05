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
import '../../utils/alignBlot'

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
                                    // 清除所有格式
                                    const formats = [
                                        'bold',
                                        'italic',
                                        'underline',
                                        'strike',
                                        'align',
                                        'header',
                                        'size',
                                        'color',
                                        'background',
                                        'font',
                                        'customStyle',
                                        'lineHeight',
                                        'indent',
                                        'list',
                                        'script', // 添加 script 格式来清除上标和下标
                                        'super', // 添加 super 格式
                                        'sub', // 添加 sub 格式
                                    ]

                                    // 清除格式
                                    formats.forEach((format) => {
                                        quill.format(format, false)
                                    })

                                    // 获取选中范围内的内容
                                    const [startNode, startOffset] =
                                        quill.getLine(range.index)
                                    const [endNode, endOffset] = quill.getLine(
                                        range.index + range.length
                                    )

                                    // 遍历所有行
                                    let currentNode = startNode
                                    while (currentNode) {
                                        // 清除当前行的样式
                                        if (
                                            currentNode.domNode &&
                                            currentNode.domNode.style
                                        ) {
                                            currentNode.domNode.removeAttribute(
                                                'style'
                                            )
                                        }

                                        // 如果到达结束行，停止遍历
                                        if (currentNode === endNode) {
                                            break
                                        }

                                        // 移动到下一行
                                        currentNode = currentNode.next
                                    }

                                    // 重新应用选区
                                    quill.setSelection(
                                        range.index,
                                        range.length,
                                        'silent'
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
                            align: (value) => {
                                const range = quill.getSelection()
                                if (range) {
                                    if (value) {
                                        quill.format('align', value)
                                    } else {
                                        // 如果没有值，设置为左对齐
                                        quill.format('align', 'left')
                                    }
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
