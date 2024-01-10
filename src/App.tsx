import { ThemeProvider } from 'styled-components'
import { BrowserRouter } from 'react-router-dom'

import { defaltTheme } from './styles/themes/defalt'
import { GlobalStyle } from './styles/global'
import { Router } from './Router'

export function App () {
  return (
    <ThemeProvider theme={defaltTheme}>
      <BrowserRouter>
      <Router/>
      </BrowserRouter>
     <GlobalStyle/>
    </ThemeProvider>
  )
}
