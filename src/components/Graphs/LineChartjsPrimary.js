import { ResponsiveLine } from '@nivo/line'

export const LineChartPrimary = (
    {   data,
        legend,
        theme= {
            axis: {
                legend: {
                    text: {
                        fontSize: "1.2vw",
                    }
                }
            },
            fontSize: "1.1vw",
            fontFamily: "Proxima Nova Semibold"
        },
        margin = { top: 50, right: 180, bottom: 80, left: 60 },
        color = { scheme: "set1" } 
    }) => {
    if (data[0].length <= 0) {
        console.log("data in empty")
    } else {
        if("data" in data[0] && "id" in data[0] ){
            return (<ResponsiveLine
                colors={color}
                theme={theme}
                data={data}
                margin={margin}
                xScale={{ type: 'point' }}
                yScale={{
                    type: 'linear',
                    min: 'auto',
                    max: 'auto',
                    stacked: true,
                    reverse: false
                }}
                yFormat=" >-.2f"
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: legend['x'],
                    legendOffset: 36,
                    legendPosition: 'middle',
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: legend['y'],
                    legendOffset: -40,
                    legendPosition: 'middle',
                }}
                lineWidth={4}
                pointSize={7}
                pointColor={{ from: 'color', modifiers: [] }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor', modifiers: [] }}
                pointLabelYOffset={-12}
                enableArea={true}
                areaOpacity={0.6}
                useMesh={true}
                legends={[
                    {
                        anchor: 'right',
                        direction: 'column',
                        justify: false,
                        translateX: 90,
                        translateY: 0,
                        itemsSpacing: 10,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 13,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1,
                                }
                            }
                        ]
                    }
                ]}
            />)
        }
    }
}
