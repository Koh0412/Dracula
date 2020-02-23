export function Elapsed(label?: string) {
  return (target: any, name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    descriptor.value = function() {
      console.time(label);
      method.apply(this, arguments);
      console.timeEnd(label);
    };
  };
}