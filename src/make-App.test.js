import React from 'react'
import makeApp from './make-App'
import testComponent from './libs/test-component'

const Main = () => (<div />)
const Login = () => (<div />)

let profileStatus = 200
const fakeUser = { test: true }

const client = {
  get: jest.fn(() => ({ status: profileStatus, content: fakeUser })),
  post: jest.fn(() => ({ status: 200, content: fakeUser }))
}

const App = makeApp({ client, Main, Login })

it('renders without crashing', async () => {
  await testComponent(<App />)
})

it('Should try to get the user profile when mounted', async () => {
  client.get.mockClear()
  let instance

  await testComponent(<App />, _instance => instance = _instance)

  expect(client.get).toHaveBeenCalledWith('/users/me/')
  expect(instance.state.session).toEqual(fakeUser)
})

it('Should be able to login', async () => {
  const email = 'email'
  const password = 'password'
  const lang = 'lang'

  client.post.mockClear()
  profileStatus = 401

  await testComponent(<App />, async instance => {
    await instance.login({ email, password, lang })
  })

  expect(client.post).toHaveBeenCalledWith('/users/login/', { email, password, lang })
  profileStatus = 200
})
