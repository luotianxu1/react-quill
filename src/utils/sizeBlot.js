import Quill from 'quill'

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
