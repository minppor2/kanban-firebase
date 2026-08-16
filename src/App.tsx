import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { RootRedirect } from './routes/RootRedirect'
import { RequireRole } from './routes/RequireRole'
import { JoinClassPage } from './features/class/JoinClassPage'
import { TeacherClassListPage } from './features/teacher/TeacherClassListPage'
import { TeacherDashboardPage } from './features/teacher/TeacherDashboardPage'
import { RosterPage } from './features/teacher/RosterPage'
import { ScheduleEditorPage } from './features/teacher/ScheduleEditorPage'
import { StudentBoardViewPage } from './features/teacher/StudentBoardViewPage'
import { StudentHomePage } from './features/student/StudentHomePage'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<RootRedirect />} />
        <Route
          path="/join"
          element={
            <RequireRole role="student">
              <JoinClassPage />
            </RequireRole>
          }
        />
        <Route
          path="/teacher"
          element={
            <RequireRole role="teacher">
              <TeacherClassListPage />
            </RequireRole>
          }
        />
        <Route
          path="/teacher/:classId"
          element={
            <RequireRole role="teacher">
              <TeacherDashboardPage />
            </RequireRole>
          }
        />
        <Route
          path="/teacher/:classId/roster"
          element={
            <RequireRole role="teacher">
              <RosterPage />
            </RequireRole>
          }
        />
        <Route
          path="/teacher/:classId/schedule"
          element={
            <RequireRole role="teacher">
              <ScheduleEditorPage />
            </RequireRole>
          }
        />
        <Route
          path="/teacher/:classId/students/:studentUid"
          element={
            <RequireRole role="teacher">
              <StudentBoardViewPage />
            </RequireRole>
          }
        />
        <Route
          path="/board"
          element={
            <RequireRole role="student">
              <StudentHomePage />
            </RequireRole>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
