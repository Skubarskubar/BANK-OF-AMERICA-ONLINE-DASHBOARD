import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

export function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);

  return authenticatedUser ? (
    <Dashboard
      username={authenticatedUser}
      onSignOut={() => setAuthenticatedUser(null)}
    />
  ) : (
    <LandingPage
      onLoginSuccess={(user) => setAuthenticatedUser(user)}
    />
  );
}

export default App;
