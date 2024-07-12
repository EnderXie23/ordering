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
import { AdminDishPage } from 'Pages/AdminPages/AdminDishPage'
import { UserProvider } from 'Pages/UserContext'
import { ChefProvider } from 'Pages/ChefContext'
import { Provider } from 'Pages/Context'
import OrderSummaryPage from 'Pages/CustomerPages/OrderSummaryPage'
import CustomerFinishPage from 'Pages/CustomerPages/CustomerFinishPage'
import OrderingMorePage from 'Pages/CustomerPages/OrderingMorePage'
import CommentPage from 'Pages/CustomerPages/CommentPage'

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
                <Route path="/admin-dish" exact>
                    <AdminDishPage />
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
                <Route path="/order-summary" exact>
                    <UserProvider>
                        <OrderSummaryPage />
                    </UserProvider>
                </Route>
                <Route path="/finish" exact>
                    <UserProvider>
                        <CustomerFinishPage />
                    </UserProvider>
                </Route>
                <Route path="/order-more" exact>
                    <UserProvider>
                        <OrderingMorePage />
                    </UserProvider>
                </Route>
                <Route path="/comment" exact>
                    <UserProvider>
                        <CommentPage />
                    </UserProvider>
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
