import "./Message.css"

const Message = ({ message, type = "info" }) => {
  return (
    <div className={`message message-${type}`}>
      <p>{message}</p>
    </div>
  )
}

export default Message
