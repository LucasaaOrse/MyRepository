// components/DonutChart.tsx
import React from 'react'
import { View } from 'react-native'
import Svg, { G, Path } from 'react-native-svg'
import * as d3Shape from 'd3-shape'

type DataItem = {
  name: string
  value: number
  color: string
}

type DonutChartProps = {
  data: DataItem[]
  width: number
  height: number
  innerRadius: number
  outerRadius: number
}

export const DonutChart = ({
  data,
  width,
  height,
  innerRadius,
  outerRadius,
}: DonutChartProps) => {
  const pieGenerator = d3Shape
    .pie<DataItem>()
    .value((d) => d.value)
    .sort(null)

  const arcs = pieGenerator(data)

  const arcGenerator = d3Shape.arc<d3Shape.PieArcDatum<DataItem>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

  return (
    <View>
      <Svg width={width} height={height}>
        <G transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arc, index) => (
            <Path
              key={index}
              d={arcGenerator(arc) || ''}
              fill={arc.data.color}
            />
          ))}
        </G>
      </Svg>
    </View>
  )
}
