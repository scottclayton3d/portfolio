import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import BulletHellGame from "./components/game/BulletHellGame";
import ModelViewer3D from "./components/ui/ModelViewer3D";
import ProjectCard from "./components/ui/ProjectCard";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "ihXSJCuT1HG7d2a4FFRhMH",
      token: "tSuGS2V5gAhW91DX2ENr8gmfqyydU7ZFQpPf6ZpyJhCIRuqAwuEEv9KTjk2pyzNxX9DtE2i5H2ekYtXBw",
    },
  ],

  // By default Plasmic will use the last published version of your project.
  // For development, you can set preview to true, which will use the unpublished
  // project, allowing you to see your designs without publishing.  Please
  // only use this for development, as this is significantly slower.
  preview: false,
});

// You can register any code components that you want to use here; see
// https://docs.plasmic.app/learn/code-components-ref/
// And configure your Plasmic project to use the host url pointing at
// the /plasmic-host page of your nextjs app (for example,
// http://localhost:3000/plasmic-host).  See
// https://docs.plasmic.app/learn/app-hosting/#set-a-plasmic-project-to-use-your-app-host

// PLASMIC.registerComponent(...);
PLASMIC.registerComponent(BulletHellGame, {
  name: 'BulletHellGame',
  props: {
    className:'string',
  }
});
PLASMIC.registerComponent(ProjectCard, {
  name: 'ProjectCard',
  props: {
    project: 'object',
    className:'string',
  }
});
PLASMIC.registerComponent(ModelViewer3D, {
  name: 'ModelViewer3D',
  props: {
    modelPath: 'string',
    backgroundColor: 'string',
    autoRotate: 'boolean',
    className: 'string',
    scale: 'number',
    position: 'object',
    rotation: 'object',
  }
});
