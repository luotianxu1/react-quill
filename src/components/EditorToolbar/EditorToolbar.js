import React, { Component } from 'react'
import './EditorToolbar.css'

export const CUSTOM_STYLES = [
    { value: '', label: '无' },
    { value: 'highlight', label: '高亮文本' },
    { value: 'quote', label: '引用文本' },
    { value: 'note', label: '注释文本' },
]

const FONT_SIZES = [
    { value: '12px', label: '12px' },
    { value: '14px', label: '14px' },
    { value: '16px', label: '16px' },
    { value: '18px', label: '18px' },
    { value: '20px', label: '20px' },
    { value: '24px', label: '24px' },
    { value: '30px', label: '30px' },
    { value: '36px', label: '36px' },
]

const LINE_HEIGHTS = [
    { value: '1', label: '1' },
    { value: '1.2', label: '1.2' },
    { value: '1.5', label: '1.5' },
    { value: '1.75', label: '1.75' },
    { value: '2', label: '2' },
    { value: '2.5', label: '2.5' },
    { value: '3', label: '3' },
]

// 使用 Quill 默认的颜色
const COLORS = [
    '#000000',
    '#e60000',
    '#ff9900',
    '#ffff00',
    '#008a00',
    '#0066cc',
    '#9933ff',
    '#ffffff',
    '#facccc',
    '#ffebcc',
    '#ffffcc',
    '#cce8cc',
    '#cce0f5',
    '#ebd6ff',
    '#bbbbbb',
    '#f06666',
    '#ffc266',
    '#ffff66',
    '#66b966',
    '#66a3e0',
    '#c285ff',
    '#888888',
    '#a10000',
    '#b26b00',
    '#b2b200',
    '#006100',
    '#0047b2',
    '#6b24b2',
    '#444444',
    '#5c0000',
    '#663d00',
    '#666600',
    '#003700',
    '#002966',
    '#3d1466',
]

class EditorToolbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showCustomStyleDropdown: false,
            currentStyle: CUSTOM_STYLES[0],
            showColorDropdown: false,
            currentColor: '#000000',
            customColor: '',
        }
        this.colorPickerRef = React.createRef()
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside)

        // 使用 props 中的 quill
        if (this.props.quill) {
            this.props.quill.on('selection-change', (range) => {
                if (range) {
                    const format = this.props.quill.getFormat(range)
                    // 更新当前选中的样式
                    const currentStyle =
                        CUSTOM_STYLES.find(
                            (style) => style.value === format.customStyle
                        ) || CUSTOM_STYLES[0]
                    this.setState({ currentStyle })
                }
            })
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside)
    }

    handleClickOutside = (event) => {
        const dropdown = document.querySelector('.custom-style-dropdown')
        if (dropdown && !dropdown.contains(event.target)) {
            this.setState({ showCustomStyleDropdown: false })
        }

        if (
            this.colorPickerRef.current &&
            !this.colorPickerRef.current.contains(event.target)
        ) {
            this.setState({
                showColorDropdown: false,
                customColor: '',
            })
        }
    }

    toggleCustomStyleDropdown = () => {
        this.setState((prevState) => ({
            showCustomStyleDropdown: !prevState.showCustomStyleDropdown,
        }))
    }

    handleCustomStyleSelect = (value, label) => {
        this.setState({
            currentStyle: { value, label },
            showCustomStyleDropdown: false,
        })

        // 使用 props 中的 quill
        const { quill } = this.props

        if (quill) {
            const range = quill.getSelection(true)

            if (range) {
                if (value === '') {
                    quill.format('customStyle', false)
                } else {
                    console.log(label)

                    quill.format('customStyle', value)
                }
            }
        }
    }

    // 添加颜色下拉框处理函数
    toggleColorDropdown = () => {
        this.setState((prevState) => ({
            showColorDropdown: !prevState.showColorDropdown,
        }))
    }

    handleColorSelect = (value) => {
        this.setState({
            currentColor: value,
            showColorDropdown: false,
        })

        const { quill } = this.props
        if (quill) {
            const range = quill.getSelection(true)
            if (range) {
                quill.format('color', value)
            }
        }
    }

    handleCustomColorSubmit = () => {
        const color = this.state.customColor
        // 验证颜色值是否合法
        if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
            this.setState({
                currentColor: color,
                showColorDropdown: false,
                customColor: '', // 清空输入框
            })

            const { quill } = this.props
            if (quill) {
                // 先聚焦编辑器
                quill.focus()

                // 获取选区
                let range = quill.getSelection()
                if (!range) {
                    // 如果没有选区，创建一个新的选区
                    range = { index: 0, length: 0 }
                    quill.setSelection(range)
                }

                // 应用颜色
                quill.format('color', color)
            }
        } else {
            alert('请输入正确的颜色格式，例如：#FF0000')
        }
    }

    handleCustomColorCancel = () => {
        this.setState({
            showColorDropdown: false,
            customColor: '',
        })
    }

    render() {
        return (
            <div id='toolbar'>
                {/* 基本格式 */}
                <span className='ql-formats'>
                    <button className='ql-bold'></button>
                    <button className='ql-italic'></button>
                    <button className='ql-underline'></button>
                    <button className='ql-strike'></button>
                    {/* 添加上标和下标按钮 */}
                    <button className='ql-script' value='super'></button>
                    <button className='ql-script' value='sub'></button>
                </span>

                {/* 自定义样式 - 改为按钮和下拉框 */}
                <span className='ql-formats custom-style-dropdown'>
                    <button
                        type='button'
                        className='ql-customStyle custom-style-button'
                        onClick={this.toggleCustomStyleDropdown}
                    >
                        {this.state.currentStyle.label}
                    </button>
                    {this.state.showCustomStyleDropdown && (
                        <div className='custom-style-menu'>
                            {CUSTOM_STYLES.map((style) => (
                                <div
                                    key={style.value}
                                    className={`custom-style-item ${
                                        this.state.currentStyle.value ===
                                        style.value
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        this.handleCustomStyleSelect(
                                            style.value,
                                            style.label
                                        )
                                    }
                                >
                                    {style.label}
                                </div>
                            ))}
                        </div>
                    )}
                </span>

                {/* 自定义标签按钮 */}
                <span className='ql-formats'>
                    <button className='ql-customTag' value='tag'>
                        标签
                    </button>
                </span>

                {/* 标题 */}
                <span className='ql-formats'>
                    <select className='ql-header' defaultValue=''>
                        <option value='1'>标题1</option>
                        <option value='2'>标题2</option>
                        <option value='3'>标题3</option>
                        <option value=''>正文</option>
                    </select>
                </span>

                {/* 字体大小 */}
                <span className='ql-formats'>
                    <select className='ql-size' defaultValue='16px'>
                        {FONT_SIZES.map((size) => (
                            <option key={size.value} value={size.value}>
                                {size.label}
                            </option>
                        ))}
                    </select>
                </span>

                {/* 颜色 */}
                <span className='ql-formats'>
                    <div
                        className='color-picker-container'
                        ref={this.colorPickerRef}
                    >
                        <button
                            type='button'
                            className='color-button'
                            onClick={this.toggleColorDropdown}
                            style={{ color: this.state.currentColor }}
                        >
                            A
                        </button>
                        {this.state.showColorDropdown && (
                            <div className='color-dropdown'>
                                <div className='color-grid'>
                                    {COLORS.map((color) => (
                                        <div
                                            key={color}
                                            className='color-item'
                                            onClick={() =>
                                                this.handleColorSelect(color)
                                            }
                                        >
                                            <span
                                                className='color-preview'
                                                style={{
                                                    backgroundColor: color,
                                                }}
                                                title={color}
                                            ></span>
                                        </div>
                                    ))}
                                </div>
                                <div className='color-input-container'>
                                    <input
                                        type='text'
                                        className='color-input'
                                        placeholder='#000000'
                                        value={this.state.customColor}
                                        onChange={(e) =>
                                            this.setState({
                                                customColor: e.target.value,
                                            })
                                        }
                                    />
                                    <div className='color-input-buttons'>
                                        <div
                                            className='color-input-button'
                                            onClick={
                                                this.handleCustomColorSubmit
                                            }
                                        >
                                            确定
                                        </div>
                                        <div
                                            className='color-input-button'
                                            onClick={
                                                this.handleCustomColorCancel
                                            }
                                        >
                                            取消
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <select className='ql-background'>
                        <option value='#ffebcc'>浅橙</option>
                        <option value='#cce8cc'>浅绿</option>
                        <option value='#cce0f5'>浅蓝</option>
                        <option value='#ebd6ff'>浅紫</option>
                        <option value='#ffffff'>白色</option>
                    </select>
                </span>

                {/* 对齐方式 */}
                <span className='ql-formats'>
                    <button className='ql-align' value=''></button>
                    <button className='ql-align' value='center'></button>
                    <button className='ql-align' value='right'></button>
                    <button className='ql-align' value='justify'></button>
                </span>

                {/* 列表和缩进 */}
                <span className='ql-formats'>
                    <button className='ql-list' value='ordered'></button>
                    <button className='ql-list' value='bullet'></button>
                    <button className='ql-indent' value='-1'></button>
                    <button className='ql-indent' value='+1'></button>
                </span>

                {/* 添加分割线按钮 - 放在链接和图片按钮之前 */}
                <span className='ql-formats'>
                    <button className='ql-divider' title='分割线'>
                        ─
                    </button>
                </span>

                {/* 链接和图片 */}
                <span className='ql-formats'>
                    <button className='ql-link'></button>
                    <button className='ql-image'></button>
                </span>

                {/* 清除格式 */}
                <span className='ql-formats'>
                    <button className='ql-clean'></button>
                </span>

                {/* 行高 */}
                <span className='ql-formats'>
                    <select className='ql-lineHeight' defaultValue='1.5'>
                        {LINE_HEIGHTS.map((height) => (
                            <option key={height.value} value={height.value}>
                                {height.label}
                            </option>
                        ))}
                    </select>
                </span>
            </div>
        )
    }
}

export default EditorToolbar
