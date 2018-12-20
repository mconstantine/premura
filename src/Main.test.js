import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import Main from './Main'
import testComponent from './libs/test-component'

Enzyme.configure({ adapter: new Adapter() })

it('Should render without crashing', async () => {
  await testComponent(<Main />)
})

it('Should be able to logout', async () => {
  const onLogout = jest.fn()
  const instance = shallow(<Main onLogout={onLogout} />)

  instance.find('button').simulate('click')
  expect(onLogout).toHaveBeenCalled()
})
