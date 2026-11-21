import { Component, type ErrorInfo, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { CloudAlert } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { GlassPanel } from "@/components/atoms/GlassPanel";
import { CHUNK_RELOAD_KEY } from "@/constants/storage-keys";

const STALE_CHUNK_PATTERN =
  /failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed/i;

interface ErrorBoundaryImplProps {
  resetKey: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/** Chunk basi setelah deploy baru: reload sekali per sesi tab. */
function reloadOnceForStaleChunk(error: Error): boolean {
  if (!STALE_CHUNK_PATTERN.test(error.message)) return false;
  try {
    if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) return false;
    sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

class ErrorBoundaryImpl extends Component<ErrorBoundaryImplProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (reloadOnceForStaleChunk(error)) return;
    console.error(error, info.componentStack);
  }

  componentDidUpdate(prevProps: ErrorBoundaryImplProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-dvh items-center justify-center bg-sky p-4">
        <GlassPanel
          role="alert"
          className="flex w-full max-w-md flex-col items-center gap-3 px-6 py-10 text-center"
        >
          <CloudAlert aria-hidden="true" strokeWidth={1.75} className="size-10 text-danger" />
          <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
          <p className="text-text-2">Halaman gagal ditampilkan. Coba lagi atau muat ulang.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Button onClick={() => this.setState({ error: null })}>Coba lagi</Button>
            <Button variant="glass" onClick={() => window.location.reload()}>
              Muat ulang
            </Button>
          </div>
        </GlassPanel>
      </div>
    );
  }
}

export function ErrorBoundary({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <ErrorBoundaryImpl resetKey={pathname}>{children}</ErrorBoundaryImpl>;
}
