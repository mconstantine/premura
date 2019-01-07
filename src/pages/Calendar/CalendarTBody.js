import React from 'react'

export default props => {
  const res = []
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

  const timezoneOffset = props.from.getTimezoneOffset() / 60

  for (let time = timezoneOffset; time < 24 + timezoneOffset; time++) {
    let tds = [(
      <td key={time}>{
        new Date(
          props.from.getTime() +
          1000 * 60 * 60 * time
        ).toLocaleString(props.lang, {
          hour: '2-digit',
          minute: '2-digit'
        })
      }</td>
    )]

    for (let day = 0; day < 7; day++) {
      // Start and end of the day
      const from = new Date(
        props.from.getTime() +
        1000 * 60 * 60 * 24 * day +
        1000 * 60 * 60 * time
      )
      const to = new Date(from.getTime() + 1000 * 60 * 60)

      const activities = props.activities
      .map(a => [a, new Date(a.timeFrom), new Date(a.timeTo)])
      .filter(([, timeFrom, timeTo]) => {
        // Filters today's activities
        return (isSameDay(timeFrom, from) || isSameDay(timeTo, to)) &&
          (timeFrom.getTime() <= from.getTime() && timeTo.getTime() >= to.getTime())
      })

      if (activities.length) {
        activities.forEach(([a, timeFrom, timeTo]) => {
          // Since we use rowSpan for activities that take more than one hour, we need
          // to print nothing if there is an activity for this hour but it started before
          const isStarting = timeFrom.getTime() === from.getTime()

          if (!isStarting) {
            return
          }

          const duration = Math.floor((timeTo.getTime() - timeFrom.getTime()) / (1000 * 60 * 60))

          tds.push(
            <td
              key={time.toString() + day.toString()}
              rowSpan={duration}
              className="p-PageCalendar-main-table-cell"
            >{
              <h4>{a.title}</h4>
            }</td>
          )
        })
      } else {
        // No activities for this hour
        tds.push(
          <td
            key={time.toString() + day.toString()}
            className="p-PageCalendar-main-table-placeholder"
          />
        )
      }
    }

    res.push(<tr key={time}>{tds}</tr>)
  }

  return (<tbody>{res}</tbody>)
}
