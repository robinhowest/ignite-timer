import { Routes, Route } from 'react-router-dom'
import { History } from './pages/History'
import { Home } from './pages/Home'
import { DefautLayout } from './layouts/DefautLayout'

export function Router() {
    return(
        <Routes>
            <Route  path="/" element={<DefautLayout/>}>
              <Route path="/" element={<Home/>}/>
              <Route path="/history" element={<History/>}/>
            </Route>
        </Routes>
    )
}