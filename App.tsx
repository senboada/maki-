import { StatusBar } from 'expo-status-bar';

import { MakiApp } from './src/bootstrap/MakiApp';

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <MakiApp />
    </>
  );
}
