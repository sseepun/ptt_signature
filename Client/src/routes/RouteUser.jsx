import { lazy, Suspense, useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';

import PageLoading from '@/views/auth/PageLoading';

export default function RouteUser() {
  const { status, user } = useContext(AuthContext);
  
  const LazyRoute = ({ dom: Element }) => <Element />;
  return status === 'authenticated'? (<>
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<LazyRoute dom={lazy(() => import('@/views/user/HomePage'))} />} />

        {/* Admin */}
        {user.isAdmin()? (<>
          <Route path="/templates" element={<LazyRoute dom={lazy(() => import('@/views/user/TemplatesPage'))} />} />
          <Route path="/template/:crud/*" element={<LazyRoute dom={lazy(() => import('@/views/user/TemplatePage'))} />} />
        
          <Route path="/users" element={<LazyRoute dom={lazy(() => import('@/views/user/UsersPage'))} />} />
        </>): (<></>)}

        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Suspense>
  </>): (<></>);
}