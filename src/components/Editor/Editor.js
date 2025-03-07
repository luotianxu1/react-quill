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
import '../../utils/colorBlot'

// 导入 quill-better-table
import QuillBetterTable from 'quill-better-table'
import 'quill-better-table/dist/quill-better-table.css'

// 注册表格模块
Quill.register(
    {
        'modules/better-table': QuillBetterTable,
    },
    true
)

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
            // 获取 Quill 的格式优先级
            const Inline = Quill.import('blots/inline')

            // 设置格式优先级
            Inline.order = [
                'color', // 颜色最先应用
                'bold', // 然后是加粗
                'italic',
                'underline',
                'strike',
                'script',
                'link',
            ]

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
                            // 添加表格处理器
                            insertTable: () => {
                                const tableModule =
                                    quill.getModule('better-table')
                                tableModule.insertTable(3, 3)
                            },
                            insertTableRow: () => {
                                const tableModule =
                                    quill.getModule('better-table')
                                tableModule.insertRow()
                            },
                            insertTableColumn: () => {
                                const tableModule =
                                    quill.getModule('better-table')
                                tableModule.insertColumn()
                            },
                            deleteTableRow: () => {
                                const tableModule =
                                    quill.getModule('better-table')
                                tableModule.deleteRow()
                            },
                            deleteTableColumn: () => {
                                const tableModule =
                                    quill.getModule('better-table')
                                tableModule.deleteColumn()
                            },
                        },
                    },
                    'better-table': {
                        operationMenu: {
                            items: {
                                unmergeCells: {
                                    text: '拆分单元格',
                                },
                                mergeCells: {
                                    text: '合并单元格',
                                },
                                insertColumnRight: {
                                    text: '右侧插入列',
                                },
                                insertColumnLeft: {
                                    text: '左侧插入列',
                                },
                                deleteColumn: {
                                    text: '删除列',
                                },
                                insertRowUp: {
                                    text: '上方插入行',
                                },
                                insertRowDown: {
                                    text: '下方插入行',
                                },
                                deleteRow: {
                                    text: '删除行',
                                },
                                deleteTable: {
                                    text: '删除表格',
                                },
                            },
                            color: {
                                colors: ['#fff', '#e6e6e6', '#ccc'],
                                text: '背景颜色',
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

                // 添加选区变化监听
                quill.on('selection-change', (range) => {
                    if (range) {
                        // 保存当前选区
                        this.currentRange = range
                    }
                })
            })

            // 将 quill 实例暴露给全局，方便调试
            window.quill = quill
        }
    }

    componentWillUnmount() {
        if (this.quill) {
            this.quill.off('text-change')
            // 移除点击事件监听器
            this.quill.root.removeEventListener('click')
        }
    }

    // 添加获取当前选区的方法
    getCurrentRange = () => {
        const { quill } = this.state
        if (quill) {
            // 优先使用保存的选区
            return this.currentRange || quill.getSelection()
        }
        return null
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
