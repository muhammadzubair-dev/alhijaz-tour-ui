import { theme } from 'antd'

const Label = ({ text, extraText }) => {
  const { token } = theme.useToken()
  return (
    <div>{text}{' '} <span style={{ fontSize: 10, color: token.colorTextDescription }}>  ({extraText})</span></div>
  )
}

export default Label