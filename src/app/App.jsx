import MainLayout from '../shared/components/MainLayout'
import { ContentProvider } from '../shared/context/ContentProvider'
import AppRouter from './router'

function App() {
  return (
    <ContentProvider>
      <MainLayout>
        <AppRouter />
      </MainLayout>
    </ContentProvider>
  )
}

export default App
