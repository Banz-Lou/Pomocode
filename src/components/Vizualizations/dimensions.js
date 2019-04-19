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

const IntUpdDimensions = {
  width: 650,
  height: 100,
  margin: { top: 20, right: 40, bottom: 20, left: 35 },
  colors: {
    planned: "#98abc5",
    active: "#ff8c00",
    prior_active: "maroon"
  },
  legend: {
    rect: 2,
    spacing: 2,
    height: 2
  }
};

module.exports = {
  HistDetDimensions,
  IntUpdDimensions
};
