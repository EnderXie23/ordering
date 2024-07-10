import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { ChefLogin } from 'Pages/ChefPages/ChefLogin'
import { ChefRegister } from 'Pages/ChefPages/ChefRegister'
import { CustomerLogin } from 'Pages/CustomerPages/CustomerLogin'
import { CustomerRegister } from 'Pages/CustomerPages/CustomerRegister'
import OrderingPage from 'Pages/CustomerPages/OrderingPage'
import ChefPage from 'Pages/ChefPages/ChefPage'
import { AdminPage } from 'Pages/AdminPages/AdminPage'
import { AdminOrderPage } from 'Pages/AdminPages/AdminOrderPage'
import { UserProvider } from 'Pages/CustomerPages/UserContext'
import { ChefProvider } from 'Pages/ChefPages/ChefContext'
import { Provider } from 'Pages/Context'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/admin" exact>
                    <AdminPage />
                </Route>
                <Route path="/admin-order" exact>
                    <AdminOrderPage />
                </Route>
                <Route path="/chef-login" exact>
                    <ChefProvider> {/* Wrap ChefLogin with ChefProvider */}
                        <ChefLogin />
                    </ChefProvider>
                </Route>
                <Route path="/chef-register" exact>
                    <ChefProvider> {/* Wrap ChefRegister with ChefProvider if needed */}
                        <ChefRegister />
                    </ChefProvider>
                </Route>
                <Route path="/customer-login" exact>
                    <UserProvider> {/* Wrap CustomerLogin with CustomerProvider */}
                        <CustomerLogin />
                    </UserProvider>
                </Route>
                <Route path="/customer-register" exact>
                    <UserProvider> {/* Wrap CustomerRegister with CustomerProvider if needed */}
                        <CustomerRegister />
                    </UserProvider>
                </Route>
                <Route path="/place-order" exact>
                    <UserProvider> {/* Wrap CustomerRegister with CustomerProvider if needed */}
                        <OrderingPage />
                    </UserProvider>
                </Route>
                <Route path="/chef" exact>
                    <ChefProvider> {/* Wrap ChefPage with ChefProvider */}
                        <ChefPage />
                    </ChefProvider>
                </Route>
            </Switch>
        </HashRouter>
    )
}

render(
    <Provider>
        <Layout />
    </Provider>
    , document.getElementById('root')
)
