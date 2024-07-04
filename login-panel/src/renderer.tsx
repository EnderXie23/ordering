import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/Main'
import { ChefLogin } from 'Pages/ChefLogin'
import { ChefRegister } from 'Pages/ChefRegister'
import { CustomerLogin } from 'Pages/CustomerLogin'
import { CustomerRegister } from 'Pages/CustomerRegister'
import OrderingPage from 'Pages/OrderingPage'
import { UserProvider } from 'Pages/UserContext'

const dummyDishes = [
    { name: 'Spaghetti Carbonara', photoUrl: '/images/spaghetti_carbonara.jpg' },
    { name: 'Margherita Pizza', photoUrl: '/images/margherita_pizza.jpg' },
    { name: 'Caesar Salad', photoUrl: '/images/caesar_salad.jpg' },
    { name: 'Tiramisu', photoUrl: '/images/tiramisu.jpg' },
];

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
                    <OrderingPage customerName="Guest" dishes={dummyDishes} onSubmit={(customerName, orders) => {
                        console.log('Customer:', customerName);
                        console.log('Orders:', orders);
                    }} />
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
