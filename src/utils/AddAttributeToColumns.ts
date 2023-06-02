export const addedAttribute = (attributes: any, columns: any) => {
  for (let i = attributes.length - 1; i >= 0; i--) {
    const object = attributes[i];
    columns.unshift(object);
  }
};
