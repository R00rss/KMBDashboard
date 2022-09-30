import { ResponsiveLine } from '@nivo/line'

export const LineChart = (
    {
        data,
        legend,
        yFormat = " >-.2f",
        tooltip = ({ point }) => (
            <div
                style={{
                    fontSize:'15px',
                    padding: "1vh 2vw",
                    color: "#ffffff",
                    background: '#111111',
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    gap: '5px',
                }}
            >
                {/* {console.log(JSON.stringify(point))} */}
                <div>Día: {point.data.x} </div>
                <div>Llamadas: {point.data.y} </div>
            </div>
        )
    }) => (
    <ResponsiveLine
        tooltip={tooltip}
        colors={{ scheme: "set1" }}
        theme={{
            axis: {
                legend: {
                    text: {
                        fontSize: "1.3vw",
                    }
                }
            },
            textColor: '#ffffff',
            fontSize: "1.2vw",
            fontFamily: "Proxima Nova Ligth"
        }}
        data={data}
        margin={{ top: 30, right: 10, bottom: 45, left: 52 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat={yFormat}
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
        lineWidth={3}
        pointSize={6}
        pointColor={{ from: 'color', modifiers: [] }}
        pointBorderWidth={0}
        pointBorderColor={{ from: 'serieColor', modifiers: [] }}
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.4}
        useMesh={true}
        legends={[
            {
                anchor: 'top',
                direction: 'row',
                justify: false,
                translateX: 90,
                translateY: -8,
                itemsSpacing: 50,
                itemDirection: 'left-to-right',
                itemWidth: 95,
                itemHeight: -10,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'square',
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
    />
)