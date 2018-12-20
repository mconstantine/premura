import ReactDOM from 'react-dom'

export default async function testComponent(Component, test = () => {}) {
  const div = document.createElement('div')
  const instance = ReactDOM.render(Component, div)

  await test(instance)
  ReactDOM.unmountComponentAtNode(div)
}
