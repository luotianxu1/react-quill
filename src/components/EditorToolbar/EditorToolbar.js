import React from 'react'
import './EditorToolbar.css'

const CUSTOM_STYLES = [
    { value: '', label: '无' },
    { value: 'highlight', label: '高亮文本' },
    { value: 'quote', label: '引用文本' },
    { value: 'note', label: '注释文本' },
]

const EditorToolbar = () => {
    const renderOption = (item) => (
        <option key={item.value} value={item.value} data-value={item.label}>
            {item.label}
        </option>
    )

    return (
        <div id='toolbar'>
            {/* 基本格式 */}
            <span className='ql-formats'>
                <button className='ql-bold'></button>
                <button className='ql-italic'></button>
                <button className='ql-underline'></button>
                <button className='ql-strike'></button>
            </span>

            {/* 自定义样式 */}
            <span className='ql-formats'>
                <select className='ql-customStyle' defaultValue=''>
                    {CUSTOM_STYLES.map(renderOption)}
                </select>
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
                <select className='ql-size' defaultValue=''>
                    <option value='small'>小</option>
                    <option value=''>正常</option>
                    <option value='large'>大</option>
                    <option value='huge'>超大</option>
                </select>
            </span>

            {/* 颜色 */}
            <span className='ql-formats'>
                <select className='ql-color'>
                    <option value='#e60000'>红色</option>
                    <option value='#008a00'>绿色</option>
                    <option value='#0066cc'>蓝色</option>
                    <option value='#9933ff'>紫色</option>
                    <option value='#000000'>黑色</option>
                </select>
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

            {/* 链接和图片 */}
            <span className='ql-formats'>
                <button className='ql-link'></button>
                <button className='ql-image'></button>
            </span>

            {/* 清除格式 */}
            <span className='ql-formats'>
                <button className='ql-clean'></button>
            </span>
        </div>
    )
}

export default EditorToolbar
