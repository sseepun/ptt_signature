import { Suspense, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';

import PageLoading from '../views/auth/PageLoading';
import SignInPage from '../views/auth/SignInPage';

export default function RouteFrontend() {
  const { status } = useContext(AuthContext);
  
  return status === 'unauthenticated'? (<>
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </Suspense>
  </>): (<></>);
}