import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import Home from "./pages/Home"
import SignUp from "./pages/SignUp"
import LogIn from "./pages/LogIn"
import LoggedInRoutes from "./components/LoggedInRoutes"
import Profile from "./pages/Profile"
import CreateQuiz from "./pages/CreateQuiz"
import DashboardLayout from "./components/DashboardLayout"
import CreateQuestions from "./pages/CreateQuestions"
import AdminQuizes from "./pages/AdminQuizes"
import AttemptQuiz from "./pages/AttemptQuiz"
import QuizResult from "./pages/QuizResult"
import History from "./pages/History"
import Events from "./pages/Events"
import Students from "./pages/Students"

function App() {
  return (
    <Routes>
      {/* Public landing page — no auth required */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Old Home route removed directly, replaced by explore below */}

      <Route path="/quiz/:id" element={
        <AppShell><LoggedInRoutes><AttemptQuiz /></LoggedInRoutes></AppShell>
      } />
      <Route path="/quiz-results" element={
        <LoggedInRoutes><QuizResult /></LoggedInRoutes>
      } />

      <Route path="/dashboard">
        <Route index element={<LoggedInRoutes><DashboardLayout><Profile /></DashboardLayout></LoggedInRoutes>} />
        <Route path="explore" element={<LoggedInRoutes><DashboardLayout><Home /></DashboardLayout></LoggedInRoutes>} />
        <Route path="history" element={<LoggedInRoutes><DashboardLayout><History /></DashboardLayout></LoggedInRoutes>} />
        <Route path="create-quiz" element={<LoggedInRoutes><DashboardLayout><CreateQuiz /></DashboardLayout></LoggedInRoutes>} />
        <Route path="create-quiz/:id" element={<LoggedInRoutes><DashboardLayout><CreateQuestions /></DashboardLayout></LoggedInRoutes>} />
        <Route path="quizes" element={<LoggedInRoutes><DashboardLayout><AdminQuizes /></DashboardLayout></LoggedInRoutes>} />
        <Route path="edit-quiz/:id" element={<LoggedInRoutes><DashboardLayout><CreateQuiz /></DashboardLayout></LoggedInRoutes>} />
        <Route path="events" element={<LoggedInRoutes><DashboardLayout><Events /></DashboardLayout></LoggedInRoutes>} />
        <Route path="students" element={<LoggedInRoutes><DashboardLayout><Students /></DashboardLayout></LoggedInRoutes>} />
      </Route>
    </Routes>
  )
}

// Wrapper that provides the dark animated background for app pages
const AppShell = ({ children }) => (
  <div className="bg-animated text-white min-h-screen">
    <div className="orb hidden sm:block w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] bg-indigo-700 top-[-15%] left-[-10%]" />
    <div className="orb hidden sm:block w-[32vw] max-w-[400px] h-[32vw] max-h-[400px] bg-purple-700 bottom-[-10%] right-[-8%]" style={{ animationDelay: '4s' }} />
    <div className="orb hidden sm:block w-[24vw] max-w-[300px] h-[24vw] max-h-[300px] bg-pink-700 top-[40%] right-[5%]" style={{ animationDelay: '8s' }} />
    <div className="relative z-10 max-w-[1200px] px-4 mx-auto min-h-screen">
      {children}
    </div>
  </div>
)

export default App
