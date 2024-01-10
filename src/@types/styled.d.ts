import 'styled-components'
import { type defaltTheme } from '../styles/themes/defalt'

type ThemeType = typeof defaltTheme

declare module 'styled-components' {
  export interface DefaltTheme extends ThemeType {}
}
