export const fakeApiCall = async (data: unknown) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() > 0.2 ? resolve(data) : reject("API Error");
    }, 1000);
  });
};