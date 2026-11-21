import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import { domMax, LazyMotion, MotionConfig } from "motion/react";
import { AppRouter } from "@/app/AppRouter";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { LoadingScreen } from "@/components/molecules/LoadingScreen";
import { persistor, store } from "@/redux/store";

export function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <LazyMotion features={domMax} strict>
          <MotionConfig reducedMotion="user">
            <BrowserRouter>
              <ErrorBoundary>
                <AppRouter />
              </ErrorBoundary>
            </BrowserRouter>
          </MotionConfig>
        </LazyMotion>
      </PersistGate>
    </Provider>
  );
}
