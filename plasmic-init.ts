import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import BulletHellGame from "./components/game/BulletHellGame";
import ModelViewer3D from "./components/ui/ModelViewer3D";
import ShapeBlur from "./components/shapeBlur";
import Particles from "./components/particles";
import ASCIIText from "./components/asciText";
import { UnicornStudioEmbed } from "./components/UnicornStudioEmbed";
import { m } from "framer-motion";
import { DataGrid } from '@mui/x-data-grid';
import KeyValueGrid from "./components/KeyValueGrid";
import GlitchText from "./components/glitchText";



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
PLASMIC.registerComponent(UnicornStudioEmbed, {
  name: "UnicornStudioEmbed",
  props: {
    projectId: {
      type: "string",
      defaultValue: "v1yhIpQy3029OZVSQU3v",
    },
    width: {
      type: "number",
      defaultValue: 1440,
    },
    height: {
      type: "number",
      defaultValue: 900,
    },
    style: {
      type: "object",
      defaultValue: {},
    },
    className: {
      type: "string",
      defaultValue: "",
    },
  },
});
PLASMIC.registerComponent(BulletHellGame, {
  name: 'BulletHellGame',
  props: {
    className:'string',
  }
});
PLASMIC.registerComponent(ModelViewer3D, {
  name: 'ModelViewer3D',
  props: {
    modelUrl: 'string',
    className: 'string',
    cameraX: "number",
    cameraY: "number",
    cameraZ: "number",
  }
});
PLASMIC.registerComponent(ShapeBlur, {
  name: 'ShapeBlur',
  props: {
    className: 'string',
    variation: 'number',
    pixelRatioProp: 'number',
    shapeSize: 'number',
    roundness: 'number',
    borderSize: 'number',
    circleSize: 'number',
    circleEdge: 'number'
  }
})
PLASMIC.registerComponent(Particles, {
  name: 'Particles',
  props: {
    className:'string',
    particleCount: 'number',
    particleSpread: 'number',
    speed: 'number',
    particleColors: 'string',
    moveParticlesOnHover: 'boolean',
    particleHoverFactor: 'number',
    alphaParticles: 'boolean',
    particleBaseSize: 'number',
    sizeRandomness: 'number',
    cameraDistance: 'number',
    disableRotation: 'boolean',  
  } 
})
PLASMIC.registerComponent(ASCIIText, {
  name: 'ASCIIText',
  props: {
    className:'string',
    text: 'string',
    fontSize: 'number',
    speed: 'number',
    color: 'string',
    moveTextOnHover: 'boolean',
    textHoverFactor: 'number',
    alphaText: 'boolean',
    textBaseSize: 'number',
    sizeRandomness: 'number',
    cameraDistance: 'number',
    disableRotation: 'boolean',  
  } 
})
PLASMIC.registerComponent(KeyValueGrid, {
  name: "KeyValueGrid",
  props: {
    data: {
      type: "array",
      displayName: "Key-Value Data",
      itemType: {
        type: "object",
        fields: {
          key: { type: "string", displayName: "Key" },
          value: { type: "string", displayName: "Value" }
        }
      },
      defaultValue: [
        { key: "Name", value: "John Doe" },
        { key: "Role", value: "Developer" }
      ]
    },
    className: {
      type: "string",
      displayName: "Class Name",
      defaultValue: ""
    },
    style: {
      type: "object",
      displayName: "Style",
      defaultValue: {}
    }
  }
});
PLASMIC.registerComponent(GlitchText, {
  name: "GlitchText",
  props: {
    children: {
      type: "string",
      defaultValue: "Glitch!",
    },
    speed: {
      type: "number",
      defaultValue: 0.5,
    },
    enableShadows: {
      type: "boolean",
      defaultValue: true,
    },
    enableOnHover: {
      type: "boolean",
      defaultValue: false,
    },
    className: {
      type: "string",
      defaultValue: "",
    },
  },
});
