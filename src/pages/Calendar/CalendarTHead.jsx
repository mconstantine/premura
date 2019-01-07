import React from 'react'

export default props => {
  const res = []

  for (let day = -1; day < 7; day++) {
    // First cell is empty
    if (day < 0) {
      res.push(<th key={day}></th>)
      continue
    }

    const date = new Date(props.from.getTime() + 1000 * 60 * 60 * 24 * day)
    const weekday = date.toLocaleString(props.lang, {
      weekday: 'long'
    })

    res.push(
      <th key={day}>{weekday.charAt(0).toUpperCase() + weekday.substring(1)}</th>
    )
  }

  return (<thead><tr>{res}</tr></thead>)
}
