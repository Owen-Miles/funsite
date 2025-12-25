// Type declarations for X3DOM elements
declare namespace JSX {
  interface IntrinsicElements {
    x3d: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      width?: number;
      height?: number;
    };
    Scene: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    Background: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      skyColor?: string;
    };
    Viewpoint: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      fieldOfView?: string;
      position?: string;
      description?: string;
      orientation?: string;
      centerOfRotation?: string;
    };
    NavigationInfo: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      type?: string;
      speed?: string;
      headlight?: string;
    };
    DirectionalLight: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      ambientIntensity?: string;
      intensity?: string;
      color?: string;
    };
    Transform: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      DEF?: string;
      translation?: string;
      rotation?: string;
      scale?: string;
    };
    Shape: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    Appearance: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    Material: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      ambientIntensity?: string;
      emissiveColor?: string;
      diffuseColor?: string;
      specularColor?: string;
      shininess?: string;
      transparency?: string;
    };
    IndexedLineSet: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      colorPerVertex?: string;
      coordIndex?: string;
    };
    IndexedFaceSet: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      colorPerVertex?: string;
      coordIndex?: string;
      solid?: string;
    };
    Coordinate: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      DEF?: string;
      point?: string;
    };
    Color: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      DEF?: string;
      color?: string;
    };
  }
}

export {};

