import React, { Component } from 'react';

import {extent, max, merge} from 'd3-array'
import {scaleLinear, schemeCategory20, scaleOrdinal} from 'd3-scale'
import {line} from 'd3-shape'
import {voronoi} from 'd3-voronoi'
const margins = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}
const width = window.innerWidth * 0.8 + margins.left + margins.right
const height = window.innerHeight * 0.8 + margins.top + margins.bottom

export default class Stack extends Component {
  constructor(props) {
    super(props)

    this.state ={
      selectedGame: null
    }
  }
  _mouseOver = (data) => {
    return () => {
      console.log(data)
      this.setState({
        selectedGame: data
      })
    }
  }

  _getTooltip(colors) {
    if (!this.state.selectedGame) {
      return null
    }

    return (
      <div style={{fontSize: '2em', color: colors(this.state.selectedGame.game)}}>
        {`${this.state.selectedGame.game} ${this.state.selectedGame.count} cumulative games as of ${this.state.selectedGame.time.format('MMM Do HH:mm')}`}
      </div>
    )
  }

  render() {
    console.log(this.props.data)
    const yScaleMax = max(this.props.data, machine => machine.values.length)
    const xExtent = extent(this.props.allGames, game => game.time.valueOf())
    console.log(xExtent)

    const xScale = scaleLinear()
      .domain(xExtent)
      .range([0, width])

    const yScale = scaleLinear()
      .domain([0, yScaleMax])
      .range([0, height])

    const colors = scaleOrdinal(schemeCategory20)

    const x = d => xScale(d.time.valueOf())
    const y = d => height - yScale(d.count)
    const lineGen = line()
      .x(x)
      .y(y)

    const voronoiGen = voronoi()
      .x(x)
      .y(y)
      .extent([[-margins.left, -margins.top], [width + margins.right, height + margins.bottom]]);

    const lines = this.props.data.map(machine => {
      const path = lineGen(machine.cumulativeGames)
      const color = colors(machine.key)
      const points = machine.cumulativeGames.map(g => {
        const x = xScale(g.time.valueOf())
        const y = height - yScale(g.count)
        return [x, y]
      })
      const selected = this.state.selectedGame && this.state.selectedGame.game === machine.key
      const strokeWidth = selected ? 3 : 1
      return <path
        fill='none'
        key={machine.key}
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    })

    const voronoiPaths = voronoiGen.polygons(
      merge(this.props.data.map(function(d) { return d.values; }))
    ).map((path, i) => {
      return <path key={i} d={path ? "M" + path.join("L") + "Z" : null}
        fill='transparent'
        onMouseOver={this._mouseOver(path.data)}
      />
    })

    const legend = this.props.data.map(machine => {
      return <span key={machine.key} style={{color: colors(machine.key)}}>{machine.key} </span>
    })

    return (
      <div className="Stack">

        <svg width={width} height={height}>
          <g transform={`translate(${margins.left}, ${margins.top})`}>
            {lines}
            {voronoiPaths}
          </g>
        </svg>
        {this._getTooltip(colors)}
        <div className='legend'>{legend}</div>
      </div>
    );
  }
}

