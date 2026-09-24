import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import DocumentationPage from "./pages/DocumentationPage";
import EvaluationPage from "./pages/EvaluationPage";
import FacialDetectionPage from "./pages/FacialDetectionPage";
import LandingPage from "./pages/LandingPage";
import TextDetectionPage from "./pages/TextDetectionPage";
import VoiceDetectionPage from "./pages/VoiceDetectionPage";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const textDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/text-detection",
  component: TextDetectionPage,
});

const facialDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/facial-detection",
  component: FacialDetectionPage,
});

const voiceDetectionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/voice-detection",
  component: VoiceDetectionPage,
});

const evaluationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/evaluation",
  component: EvaluationPage,
});

const documentationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documentation",
  component: DocumentationPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  textDetectionRoute,
  facialDetectionRoute,
  voiceDetectionRoute,
  evaluationRoute,
  documentationRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
