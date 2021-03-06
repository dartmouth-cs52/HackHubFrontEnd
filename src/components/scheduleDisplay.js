// component for displaying the schedule

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSchedule, updateSchedule, createSchedule } from '../actions/index';
var d3 = require('d3');

class ScheduleDisplay extends Component {


  constructor(props) {
    super(props);

    // init component state here
    this.state = {
      TB_DISPLAY_TYPE: {
        NONE: 0,
        ONE_LINE: 1,
        MULTI_LINE_FIRST: 2,
        MULTI_LINE_SECOND: 3,
      },
    };
  }

  componentWillMount() {
    this.props.fetchSchedule();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      id: nextProps.schedule.id,
      day1: nextProps.schedule.day1,
      day2: nextProps.schedule.day2,
    });
    d3.select('#schedule').selectAll('#schedule > div').remove();

    // make both days
    this.setUpSchedule(nextProps.schedule.day1);
    this.setUpSchedule(nextProps.schedule.day2);
  }

  // refactored code courtesy of Daniel Chen - danielchen.com
  // GitHub : github.com/cheniel/pine-schedule.js
  setUpSchedule(data) {
    // add the schedule div
    const container = d3.select('#schedule');
    const div = container.append('div');
    div.attr('class', 'col-md-6');
    const table = div.append('table');
    table.style('margin', '10px;');

    const header = table.append('thead');
    header.append('td');
    const headerData = header.append('td');
    headerData.style('text-align', 'center').style('font-size', '25px');
    headerData.append('b').text(data.day_of_week);
    headerData.append('span').text(`, ${data.month} ${data.day}`);

    const dataAtTime = [];

    // add each event, skip overlapping
    data.events.forEach((e) => {
      const timeBlocksForEvent = (e.end - e.start) / 0.5;
      let timeBlockNumber = 1;
      for (let time = e.start; time < e.end; time += 0.5) {
        if (time in dataAtTime) {
          console.log(`PineSchedule: skipping event ${e.name} because overlap`);
          continue;
        }

        if (timeBlocksForEvent < 1) {
          console.log(`PineSchedule: skipping event ${e.name} because duration`);
          continue;
        }

        let timeBlockDisplayType = this.state.TB_DISPLAY_TYPE.NONE;
        if (timeBlocksForEvent === 1 && timeBlockNumber === 1) {
          timeBlockDisplayType = this.state.TB_DISPLAY_TYPE.ONE_LINE;
        } else if (timeBlocksForEvent > 1 && timeBlockNumber === 1) {
          timeBlockDisplayType = this.state.TB_DISPLAY_TYPE.MULTI_LINE_FIRST;
        } else if (timeBlocksForEvent > 1 && timeBlockNumber === 2) {
          timeBlockDisplayType = this.state.TB_DISPLAY_TYPE.MULTI_LINE_SECOND;
        }

        dataAtTime[time] = { event: e, display_type: timeBlockDisplayType };
        timeBlockNumber++;
      }
    });

    const timeBlocks = [];
    // display the timeblocks
    for (let t = data.range.start; t < data.range.end; t += 0.5) {
      const d = (dataAtTime[t] || {});
      timeBlocks.push(new TimeBlock(t, d.event, d.display_type));
    }

    table.style('width', '100%').style('border-collapse', 'collapse');
    const rows = table.selectAll('tr').data(timeBlocks).enter().append('tr').style('height', '25px');

    const timeColumn = rows.append('td')
    .style('text-align', 'right')
    .style('width', '10%')
    .style('border-right', 'solid #D3D3D3 2px')
    .style('padding-right', '5px')
    .text((d) => { return d.get_pretty_time(); });

    const valuesColumn = rows.append('td')
    .style('background-color', (d) => { return d.color(); })
    .style('padding-left', '5px')
    .html((d) => { return d.get_displayed_info(); });


    valuesColumn.style('border-right', 'solid #D3D3D3 2px');
    valuesColumn.style('border-top', (d) => { return d.get_border_top(); });
    d3.select(valuesColumn.node()).style('border-top', 'solid #D3D3D3 2px');
    d3.select(valuesColumn[valuesColumn.size() - 1]).style('border-bottom', 'solid #D3D3D3 2px');


    function TimeBlock(time, event, display_type) {
      this.time = time;
      this.event = event;
      this.display_type = display_type;
      this.is_top_of_hour = () => {
        return this.time * 10 % 10 === 0;
      };
      this.get_border_top = () => {
        if (!this.event ||
            this.display_type === 1 ||
            this.display_type === 2) {
          if (this.is_top_of_hour()) {
            return 'dotted #D3D3D3 1px';
          } else {
            return 'dashed #D3D3D3 1px';
          }
        }
      };
      this.get_pretty_time = () => {
        if (this.is_top_of_hour()) {
          if (this.time === 0 || this.time === 24) {
            return '12am';
          } else if (this.time === 12) {
            return '12pm';
          } else if (this.time < 12) {
            return `${this.time}am`;
          } else {
            return `${this.time - 12}pm`;
          }
        }
      };
      this.get_displayed_info = () => {
        if (this.event) {
          const timeRange = this.event.hasOwnProperty('time_range') ? this.event.time_range + ' | ' : '';
          const location = this.event.hasOwnProperty('location') ? '<i>' + this.event.location + '</i>' : '';
          switch (this.display_type) {
            case 1:
              return timeRange + '<b>' + this.event.name + '</b> ' + location;
            case 2:
              return timeRange + '<b>' + this.event.name + '</b>';
            case 3:
              return location;
            default:
              return null;
          }
        }
      };
      this.color = () => {
        return this.event ? this.event.color : 'white';
      };
    }
  }

  render() {
    return (
      <div>
      </div>
      );
  }
}

const mapDispatchToProps = (state) => (
  {
    schedule: state.schedule.all[0],

  }
);

export default connect(mapDispatchToProps, { fetchSchedule, updateSchedule, createSchedule })(ScheduleDisplay);
