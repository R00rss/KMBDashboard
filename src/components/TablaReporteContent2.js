import React from 'react'
import LoadingComponent from './LoadingComponent';
const TablaReporteContent = (props) => {
    const headers = ["Fecha facturación", "Llamadas entrantes", "Contestadas", "Abandonadas", "Nivel de servicio (SVL)", "Nivel de abandono"]   
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
      }

    return (
        <div className='tabla__reporte__content'>
            
            {((props.data)==="loading") ? "":
            (isEmpty(props.data)) ? <LoadingComponent/>:
                    <div>
                        <table id="tableReporteContent-to-xls" className="table__global">
                            <thead className="">
                                <tr>
                                    {headers.map((name, key) => (<th key={key}>{name}</th>))}
                                </tr>                                
                            </thead>
                            <tbody className=''>
                                {
                                    props.data['dias'].map((cont, key) => (
                                        <tr key={key}>
                                            <td>{props.data['dias'][key]}</td>
                                            <td>{props.data['llamadas_entrantes'][key]}</td>
                                            <td>{props.data['llamadas_atendidas'][key]}</td>
                                            <td>{props.data['llamadas_abandonadas'][key]}</td>
                                            <td>{props.data['nivel_servicio'][key]}%</td>
                                            <td>{props.data['nivel_abandono'][key]}%</td>
                                        </tr>
                                    )
                                    )
                                }
                                {
                                    <tr id='trTotal'>
                                        <td id='tdTotal'>Total del reporte</td>
                                        <td id='tdTotal'>{props.data['TEntrantes']}</td>
                                        <td id='tdTotal'>{props.data['TContestadas']}</td>
                                        <td id='tdTotal'>{props.data['TAbandonadas']}</td>
                                        <td id='tdTotal'>{props.data['PServicio']}%</td>
                                        <td id='tdTotal'>{props.data['PAbandono']}%</td>
                                    </tr>

                                }

                            </tbody>
                        </table>
                    </div>
            }
        </div>
    )
}

export default TablaReporteContent