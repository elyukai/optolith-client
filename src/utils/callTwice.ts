export const callTwice = <T, R>(fn: (x: T) => (x: T) => R) => {
  return (x: T) => fn(x)(x);
};
