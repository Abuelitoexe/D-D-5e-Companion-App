import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './app/routes'
import { RulesProvider } from './app/RulesProvider'
import { CharacterStoreProvider } from './app/CharacterStoreProvider'

function App() {
  return (
    <RulesProvider>
      <CharacterStoreProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CharacterStoreProvider>
    </RulesProvider>
  )
}

export default App
