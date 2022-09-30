import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const alertMessage = (icon_message, title_message, text_message) => {
  const MySwal = withReactContent(Swal)
  MySwal.fire({
    icon: `${icon_message}`,
    title: `${title_message}`,
    text: `${text_message}`
  })
}

export default alertMessage;