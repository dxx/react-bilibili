interface StyleModule {
  [key: string]: string;
}

declare module "*.css?css-modules" {
  const style: StyleModule;
  export default style;
}

declare module "*.less?css-modules" {
  const style: StyleModule;
  export default style;
}

declare module "*.sass?css-modules" {
  const style: StyleModule;
  export default style;
}

declare module "*.scss?css-modules" {
  const style: StyleModule;
  export default style;
}

declare module "*.styl?css-modules" {
  const style: StyleModule;
  export default style;
}
