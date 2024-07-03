import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/MainTest'
import { AnotherPage } from 'Pages/AnotherPage'
import { ChefLogin } from 'Pages/ChefLogin'
import { ChefRegister } from 'Pages/ChefRegister'
import { CustomerLogin } from 'Pages/CustomerLogin'
import { CustomerRegister } from 'Pages/CustomerRegister'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/chef-login" exact component={ChefLogin} />
                <Route path="/chef-register" exact component={ChefRegister} />
                <Route path="/customer-login" exact component={CustomerLogin} />
                <Route path="/customer-register" exact component={CustomerRegister} />
                <Route path="/another" exact component={AnotherPage} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
