import React from 'react'
import { render } from 'react-dom'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Main } from 'Pages/MainTest'
import { AnotherPage } from 'Pages/AnotherPage'
import { DoctorLogin } from 'Pages/DoctorLogin'
import { DoctorRegister } from 'Pages/DoctorRegister'
import { PatientLogin } from 'Pages/PatientLogin'
import { PatientRegister } from 'Pages/PatientRegister'

const Layout = () => {
    return (
        <HashRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/doctor-login" exact component={DoctorLogin} />
                <Route path="/doctor-register" exact component={DoctorRegister} />
                <Route path="/patient-login" exact component={PatientLogin} />
                <Route path="/patient-register" exact component={PatientRegister} />
                <Route path="/another" exact component={AnotherPage} />
            </Switch>
        </HashRouter>
    )
}
render(<Layout />, document.getElementById('root'))
