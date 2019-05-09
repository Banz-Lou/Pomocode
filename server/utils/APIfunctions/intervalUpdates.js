class intUpdFunct {
  powerUp(originalData) {
    let hashObj = {};
    originalData.forEach(issue => {
      if (hashObj[issue.true_interval_num]) {
        hashObj[issue.true_interval_num].push(issue);
      } else {
        hashObj[issue.true_interval_num] = [issue];
      }
    });
    return Object.values(hashObj);
  }
}

module.exports = new intUpdFunct();
