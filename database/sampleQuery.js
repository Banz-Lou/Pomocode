IntervalQuery.max('trueintervalid', { where: { user: user } })
.then(max => {
  const display = 5;
  IntervalQuery.selectAll({
    where: { trueintervalid >= (max - display) }
  })

})
