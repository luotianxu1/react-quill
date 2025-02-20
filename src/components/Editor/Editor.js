import React, { Component } from 'react'
import Quill from 'quill'
import EditorToolbar from '../EditorToolbar/EditorToolbar'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import './Editor.css'
import '../../utils/customBlots'
import '../../utils/customTagBlot'

class Editor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
        }
        this.editorRef = React.createRef()
        this.quill = null
    }

    componentDidMount() {
        if (this.editorRef.current) {
            // 配置字号选项
            const Size = Quill.import('attributors/style/size')
            Size.whitelist = [
                '12px',
                '14px',
                '16px',
                '18px',
                '20px',
                '24px',
                '30px',
                '36px',
            ]
            Quill.register(Size, true)

            this.quill = new Quill(this.editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: {
                        container: '#toolbar',
                        handlers: {
                            customTag: () => {
                                const range = this.quill.getSelection()
                                if (range && range.length > 0) {
                                    this.quill.format('customTag', true)
                                }
                            },
                            clean: () => {
                                const range = this.quill.getSelection()
                                if (range) {
                                    this.quill.removeFormat(
                                        range.index,
                                        range.length
                                    )
                                }
                            },
                        },
                    },
                },
                placeholder: '请输入内容...',
            })

            this.quill.on('text-change', () => {
                const content = this.quill.root.innerHTML
                this.setState({ content })
                if (this.props.onChange) {
                    this.props.onChange(content)
                }
            })
        }
    }

    componentWillUnmount() {
        if (this.quill) {
            this.quill.off('text-change')
        }
    }

    render() {
        return (
            <div className='editor-wrapper'>
                <EditorToolbar />
                <div ref={this.editorRef}></div>
            </div>
        )
    }
}

export default Editor
