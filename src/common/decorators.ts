export const date = new Date();
export const info = `[${date.toUTCString()}]: INFO:`;

export type IDecorator = (target: any, name: string, descriptor: PropertyDescriptor) => void;

export function Elapsed(label?: string): IDecorator {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function() {
      console.time(` ${info} ${label}`);
      Reflect.apply(method, this, arguments);
      console.timeEnd(` ${info} ${label}`);
    };
  };
}

export function initLog(): IDecorator {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function() {
      console.log(`${info} [PLATFORM] => ${process.platform}`);
      console.log(` ${info} [ARCH] => ${process.arch}`);
      console.log(` ${info} [NODE VERSION] => ${process.version}`);
      console.log(` ${info} launch electron application...`);
      Reflect.apply(method, this, arguments);
    };
  };
}

export function stopAppLog(): IDecorator {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function() {
      Reflect.apply(method, this, arguments);
      console.log(` ${info} application is quit.`);
    };
  };
}