import AppRouter from '@/router';
import useUiStore from '@/store/uiStore';
import { baseTokens } from '@/styles/antd-theme-config';
import { App as AntApp, theme as antdThemeDefault, ConfigProvider } from 'antd';
import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import GlobalLoader from './components/GlobalLoader';
import GlobalErrorDisplay from './components/GlobalErrorDisplay';

const { defaultAlgorithm, darkAlgorithm } = antdThemeDefault;

function App() {
  const currentThemeMode = useUiStore(state => state.theme);

  const antdConfig = useMemo(() => ({
    token: {
      ...baseTokens,
    },
    components: {
      Layout: {
        siderBg: 'rgb(121, 0, 0)',
      },
      Menu: {
        darkItemBg: 'rgb(121, 0, 0)',
        darkSubMenuItemBg: 'rgb(121, 0, 0)',
        darkItemSelectedBg: 'rgb(216, 144, 0)'
      },
    },
    algorithm: currentThemeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
  }), [currentThemeMode]);

  return (
    <ConfigProvider theme={antdConfig}>
      <AntApp>
        <BrowserRouter>
          <AppRouter />
          <GlobalLoader />
          <GlobalErrorDisplay />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;