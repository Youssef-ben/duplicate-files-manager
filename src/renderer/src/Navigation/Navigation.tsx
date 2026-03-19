import { Navigate, Route, Routes } from 'react-router-dom'
import { APP_ROUTES, NAVIGATION_PATHS } from './routes'

export const Navigation = (): React.JSX.Element => {
  return (
    <div className="flex flex-1 p-2 pl-0">
      <div className="flex rounded-md flex-col items-center gap-4 bg-base shadow-lg w-full">
        <Routes>
          {APP_ROUTES.map((route) => {
            return <Route key={route.path} path={route.path} element={<route.component />} />
          })}
          <Route path="*" element={<Navigate replace to={NAVIGATION_PATHS.organize} />} />
        </Routes>
      </div>
    </div>
  )
}
