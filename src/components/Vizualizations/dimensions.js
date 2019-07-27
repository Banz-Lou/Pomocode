const HistDetDimensions = {
  width: 650,
  height: 400,
  margin: { top: 20, right: 40, bottom: 20, left: 35 },
  colors: {
    planned: "#98abc5",
    actual: "#ff8c00",
    difference: "maroon"
  },
  legend: {
    rect: 2,
    spacing: 2,
    height: 2
  }
};

const [DetailsGraphsDimensionsWidth, DetailsGraphsDimensionsHeight] = [
  650,
  400
];
const DetailsGraphsDimensions = {
  width: DetailsGraphsDimensionsWidth,
  height: DetailsGraphsDimensionsHeight,
  margin: {
    top: 20,
    right: DetailsGraphsDimensionsWidth * 0.25,
    bottom: 20,
    left: 35
  },
  colors: {
    planned: "#98abc5",
    actual: "#ff8c00",
    difference: "maroon"
  },
  legend: {
    rectY: 0,
    rectW: 10,
    rectH: 10,
    Active: "#ff8c00",
    Idle: "maroon",
    Plan: "pink",
    Total: "green",
    positionX: DetailsGraphsDimensionsWidth * 0.8,
    positionY: DetailsGraphsDimensionsHeight * 0.5,
    keySpacing: 15
  }
};

const [IntUpdDimensionsWidth, IntUpdDimensionsHeight] = [650, 100];

const IntUpdDimensions = {
  width: IntUpdDimensionsWidth,
  height: IntUpdDimensionsHeight,
  margin: {
    top: 20,
    right: IntUpdDimensionsWidth * 0.25,
    bottom: 20,
    left: 35
  },
  barHeight: 10,
  colors: {
    planned: "#98abc5",
    active: "#ff8c00",
    prior_active: "maroon"
  },
  legend: {
    rectY: -11,
    rectW: 10,
    rectH: 10,
    Plan: "#98abc5",
    Active: "#ff8c00",
    "Prior Active": "maroon",
    positionX: IntUpdDimensionsWidth * 0.8,
    positionY: IntUpdDimensionsHeight / 2 - 10,
    keySpacing: 15
  }
};

module.exports = {
  HistDetDimensions,
  IntUpdDimensions,
  DetailsGraphsDimensions
};
