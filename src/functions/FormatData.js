const estados_polarizacion = { neg: "Negativo", neu: "Neutro", pos: "Positivo" };
export const formDataPolarity = (obj) => {
  const auxData = []
  Object.entries(obj).forEach(([key, value], iteration) => {
    if (value > 0) {
      if (key in estados_polarizacion) {
        auxData.push({
          "id": estados_polarizacion[key],//nombre del status
          "value": (value * 100).toFixed(2), //valor del status en segundos
          "label": estados_polarizacion[key], // titulo de la legenda (valor en date time)
        })
      }
    }

  });
  return auxData
}

export function formDataToPiechart(data) {
  return data.map((item) => (
    {
      "id": item[0],
      "label": item[0],
      'value': item[1],
    }
  ))

  /*
  data input : 
    [
      [ id :string,
        cant:number
      ],
      [ id :string,
        cant:number
      ],
      .
      .
      .
    ]
  data expected:
    [
      {
        'id': string,
        'label': string,
        'value': number,
        'color': color code(string),
      },
      {
        'id': string,
        'label': string,
        'value': number,
        'color': color code(string),
      },

    ]

  */

}