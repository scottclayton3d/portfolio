import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import BulletHellGame from "./components/game/BulletHellGame";
import ModelViewer3D from "./components/ui/ModelViewer3D";
import Dock from "./components/dock";
import PixelCard from "./components/pixelcard";
import ShapeBlur from "./components/shapeBlur";
import Particles from "./components/particles";
import ASCIIText from "./components/asciText";
import { UnicornStudioEmbed } from "./components/UnicornStudioEmbed";
import Masonry from "./components/masonry";
import GridMotion from "./components/gridMotion";



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
  }
});
PLASMIC.registerComponent(Dock, {
  name: 'Dock',
  props: {
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
PLASMIC.registerComponent(PixelCard, {
  name: 'PixelCard',
  props: {
    className:'string',
    width:'number',
    height:'number',
    x:'number',
    y:'number',
    color: 'string',
    speed:'number',
    size:'number',
    sizeStep:'number',
    minSize:'number',
    maxSizeInteger:'number',
    maxSize:'number',
    delay:'number',
    counter:'number',
    counterStep:'number',
    isIdle:'boolean',
    isReverse:'boolean',
    isShimmer:'boolean',
  } 
})
PLASMIC.registerComponent(Masonry, {
  name: "Masonry",
  props: {
    data: {
      type: "array",
      displayName: "Items",
      itemType: {
        type: "object",
        fields: {
          id: { type: "string", displayName: "ID" },
          height: { type: "number", displayName: "Height" },
          image: { type: "slot", displayName: "Image URL" }
        }
      },
      defaultValue: [
        { id: "1", height: 300, image: "https://images.unsplash.com/photo-1" },
        { id: "2", height: 200, image: "https://images.unsplash.com/photo-2" }
      ]
    }
  }
});
PLASMIC.registerComponent(GridMotion, {
  name: "GridMotion",
  props: {
    items: {
      type: "array",
      displayName: "Items",
      itemType: {
        type: "object",
        displayName: "Item"
      },
      defaultValue: []
    },
    gradientColor: {
      type: "string",
      displayName: "Gradient Color",
      defaultValue: "black",
    }
  }
});