import { Navigate, Route, Routes } from 'react-router-dom'
import { CharacterLayout } from './CharacterLayout'
import { CharacterSelectScreen } from '../screens/CharacterSelectScreen'
import { CharacterSetupScreen } from '../screens/CharacterSetupScreen'
import { PlayScreen } from '../screens/PlayScreen'
import { AbilitiesScreen } from '../screens/AbilitiesScreen'
import { SpellsScreen } from '../screens/SpellsScreen'
import { LevelUpScreen } from '../screens/LevelUpScreen'
import { CharacterScreen } from '../screens/CharacterScreen'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CharacterSelectScreen />} />
      <Route path="/character/new/setup" element={<CharacterSetupScreen />} />
      <Route path="/character/:characterId" element={<CharacterLayout />}>
        {/* Play is the default screen for an open character (Section 12 of the plan). */}
        <Route index element={<Navigate to="play" replace />} />
        <Route path="play" element={<PlayScreen />} />
        <Route path="abilities" element={<AbilitiesScreen />} />
        <Route path="spells" element={<SpellsScreen />} />
        <Route path="level-up" element={<LevelUpScreen />} />
        <Route path="character" element={<CharacterScreen />} />
      </Route>
    </Routes>
  )
}
