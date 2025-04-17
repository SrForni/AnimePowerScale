Estructura frontend:

/app
  /login
    page.tsx               # Pantalla de Login
  /signup
    page.tsx               # Pantalla de Registro

  /game
    layout.tsx             # Layout específico para el juego si quieres
    page.tsx               # Página principal del juego
    /select-mode
      page.tsx             # Selección de anime y dificultad
    /result
      page.tsx             # Resultados de la partida

  /rankings
    page.tsx               # Ranking global

  /history
    page.tsx               # Historial de partidas del usuario

  /stats
    page.tsx               # Estadísticas del usuario

  /settings
    page.tsx               # Configuración de usuario

  /help
    page.tsx               # Página de ayuda / cómo jugar

  layout.tsx               # Layout general con menú lateral
  page.tsx                 # Página inicial, redirige o muestra bienvenida

/components
  Layout.tsx               # Layout con menú lateral
  Sidebar.tsx              # Menú lateral
  GameBoard.tsx            # Tablero de juego
  CharacterCard.tsx        # Carta del personaje actual
  PositionSelector.tsx     # Selector de posición o drag and drop
  ResultsSummary.tsx       # Resumen de resultados de la partida
  ModeSelector.tsx         # Selección de anime + dificultad
  StatsOverview.tsx        # Componente para stats de usuario
  HistoryList.tsx          # Lista de partidas jugadas
  RankingTable.tsx         # Tabla de rankings globales
  SettingsForm.tsx         # Formulario de ajustes

/hooks
  useGame.ts               # Lógica principal del juego
  useAuth.ts               # Hook de autenticación

/lib
  api.ts                   # Funciones de API
  auth.ts                  # Funciones relacionadas con la autenticación

/styles
  globals.css              # Tailwind base
  animations.css           # Animaciones personalizadas

/public
  /images                  # Recursos estáticos

/types
  index.ts                 # Tipados globales (Character, User, GameResult, etc.)

/utils
  helpers.ts               # Utilidades generales
  validations.ts           # Validaciones de formularios

/middleware.ts             # Middleware de autenticación (protegemos rutas privadas)
