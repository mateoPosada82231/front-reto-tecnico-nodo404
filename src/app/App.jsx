import MainLayout from '../shared/components/MainLayout'
import { ContentProvider } from '../shared/context/ContentProvider'
import CartDrawer from '../features/cart/components/CartDrawer'
import AppRouter from './router'

function App() {
  return (
    <ContentProvider>
      <MainLayout>
        <AppRouter />
      </MainLayout>
      <CartDrawer />
    </ContentProvider>
  )
}

export default App
