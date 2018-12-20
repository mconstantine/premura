import React from 'react'
import Login from './Login'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testComponent from './libs/test-component'

Enzyme.configure({ adapter: new Adapter() })

it('renders without crashing', async () => {
  await testComponent(<Login />)
})

it('Returns the data on submit', async () => {
  const verify = jest.fn()

  await testComponent(<Login onSubmit={verify} />, instance => {
    const email = 'email'
    const password = 'password'
    const lang = 'lang'

    instance.onEmailChange({ target: { value: email } })
    instance.onPasswordChange({ target: { value: password } })
    instance.onLangChange({ target: { value: lang } })
    instance.onSubmit({ preventDefault: () => {} })

    expect(verify).toHaveBeenCalledWith({ email, password, lang })
  })
})

it('Should render errors', async () => {
  const errors = ['Error one', 'Error two']
  const instance = shallow(<Login errors={errors} />)
  const elErrors = instance.find('.p-LoginErrors > ul')

  expect(elErrors.children().length).toBe(2)
  expect(elErrors.childAt(0).text()).toBe(errors[0])
  expect(elErrors.childAt(1).text()).toBe(errors[1])
})
