
import { ResponsivePie } from '@nivo/pie'

export const PieChart = (
    { data,
        arcLinkLabelsTextColor =
        '#333333'
        ,
        arcLabelsTextColor = {
            from: 'color',
            modifiers: [
                [
                    'darker',
                    '3'
                ]
            ]
        },
        colors = { scheme: "dark2" },
        theme = {
            axis: {
                legend: {
                    text: {
                        fontSize: "15px",
                    }
                }
            },
            fontSize: "13px",
            fontFamily: "Proxima Nova Ligth",
            tooltip: {
                container: {
                    background: '#000000',
                },
            },
        },
        arcLinkLabel = "value",
        tooltip = ({ datum: { id, value, color } }) => (
            <div
                style={{
                    padding: "0.5rem 1rem",
                    color: "#ffffff",
                    background: '#222222',
                    display: "flex",
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontFamily: "Proxima Nova Ligth"
                }}
            >
                <div
                    style={{
                        backgroundColor: color,
                        height: "10px",
                        aspectRatio: 1 / 1,
                        marginRight: "5px"
                    }}
                >

                </div>
                <strong style={{ fontWeight: 'lighter' }}>
                    {id}: {value}
                </strong>
            </div>
        ),
        formattedValue = function (e) { return e.id + " (" + e.value + ")" },
        margin = { top: 40, right: 80, bottom: 80, left: 80 },
        stylesPie = { padAngle: 1, cornerRadius: 6, activeOuterRadiusOffset: 13 },
        arrowStyles = { SkipAngle: 0, Offset: -5, DiagonalLength: 15, StraightLength: 7, Thickness: 2, RadiusOffset: 0.6 },
        callbackFunction = ()=>{return null},
        legends_styles= [
            {
                anchor: "right",
                direction: 'column',
                justify: false,
                translateX: -10,
                translateY: 52,
                itemsSpacing: 5,
                itemWidth: 10,
                itemHeight: 18,
                itemTextColor: '#ffffff',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                        }
                    }
                ]
            }
        ]
    }
) => (
    <ResponsivePie
        onClick={callbackFunction}
        colors={colors}
        theme={theme}
        tooltip={tooltip}
        data={data}
        margin={margin}
        padAngle={stylesPie.padAngle}
        cornerRadius={stylesPie.cornerRadius}
        activeOuterRadiusOffset={stylesPie.activeOuterRadiusOffset}
        borderWidth={2}
        borderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    '1.6'
                ]
            ]
        }}
        arcLabel={formattedValue}
        arcLinkLabel={arcLinkLabel}
        arcLinkLabelsSkipAngle={arrowStyles.SkipAngle}
        arcLinkLabelsTextColor={arcLinkLabelsTextColor}
        arcLinkLabelsOffset={arrowStyles.Offset}
        arcLinkLabelsDiagonalLength={arrowStyles.DiagonalLength}
        arcLinkLabelsStraightLength={arrowStyles.StraightLength}
        arcLinkLabelsThickness={arrowStyles.Thickness}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsRadiusOffset={arrowStyles.RadiusOffset}
        arcLabelsTextColor={arcLabelsTextColor}
        legends={legends_styles}
    />
)