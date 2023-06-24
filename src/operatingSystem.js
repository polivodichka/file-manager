import os from "os";

export const getOsInfo = function () {
  return JSON.stringify(os.EOL);
};

export const getCpus = function () {
  const cpus = {};
  os.cpus().forEach((cpu, index) => {
    const { model, speed } = cpu;
    const clockRate = (speed / 1000).toFixed(2); // Convert to GHz
    cpus[index + 1] = {
      Model: model.trim(),
      "Clock Rate (GHz)": clockRate,
    };
  });
  return cpus;
};

export const getHomeDir = function () {
  return String(os.homedir);
};

export const getUserName = function () {
  return os.userInfo().username;
};

export const getArchitecture = function () {
  return os.arch();
};
