import React from 'react'
import { LineChart } from './Graphs/LineChart'
import { PieChart } from './Graphs/PieChart'
import "./Dashboard.css"
import SelectedCooperativa from './SelectedCooperativa'
import colors from '../functions/Constans'
const Dashboard = (props) => {
    const capitalizeFirstLetterWord = (str) => (str.charAt(0).toUpperCase() + str.slice(1))
    const capitalizeFirstLetterWords = (str) => {
        const separate_str = str.split(" ")
        let auxstr = ""
        separate_str.forEach((word, key) => {
            if (key !== separate_str.length - 1) {
                auxstr += capitalizeFirstLetterWord(word) + " "
            } else {
                auxstr += capitalizeFirstLetterWord(word)
            }
        });
        return auxstr
    }
    return (
        <div className='col-12 dashboard__container'>
            {props.data.length > 0 ?
                <>
                    <SelectedCooperativa logoname={props.dataInfo['cooperativa']} />
                    <div className="row1 col-12">
                        <div className="col-10 linechart__container">
                            <p className="line__title__container">
                                <strong>Agente </strong> {props.dataInfo['agente']} - {capitalizeFirstLetterWords(props.dataInfo['cooperativa'].toLowerCase())} -
                                <strong> Mes </strong> {props.dataInfo['mes']}
                            </p>
                            <LineChart yFormat=" >-.0f" legend={{ x: "Dias", y: "Llamadas" }} data={props.data} />
                        </div>

                    </div>
                    {props.dataPie.length > 0 ?
                        props.client === null ?
                            <>
                                <div className="row2">
                                    {props.dataPie[0].length > 0 ?
                                        <div className="piechart__container">
                                            <h1 className="pie__title__container">
                                                Historico Llamadas
                                            </h1>
                                            <PieChart
                                                arcLinkLabelsTextColor={'#ffffff'}
                                                colors={colors}
                                                data={props.dataPie[1]}
                                            />
                                        </div>
                                        : <></>}
                                    {props.dataPie[1].length > 0 ?
                                        <div className="piechart__container">
                                            <h1 className="pie__title__container">
                                                Historico Llamadas - {capitalizeFirstLetterWords(props.dataInfo['cooperativa'].toLowerCase())}
                                            </h1>
                                            <PieChart
                                                arcLinkLabelsTextColor={'#ffffff'}
                                                colors={colors}
                                                data={props.dataPie[3]} />
                                        </div>
                                        : <></>}
                                </div>
                                <div className="row2">
                                    {props.dataPie[2].length > 0 ?
                                        <div className="piechart__container">
                                            <h1 className="pie__title__container">
                                                Mensual Llamadas
                                            </h1>
                                            <PieChart
                                                arcLinkLabelsTextColor={'#ffffff'}
                                                colors={colors}
                                                data={props.dataPie[2]} />
                                        </div>
                                        : <></>}
                                    {props.dataPie[3].length > 0 ?
                                        <div className="piechart__container">
                                            <h1 className="pie__title__container">
                                                Mensual Llamadas - {capitalizeFirstLetterWords(props.dataInfo['cooperativa'].toLowerCase())}
                                            </h1>
                                            <PieChart
                                                arcLinkLabelsTextColor={'#ffffff'}
                                                colors={colors}
                                                data={props.dataPie[3]} />
                                        </div>
                                        : <></>}
                                </div>
                            </>
                            : typeof (props.client) === "string" ?
                                <>
                                    {console.log(props.client)}
                                    <div className="row2">
                                        {props.dataPie[1].length > 0 ?
                                            <div className="piechart__container">
                                                <div className="pie__title__container">
                                                    Historico Llamadas a {capitalizeFirstLetterWords(props.dataInfo['cooperativa'].toLowerCase())}
                                                </div>
                                                <PieChart
                                                    arcLinkLabelsTextColor={'#ffffff'}
                                                    colors={colors}
                                                    data={props.dataPie[3]} />
                                            </div>
                                            : <></>}
                                        {props.dataPie[3].length > 0 ?
                                            <div className="piechart__container">
                                                <div className="pie__title__container">
                                                    Mensual Llamadas a {capitalizeFirstLetterWords(props.dataInfo['cooperativa'].toLowerCase())}
                                                </div>
                                                <PieChart
                                                    arcLinkLabelsTextColor={'#ffffff'}
                                                    colors={colors}
                                                    data={props.dataPie[3]} />
                                            </div>
                                            : <></>}
                                    </div>
                                </>
                                : <></>
                        : <></>

                    }
                </>
                : <></>
            }
        </div>
    )
}

export default Dashboard