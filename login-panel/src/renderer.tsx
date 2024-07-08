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
import { AdminPage } from 'Pages/AdminPage'
import { UserProvider } from 'Pages/UserContext'
import { ChefProvider } from 'Pages/ChefContext'
import { Provider } from 'Pages/Context'
import OrderSummaryPage from 'Pages/OrderSummaryPage'
import CustomerFinishPage from 'Pages/CustomerFinishPage'
import OrderingMorePage from 'Pages/OrderingMorePage'
import CommentPage from 'Pages/CommentPage'




const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/admin" exact>
                    <AdminPage />
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
