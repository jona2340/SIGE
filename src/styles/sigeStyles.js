// src/styles/sigeStyles.js

export const sigeStyles = {
  // Contenedor principal de la página
  pageContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: '#f0f7f9'
  },
  
  // Estilo base para el Header
  header: {
    bgcolor: '#00897b',
    color: 'white',
    py: 2,
    px: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  // Contenedor central para alinear las tarjetas
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 3
  },
  
  // Tarjetas blancas (Login/Registro)
  authCard: {
    width: '100%',
    borderRadius: 3,
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
  },
  
  // Inputs grises redondeados
  inputField: {
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    '& fieldset': { border: 'none' },
    '& input': { padding: '12px 14px' }
  },
  
  // Botón principal verde
  primaryButton: {
    bgcolor: '#00897b',
    py: 1.5,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: '1rem',
    '&:hover': { bgcolor: '#007064' }
  },

  // Botón oscuro (ej. para Docentes)
  darkButton: {
    bgcolor: '#1e1e2d',
    py: 1.5,
    borderRadius: 2,
    textTransform: 'none',
    fontSize: '1rem',
    '&:hover': { bgcolor: '#2c2c3f' }
  }
};