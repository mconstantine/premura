import React from 'react'
import makeLogin from './make-Login'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import testComponent from './libs/test-component'

const PremuraContext = React.createContext({
  gt: {
    setLocale: () => {},
    gettext: () => {}
  }
})

const Login = makeLogin({ PremuraContext })

Enzyme.configure({ adapter: new Adapter() })

it('Should render without crashing', async () => {
  await testComponent(<Login />)
})

it('Should return data on submit', async () => {
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
  const instance = mount(<Login errors={errors} />)
  const elErrors = instance.find('.p-LoginErrors > ul')

  expect(elErrors.children().length).toBe(2)
  expect(elErrors.childAt(0).text()).toBe(errors[0])
  expect(elErrors.childAt(1).text()).toBe(errors[1])
})
