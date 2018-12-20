import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import makeMain from './make-Main'
import testComponent from './libs/test-component'

Enzyme.configure({ adapter: new Adapter() })

const Calendar = () => (<div />)
const Main = makeMain({ Calendar })

it('Should render without crashing', async () => {
  await testComponent(
    <Main session={{}} />
  )
})

it('Should be able to logout', async () => {
  const onLogout = jest.fn()
  const instance = shallow(
    <Main session={{}} onLogout={onLogout} />
  )

  instance.find('button').simulate('click')
  expect(onLogout).toHaveBeenCalled()
})
