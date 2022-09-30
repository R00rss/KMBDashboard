import { ResponsiveBar } from '@nivo/bar'

export const BarChart =
    ({ data,
        padding = 0.2,
        legend = { left: "Cantidad llamadas", bottom: "Agentes" },
        keys = ['Cantidad Atendidas', 'Cantidad Abandonadas', 'Cantidad Fantasmas'],
        theme = {
            axis: {
                legend: {
                    text: {
                        fontSize: "1.5vw",
                    }
                }
            },
            textColor: 'var(--selects-font-colors)',
            fontSize: "0.93vw",
            fontFamily: "Proxima Nova Ligth"
        }
    }) => {
        if ("id" in data[0]) {
            console.log("la data es:", data)
            return <ResponsiveBar
                theme={theme}
                data={data}
                keys={keys}
                indexBy="id"
                margin={{ top: 55, right: 20, bottom: 70, left: 80 }}
                padding={padding}
                groupMode="grouped"
                valueScale={{ type: 'linear' }}
                indexScale={{ type: 'band', round: true }}
                colors={{ scheme: 'nivo' }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 12,
                        spacing: 10
                    }
                ]}
                borderColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            1.6
                        ]
                    ]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: legend.bottom,
                    legendPosition: 'middle',
                    legendOffset: 45
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: legend.left,
                    legendPosition: 'middle',
                    legendOffset: -60
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={"#969292"}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'top',
                        direction: 'row',
                        justify: false,
                        translateX: 30,
                        translateY: -30,
                        itemsSpacing: 2,
                        itemWidth: 150,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 10,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                // tooltip = {BarTooltip}
                role="application"
                ariaLabel="Nivo bar chart demo"
                barAriaLabel={function (e) { return e.id + ": " + e.formattedValue + " in country: " + e.indexValue }}
            />
        } else {

        }
    }