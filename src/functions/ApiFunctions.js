import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const getDataFromBackend = (url, setDataName) => {
  const MySwal = withReactContent(Swal)
  fetch("/api/" + url)
    .then(resp => {
      if (resp.status === 200) return (resp.json())
      else {
        MySwal.fire({
          icon: 'error',
          title: '¡Error al trata de obtener: ' + url + "!",
          text: '¡Error en el servidor,!' + String(resp.status)
        })
      }
    }
    ).then(data_ => {
      setDataName(data_)
      console.log(data_)
    });
}
export default getDataFromBackend;