import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import App from './App.jsx';

// 1. Creamos el tema global
const theme = createTheme({
  typography: {
    // Le decimos a MUI que use Montserrat para toda la tipografía
    fontFamily: [
      'Montserrat',
      'sans-serif',
    ].join(','),
  },
  // Opcional: También podemos forzar que los enlaces hereden la fuente
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: 'Montserrat, sans-serif',
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolvemos la app con el ThemeProvider */}
    <ThemeProvider theme={theme}>
      {/* CssBaseline ayuda a resetear márgenes y aplicar el fondo del body correctamente */}
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);