import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingScreen } from "@/components/molecules/LoadingScreen";
import { ROUTES } from "@/constants/routes";

// Fetch chunk lazy bisa gagal karena gangguan jaringan sesaat; coba ulang beberapa kali
// sebelum menyerah ke ErrorBoundary.
function retryImport<T>(factory: () => Promise<T>, retriesLeft = 2, delayMs = 800): Promise<T> {
  return factory().catch((error) => {
    if (retriesLeft <= 0) throw error;
    return new Promise<void>((resolve) => setTimeout(resolve, delayMs)).then(() =>
      retryImport(factory, retriesLeft - 1, delayMs),
    );
  });
}

const HomePage = lazy(() =>
  retryImport(() => import("@/app/pages/HomePage").then((m) => ({ default: m.HomePage }))),
);

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
}
