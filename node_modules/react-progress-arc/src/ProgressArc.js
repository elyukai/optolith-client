import React from 'react';

class ProgressArc extends React.Component {

  render() {
    const completed = Math.max(0, Math.min(1, this.props.completed));

    let params = {}
    params.cx = params.cy = this.props.diameter / 2;
    params.r = (this.props.diameter - ( 2 * this.props.strokeWidth )) / 2;
    params.cir = 2 * Math.PI * params.r;
    params.offset = (1 - completed) * params.cir;

    return (
      <svg width={this.props.diameter} height={this.props.diameter}>
        <circle
          className="progress-arc--bg"
          cx={params.cx}
          cy={params.cy}
          r={params.r}
          fill="none"
          stroke={this.props.background}
          strokeWidth={this.props.strokeWidth}
        />
        <circle
          className="progress-arc--fg"
          cx={params.cx}
          cy={params.cy}
          r={params.r}
          fill="none"
          stroke={this.props.stroke}
          strokeWidth={this.props.strokeWidth}
          strokeDasharray={params.cir}
          style={{
            strokeDashoffset: params.offset,
            transformOrigin: 'center center',
            transform: 'rotate(-90deg)'
          }}
      />
     </svg>
    )
  }

}

ProgressArc.defaultProps = {
  stroke: '#444',
  diameter: 50,
  background: 'transparent',
  strokeWidth: 5
}

export default ProgressArc;
