import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { ChefLogin } from 'Pages/ChefLogin'
import { ChefRegister } from 'Pages/ChefRegister'
import { CustomerLogin } from 'Pages/CustomerLogin'
import { CustomerRegister } from 'Pages/CustomerRegister'
import OrderingPage from 'Pages/OrderingPage'
import ChefPage from 'Pages/ChefPage'
import { UserProvider } from 'Pages/UserContext'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/chef-login" exact component={ChefLogin} />
                <Route path="/chef-register" exact component={ChefRegister} />
                <Route path="/customer-login" exact component={CustomerLogin} />
                <Route path="/customer-register" exact component={CustomerRegister} />
                <Route path="/place-order" exact>
                    <OrderingPage/>
                </Route>
                <Route path="/chef" exact>
                    <ChefPage/>
                </Route>
            </Switch>
        </HashRouter>
    )
}

render(
    <UserProvider>
        <Layout />
    </UserProvider>
    , document.getElementById('root')
)
